import OPCODES from './opcodes'

const HEADER_SIZE = 8;
const ALPHABET = '0123456789abcdefghijklmnopqrstuv'.toUpperCase(); // base32
const BASE = 32;
const DEFAULT_DNA = 'gs5.5d2.00.1000.1000.1000.1000.1g00'.toUpperCase().replaceAll('.', '');

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
	const raw = base32ToInt(chunk); // 20 bits

	const opcode = (raw >> 14) & 0b111111;     // top 6 bits (0–63)
	const operand = raw & 0b0011111111111111;  // lower 14 bits (0–16383)

	const opInfo = OPCODES[opcode] || {
		name: 'UNKNOWN',
		desc: 'undefined instruction'
	};

	return {
		chunk,
		raw,
		opcode,
		operand,
		name: opInfo.name,
		desc: opInfo.desc,
		color: opInfo.color,
		cost: opInfo.cost ?? { energy: 1 },
		action: opInfo.action ?? ((cell_tile, target_tile) => ({ cell_tile, target_tile })),
		fatigue: opInfo.fatigue ?? 1
	};
}

function encodeInstruction(opcode, operand) {
	const raw =
		((opcode & 0b111111) << 14) |
		(operand & 0b0011111111111111);

	return intToBase32(raw, 4);
}

// ---- Random DNA generation ----
function randomDNA(instructionCount) {
	let result = '';

	const opcodeCount = Object.keys(OPCODES).length;

	for (let i = 0; i < instructionCount; i++) {
		const opcode = Math.floor(Math.random() * opcodeCount);
		const operand = Math.floor(Math.random() * 16384); // 14-bit

		result += encodeInstruction(opcode, operand);
	}

	return result;
}

// ---- Color encoding: 1 char per channel, 0-31 (32 levels) ----
function randomColorDNA() {
	const pick = () => ALPHABET[Math.floor(Math.random() * BASE)];
	return Array.from({ length: 6 }, pick).join('');
}

export default class Cell {
	constructor(dna = DEFAULT_DNA, stat = {}) {
		this.dna = dna.toUpperCase();
		this.headerSize = HEADER_SIZE;
		this.rotation = Math.random() * 6 | 0;

		this.stat = {
			energy: 1,						// unlimited, energy<=0 means death
			mass: Math.random() * 99 + 1,	// float 1-100, out of bounds means death
			waste: 0,						// if 0-100, if bigger than mass - death
			nutrient_green: 0,
			nutrient_red: 0,
			nutrient_blue: 0,
			...stat				// override
		};

		this.header = this.dna.slice(0, this.headerSize);
		this.code = this.dna.slice(this.headerSize);

		this.frontColor = this.#decodeRGB(this.header.slice(0, 3));
		this.backColor = this.#decodeRGB(this.header.slice(3, 6));

		this.meta = this.header.slice(6, 8); // 2 extra chars (reserved)

		//this.instructions = this.#decodeInstructions();

		this.q = 2;
		this.age = 0;
		this.fatigue = 0;
	}

	static step(cell) {
		cell.age++;

		let intent = null;

		const instructionCount = cell.code.length >> 2;

		if (instructionCount === 0) return { cell, intent: null };

		while (cell.fatigue < 10) {
			const idx = (cell.q++ % instructionCount) << 2;

			const op = decodeInstruction(cell.code.slice(idx, idx + 4));
			if (!op) break;

			cell.fatigue += op.fatigue;

			const result = op.action(cell);

			if (result?.intent) intent = result.intent;
		}

		cell.fatigue -= 10;

		return { cell, intent };
	}


	// ---------- Static factory ----------

	static random() {
		const colorPart = randomColorDNA(); // 6 chars
		const meta = '00';
		const codeLength = (Math.random() * 50 | 0) + 20;
		const codePart = randomDNA(codeLength);

		return new Cell(colorPart + meta + codePart);
	}

	// ---------- Private helpers ----------

	#decodeRGB(chars) {
		return {
			r: ALPHABET.indexOf(chars[0]) * 7 + 15,
			g: ALPHABET.indexOf(chars[1]) * 7 + 15,
			b: ALPHABET.indexOf(chars[2]) * 7 + 15
		};
	}

	#decodeInstructions() {
		const result = [];

		for (let i = 0; i < this.code.length; i += 4) {
			const chunk = this.code.slice(i, i + 4);
			if (chunk.length < 4) continue;
			result.push(decodeInstruction(chunk));
		}

		return result;
	}

	// ---------- Public API ----------

	getFrontColorRGB() {
		return this.frontColor;
	}

	getBackColorRGB() {
		return this.backColor;
	}

	getFrontColorCSS() {
		const { r, g, b } = this.frontColor;
		return `rgb(${r},${g},${b})`;
	}

	getBackColorCSS() {
		const { r, g, b } = this.backColor;
		return `rgb(${r},${g},${b})`;
	}

	getInstructions() {
		return this.instructions;
	}

	getMetaInt() {
		return base32ToInt(this.meta);
	}

	toString() {
		return this.dna;
	}
}
