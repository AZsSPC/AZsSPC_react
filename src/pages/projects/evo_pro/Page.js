import React, { useState } from 'react';
import AZButton from '../../../components/elements/AZButton';
import Cell from './Cell'

export default function DNAInterpreter() {
	const [cell, setCell] = useState(new Cell());

	function generate() {
		setCell(Cell.random());
	}

	return (
		<>
			<h3>DNA Interpreter</h3>

			<AZButton onClick={generate}>Generate Random DNA</AZButton>

			<div style={{ marginTop: 10 }}>
				<strong>DNA: </strong>
				<span style={{ wordBreak: 'break-all' }}>
					{cell.toString().replace('00', '.')}
				</span>
			</div>

			<div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
				<strong>Color:</strong>

				<div style={{
					width: '2em',
					height: '2em',
					border: `3px solid color-mix(in srgb, ${cell.getFrontColorCSS()}, ${cell.getBackColorCSS()})`,
					borderRadius: '1em',
					background: `radial-gradient(at 150%, ${cell.getFrontColorCSS()} 50%, ${cell.getBackColorCSS()} 50%)`
				}} />

			</div>

			<div style={{ marginTop: 20 }}>
				<strong>Decoded Instructions:</strong>

				{cell.getInstructions().map((inst, i) =>
					<div key={i} style={{ color: (inst.color || 'white') }}>
						[{i * 2}] {inst.chunk.slice(0, 2)}:{inst.chunk.slice(2)} {inst.name}
					</div>
				)}
			</div>
		</>
	);
}
