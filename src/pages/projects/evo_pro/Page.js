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
	// const iwRef = useRef(null); // size input
	// const ibRef = useRef(null); // brain cells input
	// const foodRef = useRef(null);
	const speedRef = useRef(null);
	const runtimeTimeoutRef = useRef(100);

	const petri_size = useMemo(() => ({ x: 50, y: 50 }), []);
	const [petri, setPetri] = useState(() => Array.from(
		{ length: petri_size.x },
		() => Array.from(
			{ length: petri_size.y },
			() => Math.random() < 0.1 ? new Cell() : "SPACE"
		)
	));

	const getNeighbor = useCallback((q, r, dir) => {
		const even = q % 2 === 0;

		switch (dir) {
			case 0: return [q, r + 1];              		// right
			case 1: return [q + 1, r + (even ? 0 : 1)]; 	// up-right
			case 2: return [q + 1, r + (even ? -1 : 0)];	// up-left
			case 3: return [q, r - 1];              		// left
			case 4: return [q - 1, r + (even ? -1 : 0)];	// down-left
			case 5: return [q - 1, r + (even ? 0 : 1)]; 	// down-right
			default: return [q, r];
		}
	}, [])


	const cycle = useCallback(() => {
		const shadow_petri = Array.from({ length: petri_size.x }, () => Array.from({ length: petri_size.y }, () => "SPACE"));

		for (let i = 0; i < petri_size.x; i++) for (let j = 0; j < petri_size.y; j++) {
			const cell = petri[i][j];

			if (!(cell instanceof Cell))
				continue;

			let [x, y] = getNeighbor(i, j, cell.rotation)

			const is_in_range = x >= 0 && y >= 0 && x < petri_size.x && y < petri_size.y;
			const target = is_in_range ? petri[x][y] : "WALL";

			const { cell_tile, target_tile } = Cell.step(cell, target);

			shadow_petri[i][j] = cell_tile;

			if (is_in_range)
				shadow_petri[x][y] = target_tile;
		}

		setPetri(shadow_petri);
		return true;
	}, [petri, petri_size, getNeighbor])

	const { registerRunner, timeout, setTimeout } = useRuntime();
	useEffect(() => { registerRunner(cycle); }, [registerRunner, cycle]);
	useEffect(() => { runtimeTimeoutRef.current = timeout; }, [timeout]);
	// useEffect(() => { if (!running) { draw(true); } }, [running]);

	function generate() {
		setPetri(Array.from(
			{ length: petri_size.x },
			() => Array.from(
				{ length: petri_size.y },
				() => Math.random() < 0.05 ? new Cell() : "SPACE"
			)
		));
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
