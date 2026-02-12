import React, { useState } from 'react';
import AZButton from '../../../components/elements/AZButton';

const ALPHABET = '0123456789abcdefghijklmnopqrstuv'; // base32
const BASE = 32;

// 32-opcode instruction set
const OPCODES = [
	{ name: 'NOP', desc: 'no operation' },
	{ name: 'RAND_R0', desc: 'R0 = random 0–255' },
	{ name: 'MARK', desc: 'marker (no-op anchor for FIND_MARK)' },
	{ name: 'MOVE', desc: 'move forward' },
	{ name: 'ROT_R', desc: 'rotate right' },
	{ name: 'ROT_L', desc: 'rotate left' },
	{ name: 'HIT', desc: 'attack forward' },
	{ name: 'SPLIT', desc: 'divide organism' },
	{ name: 'EXAM_SELF', desc: 'scan self; write S0 - size, S1 - current energy,' },
	{ name: 'EXAM_FRONT', desc: 'scan front; write S0 - size (mass), S1,S2,S3 - color' },
	{ name: 'MOV_R0_R1', desc: 'R0 = R1' },
	{ name: 'MOV_R1_R0', desc: 'R1 = R0' },
	{ name: 'SWAP_R0_R1', desc: 'swap R0 and R1' },
	{ name: 'CLR_R0', desc: 'R0 = 0' },
	{ name: 'INC_R0', desc: 'R0++' },
	{ name: 'DEC_R0', desc: 'R0--' },
	{ name: 'ADD_R0_R1', desc: 'R0 = R0 + R1' },
	{ name: 'SUB_R0_R1', desc: 'R0 = R0 - R1' },
	{ name: 'AND_R0_R1', desc: 'R0 = R0 & R1' },
	{ name: 'XOR_R0_R1', desc: 'R0 = R0 ^ R1' },
	{ name: 'CMP_R0_R1', desc: 'ZF = (R0 == R1)' },
	{ name: 'CMP_R0_ZERO', desc: 'ZF = (R0 == 0)' },
	{ name: 'JMP_REL', desc: 'IP += offset (relative jump)' },
	{ name: 'JZ_REL', desc: 'if ZF==1 jump relative' },
	{ name: 'JNZ_REL', desc: 'if ZF==0 jump relative' },
	{ name: 'LOOP_R0', desc: 'R0--; jump if R0 != 0' },
	{ name: 'FIND_MARK', desc: 'find next MARK; put index into R0' },
	{ name: 'SET_IP_R0', desc: 'IP = R0' },
	{ name: 'READ_GEN_R0', desc: 'R0 = GEN[R1]' },
	{ name: 'WRITE_GEN_R0', desc: 'GEN[R1] = R0' },
	{ name: 'INSERT_GEN', desc: 'insert R0 at GEN[R1]' },
	{ name: 'DELETE_GEN', desc: 'delete GEN[R1]' }
];

// ---- Base32 helper functions ----
function base32ToInt(str) {
	let value = 0;
	for (let i = 0; i < str.length; i++) {
		const idx = ALPHABET.indexOf(str[i]);
		if (idx === -1) throw new Error('Invalid DNA character');
		value = value * BASE + idx;
	}
	return value;
}

function intToBase32(num, length = 1) {
	let result = '';
	for (let i = 0; i < length; i++) {
		result = ALPHABET[num % BASE] + result;
		num = Math.floor(num / BASE);
	}
	return result;
}

// ---- Instruction encoding/decoding ----
function decodeInstruction(chunk) {
	const raw = base32ToInt(chunk);
	const opcode = (raw >> 15) & 0b1111111111; // top 5 bits (0-31)
	const operand = raw & 0b1111111111; // lower 15 bits

	const opInfo = OPCODES[opcode] || { name: 'UNKNOWN', desc: 'undefined instruction' };
	return { chunk, raw, opcode, operand, name: opInfo.name, desc: opInfo.desc };
}

function encodeInstruction(opcode, operand) {
	const raw = ((opcode & 0b1111111111) << 15) | (operand & 0b1111111111);
	return intToBase32(raw, 4);
}

// ---- Random DNA generation ----
function randomDNA(length) {
	let result = '';
	for (let i = 0; i < length; i++) {
		const idx = Math.floor(Math.random() * BASE);
		result += ALPHABET[idx];
	}
	return result;
}

// ---- Color encoding: 1 char per channel, 0-31 (32 levels) ----
function randomColorDNA() {
	const pick = () => ALPHABET[Math.floor(Math.random() * 32)];
	return Array.from({ length: 6 }, pick).join('');
}

export default function DNAInterpreter() {
	const [dna, setDna] = useState('');
	const [decoded, setDecoded] = useState([]);
	const [color, setColor] = useState({ r: 0, g: 0, b: 0, r1: 0, g1: 0, b1: 0 });

	function generate() {
		const colorPart = randomColorDNA(); // first 3 chars for color
		const codeLength = 20 * 4; // multiple of 4
		const codePart = randomDNA(codeLength);
		const fullDNA = colorPart + '00' + codePart;

		setDna(fullDNA);

		console.log(fullDNA.length, fullDNA)
		setColor({
			r: ALPHABET.indexOf(colorPart[0]) * 8,
			g: ALPHABET.indexOf(colorPart[1]) * 8,
			b: ALPHABET.indexOf(colorPart[2]) * 8,
			r1: ALPHABET.indexOf(colorPart[3]) * 8,
			g1: ALPHABET.indexOf(colorPart[4]) * 8,
			b1: ALPHABET.indexOf(colorPart[5]) * 8
		});

		// Decode instructions
		const instructions = [];
		for (let i = 8; i < fullDNA.length; i += 4) {
			const chunk = fullDNA.slice(i, i + 4);
			instructions.push(decodeInstruction(chunk));
		}
		setDecoded(instructions);
	}

	return (
		<div style={{ fontFamily: 'monospace', padding: 20 }}>
			<h3>DNA Interpreter</h3>

			<AZButton onClick={generate}>Generate Random DNA</AZButton>

			<div style={{ marginTop: 10 }}>
				<strong>DNA:</strong>
				<div>{dna}</div>
			</div>

			<div style={{ marginTop: 10 }}>
				<strong>Color (RGB 0-31 each):</strong>
				<br />

				<div style={{
					display: 'inline-block', width: '3ch', height: '3ch', border: '2px solid black',
					backgroundColor: `rgb(${color.r},${color.g},${color.b})`
				}}>
				</div>
				<span>R: {color.r}, G: {color.g}, B: {color.b}</span>
				<br />
				<div style={{
					display: 'inline-block', width: '3ch', height: '3ch', border: '2px solid black',
					backgroundColor: `rgb(${color.r1},${color.g1},${color.b1})`
				}}>
				</div>
				<span>R: {color.r1}, G: {color.g1}, B: {color.b1}</span>

			</div>

			<div style={{ marginTop: 20 }}>
				<strong>Decoded Instructions:</strong>
				{decoded.map((inst, i) => (
					<div key={i}>
						[{('0000'.substring((i + '').length) + i)}] {(inst.chunk).toUpperCase()} → {inst.name} ({inst.desc}), operand: {inst.operand}
					</div>
				))}
			</div>
		</div>
	);
}
