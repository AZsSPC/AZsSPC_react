import React, { useState } from 'react';
import AZButton from '../../../components/elements/AZButton';
import HexWorld from './HexWorld';
import Cell from './Cell';

export default function DNAInterpreter() {
	const [regenKey, setRegenKey] = useState(0);
	const petri_size = { x: 20, y: 20 }
	const petri = Array.from(
		{ length: petri_size.x },
		() => Array.from(
			{ length: petri_size.y },
			() => Math.random() < 0.2 ? Cell.random() : null
		)
	)

	function generate() {
		setRegenKey(prev => prev + 1);
	}

	return (
		<>

			<AZButton onClick={generate}>
				Generate Random DNA + Regenerate Map
			</AZButton>
			{/* 
			<div style={{ marginTop: 10 }}>
				<strong>DNA: </strong>
				<span style={{ wordBreak: 'break-all' }}>
					{cell.toString().replace('00', '.')}
				</span>
			</div> */}

			<HexWorld regenerateKey={regenKey} petri={petri} petri_size={petri_size} />
		</>
	);
}
