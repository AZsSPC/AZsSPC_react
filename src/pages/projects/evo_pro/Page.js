import React, { useState, useEffect, useMemo } from 'react';
import AZButton from '../../../components/elements/AZButton';
import AZRuntimeButton from '../../../components/elements/AZRuntimeButton';
import HexWorld from './HexWorld';
import Cell from './Cell';
import RuntimeProvider from '../../../providers/RuntimeProvider';
import { useRuntime } from '../../../providers/RuntimeProvider';

function DNAInterpreterInner() {
	const [regenKey, setRegenKey] = useState(0);
	const [time, setTime] = useState(0);
	const petri_size = useMemo(() => ({ x: 20, y: 20 }), []);
	const [petri, setPetri] = useState(() => Array.from(
		{ length: petri_size.x },
		() => Array.from(
			{ length: petri_size.y },
			() => Math.random() < 0.2 ? Cell.random() : null
		)
	));

	const { registerRunner } = useRuntime();

	useEffect(() => {
		registerRunner(() => {
			setTime(prev => prev + 1);
			return true; // continue running
		});
	}, [registerRunner]);

	function generate() {
		setPetri(Array.from(
			{ length: petri_size.x },
			() => Array.from(
				{ length: petri_size.y },
				() => Math.random() < 0.2 ? Cell.random() : null
			)
		));
		setRegenKey(prev => prev + 1);
		setTime(0);
	}

	return (
		<>
			<AZRuntimeButton />
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

			<HexWorld regenerateKey={regenKey} petri={petri} petri_size={petri_size} time={time} />
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
