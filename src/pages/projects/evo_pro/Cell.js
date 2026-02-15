
const HEADER_SIZE = 8;
const ALPHABET = '0123456789abcdefghijklmnopqrstuv'.toUpperCase(); // base32
const BASE = 32;
const DEFAULT_DNA = 'gs5.5d2.00.1000.1000.2000.1000.1000.1000.2000.1000.1000.1g00'.toUpperCase().replaceAll('.', '');

// 64-opcode instruction set
const OPCODES = {
	0: {
		name: 'NOP', desc: 'no operation', color: 'gray',
		cost: { energy: 1, mass: 1, waste: 0, nutrient_green: 0, nutrient_red: 0, nutrient_blue: 0, },
		action: () => null
	},
	1: { name: 'RAND_R0', desc: 'R0 = random 0–255' },
	2: {
		name: 'MOVE', desc: 'move forward', color: 'yellow', time: 100,
		action: (cell) => ({ intent: { type: 'MOVE' } })
	},
	3: {
		name: 'SPLIT', desc: 'divide organism', time: 100,
		action: (cell) => ({ intent: { type: 'MOVE' } })
	},
	4: {
		name: 'ROT_R', desc: 'rotate right', time: 100,
		action: (cell) => { cell.rotation = (cell.rotation + 1) % 6; }
	},
	5: {
		name: 'ROT_L', desc: 'rotate left', time: 100,
		action: (cell) => { cell.rotation = (cell.rotation + 5) % 6; }
	},
	6: { name: 'HIT', desc: 'attack forward' },
	7: { name: 'MARK', desc: 'marker (no-op anchor for FIND_MARK)' },
	8: { name: 'EXAM_SELF', desc: 'scan self; write S0 - size, S1 - current energy,' },
	9: { name: 'EXAM_FRONT', desc: 'scan front; write S0 - size (mass), S1,S2,S3 - color' },
	10: { name: 'MOV_R0_R1', desc: 'R0 = R1' },
	11: { name: 'MOV_R1_R0', desc: 'R1 = R0' },
	12: { name: 'SWAP_R0_R1', desc: 'swap R0 and R1' },
	13: { name: 'CLR_R0', desc: 'R0 = 0' },
	14: { name: 'INC_R0', desc: 'R0++' },
	15: { name: 'DEC_R0', desc: 'R0--' },
	16: { name: 'ADD_R0_R1', desc: 'R0 = R0 + R1' },
	17: { name: 'SUB_R0_R1', desc: 'R0 = R0 - R1' },
	18: { name: 'AND_R0_R1', desc: 'R0 = R0 & R1' },
	19: { name: 'XOR_R0_R1', desc: 'R0 = R0 ^ R1' },
	20: { name: 'CMP_R0_R1', desc: 'ZF = (R0 == R1)' },
	21: { name: 'CMP_R0_ZERO', desc: 'ZF = (R0 == 0)' },
	22: { name: 'JMP_REL', desc: 'IP += offset (relative jump)' },
	23: { name: 'JZ_REL', desc: 'if ZF==1 jump relative' },
	24: { name: 'JNZ_REL', desc: 'if ZF==0 jump relative' },
	25: { name: 'LOOP_R0', desc: 'R0--; jump if R0 != 0' },
	26: { name: 'FIND_MARK', desc: 'find next MARK; put index into R0' },
	27: { name: 'SET_IP_R0', desc: 'IP = R0' },
	28: { name: 'READ_GEN_R0', desc: 'R0 = GEN[R1]' },
	29: { name: 'WRITE_GEN_R0', desc: 'GEN[R1] = R0' },
	30: { name: 'INSERT_GEN', desc: 'insert R0 at GEN[R1]' },
	31: { name: 'DELETE_GEN', desc: 'delete GEN[R1]' }
};

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
		cost: opInfo.cost ?? {},
		action: opInfo.action ?? ((cell_tile, target_tile) => ({ cell_tile, target_tile })),
		time: opInfo.time ?? 1
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
	}
	
	static step(cell) {
		cell.age++;

		let time = 10;
		let intent = null;

		const instructionCount = cell.code.length >> 2;

		if (instructionCount === 0)
			return { cell, intent: null };

		while (time > 0) {

			const idx = (cell.q++ % instructionCount) << 2;

			const op = decodeInstruction(
				cell.code.slice(idx, idx + 4)
			);

			if (!op) break;

			time -= op.time;

			const result = op.action(cell);

			if (result?.intent)
				intent = result.intent;
		}

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
