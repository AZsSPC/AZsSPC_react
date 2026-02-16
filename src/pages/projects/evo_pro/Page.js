import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import AZButton from '../../../components/elements/AZButton';
import AZRuntimeButton from '../../../components/elements/AZRuntimeButton';
import HexWorld from './HexWorld';
import Cell from './Cell';
import AZInstrumentsPanel, { AZInstrumentsSubpanel } from '../../../components/elements/AZInstrumentsPanel';
import AZInputRange from '../../../components/elements/AZInputRange';
import RuntimeProvider, { useRuntime } from '../../../providers/RuntimeProvider';
import './Styles.css';

function DNAInterpreterInner() {

	const speedRef = useRef(null);

	const petri_size = useMemo(() => ({ x: 200, y: 200 }), []);

	const [petri, setPetri] = useState(() =>
		Array.from({ length: petri_size.x }, () =>
			Array.from({ length: petri_size.y },
				() => Math.random() < 0.1 ? Cell.random() : "SPACE"
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
		}
		
		return [q, r];
	}, []);


	// ================= CYCLE =================
	const cycle = useCallback(() => {

		const petri = petriRef.current;

		/* ---------- Phase A ---------- */

		const intents = [];

		for (let x = 0; x < petri_size.x; x++) for (let y = 0; y < petri_size.y; y++) {
			const cell = petri[x][y];
			if (!(cell instanceof Cell)) continue;

			const { intent } = Cell.step(cell);

			if (intent?.type === 'MOVE') {

				const [nx, ny] = getNeighbor(x, y, cell.rotation);

				if (nx >= 0 && ny >= 0 && nx < petri_size.x && ny < petri_size.y) {
					intents.push({ cell, from: [x, y], to: [nx, ny] });
				}
			}
		}

		/* ---------- Phase B ---------- */

		const targets = new Map();

		for (const intent of intents) {
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

				// energy priority
				if (a.energy > b.energy) return candidate;
				if (a.energy < b.energy) return best;

				// mass priority
				if (a.mass > b.mass) return candidate;
				if (a.mass < b.mass) return best;

				// tie-break (important!)
				return Math.random() < 0.5 ? candidate : best;
			}, null);

			approved.push(winner);
		}

		/* ---------- Phase C ---------- */

		const next = petri.map(col => [...col]);

		for (const move of approved) {

			const [fx, fy] = move.from;
			const [tx, ty] = move.to;

			if (next[tx][ty] instanceof Cell) continue;

			next[fx][fy] = "SPACE";
			next[tx][ty] = move.cell;
		}

		petriRef.current = next;
		setPetri(next);

		return true;

	}, [petri_size, getNeighbor]);


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

	return (
		<>
			<AZInstrumentsPanel>
				<AZInstrumentsSubpanel>
					{/* <AZInputRange ref={foodRef} label="Food per cycle" color="green"
						min={0} max={50} defaultValue={5}
						onChange={(e) => { fcRef.current = parseInt(e.target.value, 10) || 0; }}
					/> */}
					<AZInputRange
						ref={speedRef}
						label="Speed"
						color="purple"
						min={0}
						max={10}
						defaultValue={5}
						onChange={(e) => {
							setTimeout(Math.round(5 * Math.pow(200, 1 - Number(e.target.value) / 10)));
						}}

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
		</>
	);
}


export default function DNAInterpreter() {
	return (
		<RuntimeProvider>
			<DNAInterpreterInner />
		</RuntimeProvider>
	);
}
