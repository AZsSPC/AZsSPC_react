import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import AZButton from '../../../components/elements/AZButton';
import AZRuntimeButton from '../../../components/elements/AZRuntimeButton';
import HexWorld from './HexWorld';
import Cell, { decodeInstruction } from './Cell';
import Blob from './Blob';
import AZInstrumentsPanel, { AZInstrumentsSubpanel } from '../../../components/elements/AZInstrumentsPanel';
import AZInputRange from '../../../components/elements/AZInputRange';
import RuntimeProvider, { useRuntime } from '../../../providers/RuntimeProvider';
import './Styles.css';

function DNAInterpreterInner() {

	const [mutationRate, setMutationRate] = useState(0.1);

	const petri_size = useMemo(() => ({ x: 200, y: 200 }), []);

	const [petri, setPetri] = useState(() =>
		Array.from({ length: petri_size.x }, () =>
			Array.from({ length: petri_size.y },
				() => Math.random() < 0.1 ? new Cell() : "SPACE"
			)
		)
	);

	const petriRef = useRef(petri);

	useEffect(() => { petriRef.current = petri; }, [petri]);


	// ===== HEX NEIGHBOR =====

	const getNeighbor = useCallback((q, r, dir) => {
		const even = r % 2 === 0;

		switch (dir) {
			case 0: return [q + 1, r];
			case 1: return [q + (even ? 0 : 1), r + 1];
			case 2: return [q + (even ? -1 : 0), r + 1];
			case 3: return [q - 1, r];
			case 4: return [q + (even ? -1 : 0), r - 1];
			case 5: return [q + (even ? 0 : 1), r - 1];
			default: return [q, r];
		}
	}, []);

	// ================= CYCLE =================
	const cycle = useCallback(() => {

		const petri = petriRef.current;

		/* ---------- Phase A: declare intentions ---------- */

		const intents_move = [];
		const intents_attack = [];
		const intents_birth = [];
		const intents_death = new Set();

		for (let x = 0; x < petri_size.x; x++)
			for (let y = 0; y < petri_size.y; y++) {

				const cell = petri[x][y];
				if (!(cell instanceof Cell)) continue;

				const instructionCount = cell.code.length >> 2;

				if (instructionCount !== 0) while (cell.fatigue < 10) {

					const idx = (cell.q++ % instructionCount) << 2;
					const op = decodeInstruction(cell.code.slice(idx, idx + 4));

					if (!op || !op.cost(cell)) break;

					cell.fatigue += op.fatigue ?? 1;

					const result = op.is_scan
						? op.action(cell, getNeighbor(x, y, cell.rotation))
						: op.action(cell);

					const type = result?.intent?.type;
					if (!type) continue;

					if (type === 'MOVE') {
						const [nx, ny] = getNeighbor(x, y, cell.rotation);

						if (nx >= 0 && ny >= 0 && nx < petri_size.x && ny < petri_size.y) {
							intents_move.push({ cell, from: [x, y], to: [nx, ny] });
						}
					}

					if (type === 'ATTACK') {
						const [tx, ty] = getNeighbor(x, y, cell.rotation);
						intents_attack.push({ attacker: cell, at: [x, y], target: [tx, ty] });
					}

					if (type === 'SPLIT') {
						intents_birth.push({ cell, at: [x, y] });
					}

					break; // 1 decisive action per tick
				}


				cell.age++;
				cell.fatigue = Math.max(0, cell.fatigue - 10);
			}

		/* ---------- Phase B: metabolism ---------- */
		// только внутренние процессы

		for (let x = 0; x < petri_size.x; x++)
			for (let y = 0; y < petri_size.y; y++) {

				const cell = petri[x][y];
				if (!(cell instanceof Cell)) continue;
				// базовый метаболизм (mass-dependent)
				cell.stat.energy -= 0.1 + 0.02 * (cell.stat.mass || 0);
				cell.stat.waste += 0.1 * cell.age;

				// здоровье падает если мусора слишком много (больше половины массы)
				const excessWaste = (cell.stat.waste || 0) - (cell.stat.mass || 0) / 2;
				if (excessWaste > 0) {
					const healthLoss = excessWaste * 0.1;
					cell.stat.health = Math.max(0, (cell.stat.health || 0) - healthLoss);
				}
			}

		/* ---------- Phase C: resolve fights ---------- */

		for (const atk of intents_attack) {

			const [tx, ty] = atk.target;
			if (
				tx < 0 || ty < 0 ||
				tx >= petri_size.x || ty >= petri_size.y
			) continue;

			const target = petri[tx][ty];
			if (!(target instanceof Cell)) continue;

			const dmg = atk.attacker.stat.mass * 0.1;
			target.stat.mass -= dmg;
			// здоровье падает при атаке
			target.stat.health = Math.max(0, (target.stat.health || 0) - dmg);
			// атакующий получает часть энергии от урона
			atk.attacker.stat.energy = (atk.attacker.stat.energy || 0) + dmg * 0.8;
		}

		/* ---------- Phase D: resolve deaths ---------- */

		for (let x = 0; x < petri_size.x; x++) for (let y = 0; y < petri_size.y; y++) {

			const cell = petri[x][y];
			if (!(cell instanceof Cell)) continue;

			if (
				cell.stat.energy <= 0 ||
				cell.stat.mass <= 0 ||
				cell.stat.waste > cell.stat.mass
			) {
				// const hv = [cell.stat.energy <= 0, cell.stat.mass <= 0, cell.stat.waste > cell.stat.mass]
				// console.log(...hv)
				intents_death.add(`${x},${y}`);
			}
		}

		// if (intents_death.size > 0) console.log(`%c-${intents_death.size}`, 'color: red')

		/* ---------- Phase E: resolve births ---------- */

		const births = [];

		for (const b of intents_birth) {

			const [x, y] = b.at;
			const parent = petri[x][y];
			if (!(parent instanceof Cell)) continue;

			const [nx, ny] = getNeighbor(x, y, parent.rotation);

			if (
				nx < 0 || ny < 0 ||
				nx >= petri_size.x || ny >= petri_size.y
			) continue;

			if (petri[nx][ny] instanceof Cell) continue;

			if (parent.stat.energy < 5) continue;

			parent.stat.energy *= 0.5;
			parent.stat.mass *= 0.5;

			const child = new Cell(parent.dna, { energy: parent.stat.energy }, mutationRate);

			births.push({ child, at: [nx, ny] });
		}

		// if (births.length > 0) console.log(`%c+${births.length}`, 'color: green')
		/* ---------- Phase F: resolve moves ---------- */

		const targets = new Map();

		for (const intent of intents_move) {
			const key = intent.to.join(',');
			if (!targets.has(key)) targets.set(key, []);
			targets.get(key).push(intent);
		}

		const approved = [];

		for (const list of targets.values()) {
			const winner = list.reduce((best, candidate) => {
				if (!best) return candidate;

				const a = candidate.cell.stat;
				const b = best.cell.stat;

				if (a.energy !== b.energy)
					return a.energy > b.energy ? candidate : best;

				if (a.mass !== b.mass)
					return a.mass > b.mass ? candidate : best;

				return Math.random() < 0.5 ? candidate : best;
			}, null);

			approved.push(winner);
		}

		const next = petri.map(col => [...col]);

		// удалить мёртвых -> превращаем в Blob (куча нутриентов)
		for (const key of intents_death) {
			const [x, y] = key.split(',').map(Number);
			const dead = petri[x][y];
			if (dead instanceof Cell) {
				const blobStat = {
					energy: (dead.stat.energy || 0) + (dead.stat.mass || 0), // масса превращается в энергию
					mass: 0,
					nutrient_red: dead.stat.nutrient_red || 0,
					nutrient_green: dead.stat.nutrient_green || 0,
					nutrient_blue: dead.stat.nutrient_blue || 0,
					waste: dead.stat.waste || 0
				};
				next[x][y] = new Blob(blobStat);
			}
		}

		// применить движения (включая поглощение Blob)
		for (const move of approved) {

			const [fx, fy] = move.from;
			const [tx, ty] = move.to;

			if (intents_death.has(`${fx},${fy}`)) continue;

			const targetVal = next[tx][ty];
			// если на месте Blob — поглотить
			if (targetVal instanceof Blob) {
				const blob = targetVal;
				move.cell.stat.energy = (move.cell.stat.energy || 0) + (blob.stat.energy || 0) * 0.5;
				move.cell.stat.mass = (move.cell.stat.mass || 0) + (blob.stat.mass || 0) * 0.3;
				for (const [k, v] of Object.entries(blob.stat)) {
					if (k.startsWith('nutrient_')) {
						move.cell.stat[k] = (move.cell.stat[k] || 0) + v;
					}
				}
				next[tx][ty] = "SPACE"; // убрать Blob
			}

			if (next[tx][ty] instanceof Cell) continue;

			next[fx][fy] = "SPACE";
			next[tx][ty] = move.cell;
		}

		// применить рождения
		for (const b of births) {
			const [x, y] = b.at;
			if (!(next[x][y] instanceof Cell))
				next[x][y] = b.child;
		}

		/* ---------- End ---------- */

		petriRef.current = next;
		setPetri(next);

		return true;

	}, [petri_size, mutationRate, getNeighbor]);



	const { registerRunner, timeout, setTimeout } = useRuntime();
	const runtimeTimeoutRef = useRef(100);
	useEffect(() => { registerRunner(cycle); }, [registerRunner, cycle]);
	useEffect(() => { runtimeTimeoutRef.current = timeout; }, [timeout]);
	// useEffect(() => { if (!running) { draw(true); } }, [running]);


	function generate() {

		const world = Array.from(
			{ length: petri_size.x },
			() => Array.from(
				{ length: petri_size.y },
				() => Math.random() < 0.05 ? Cell.random() : "SPACE"
			)
		);

		petriRef.current = world;
		setPetri(world);
	}

	return (<main>
		<AZInstrumentsPanel>
			<AZInstrumentsSubpanel>
				{/* <AZInputRange ref={foodRef} label="Food per cycle" color="green"
						min={0} max={50} defaultValue={5}
						onChange={(e) => { fcRef.current = parseInt(e.target.value, 10) || 0; }}
					/> */}
				<AZInputRange
					label="Speed"
					color="purple"
					min={0}
					max={10}
					defaultValue={5}
					onChange={(e) => {
						setTimeout(Math.round(Math.pow(200, 1 - Number(e.target.value) / 10)));
					}}

				/>
				<AZInputRange
					label="Mutation %"
					color="purple"
					min={0.001}
					max={0.5}
					step={0.001}
					defaultValue={0.1}
					onChange={(e) => { setMutationRate(e.target.value); }}

				/>
			</AZInstrumentsSubpanel>

			<AZInstrumentsSubpanel>
				{/* <AZInputValue ref={iwRef} label="Size" color="magenta"
						min={10} max={100} step={1} defaultValue={20}
					/> */}
				<AZButton onClick={generate} color="gold">Reset</AZButton>
				<AZRuntimeButton />
			</AZInstrumentsSubpanel>
		</AZInstrumentsPanel>
		{/* 
			<div style={{ marginTop: 10 }}>
				<strong>DNA: </strong>
				<span style={{ wordBreak: 'break-all' }}>
					{cell.toString().replace('00', '.')}
				</span>
			</div> */}

		<HexWorld petri={petri} petri_size={petri_size} />
	</main>
	);
}


export default function DNAInterpreter() {
	return (
		<RuntimeProvider>
			<DNAInterpreterInner />
		</RuntimeProvider>
	);
}
