import React, { useState } from 'react';
import AZButton from '../../../components/elements/AZButton';
import Cell from './Cell';
import HexWorld from './HexWorld';

export default function DNAInterpreter() {
	const [cell, setCell] = useState(new Cell());
	const [regenKey, setRegenKey] = useState(0);

	function generate() {
		setCell(Cell.random());
		setRegenKey(prev => prev + 1);
	}

	return (
		<>
			<h3>DNA Interpreter</h3>

			<AZButton onClick={generate}>
				Generate Random DNA + Regenerate Map
			</AZButton>

			<div style={{ marginTop: 10 }}>
				<strong>DNA: </strong>
				<span style={{ wordBreak: 'break-all' }}>
					{cell.toString().replace('00', '.')}
				</span>
			</div>

			<div style={{ marginTop: 10 }}>
				<strong>Color:</strong>
				<div
					style={{
						width: '2em',
						height: '2em',
						borderRadius: '1em',
						background: cell.getFrontColorCSS()
					}}
				/>
			</div>

			<HexWorld regenerateKey={regenKey} />
		</>
	);
}
