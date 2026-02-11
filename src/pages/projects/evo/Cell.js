const DEFGENES = 12;
const MUTATE_COUNT = 3;
const MUTATE_CHANCE = 0.1;
const TYPE = { EMPTY: 0, VEG: 1, MEAT: 2, KIN: 3, CELL: 4, GARBAGE: 5, A: 6, B: 7 };
const ROTATE = { U: 0, UR: 1, R: 2, DR: 3, D: 4, DL: 5, L: 6, UL: 7 };
const ACTION = { NONE: 0, MOVE: 1, RIGHT: 2, LEFT: 3, EAT: 4, HIT: 5, A: 6, B: 7 };

export default class Cell {
	constructor(braincells = 1, gen = 0, vis = null, dna = null, refs = {}) {
		const { idCounterRef, fixerRef } = refs;

		this.id = idCounterRef.current++;
		this.fixer = fixerRef.current;
		this.bcs = braincells;
		this.stp = 0;
		this.age = 0;
		this.gen = gen;
		this.way = (Math.random() * 8) | 0;
		this.dna = dna ?? this.randomDNA(this.bcs);

		this.kin = '#' + parseInt(this.dna.substr(0, 4), 8).toString(16);
		this.lima = parseInt(this.dna.substr(4, 3), 8) || 100;
		this.lime = parseInt(this.dna.substr(7, 3), 8) || 50;
		this.div = parseInt(this.dna.substr(10, 3), 8) || 30;

		this.vis = Math.min(this.lime, vis ?? this.div - 1);

		this._refs = refs;
	}

	step(x, y) {
		const {  fixerRef, petriRef } = this._refs;

		if (this.vis < 1 || this.age > this.lima) {
			this.die(x, y);
			return;
		}
		if (this.stp >= this.bcs) this.stp = 0;

		const next_cell = this.next_from(x, y, this.way);
		const front = petriRef.current[next_cell[0]][next_cell[1]];
		const front_type = typeof front === 'object' ? (front.kin === this.kin ? TYPE.KIN : TYPE.CELL) : front;
		const action = parseInt(this.dna.substr((DEFGENES + this.stp) * 8, 8).split('')[front_type]) || ACTION.NONE;

		switch (action) {
			case ACTION.RIGHT:
				this.way = (this.way + 1) % 8;
				this.vis--;
				break;
			case ACTION.LEFT:
				this.way = (this.way + 7) % 8;
				this.vis--;
				break;
			case ACTION.MOVE: {
				if (front_type === TYPE.EMPTY || front_type === TYPE.VEG || front_type === TYPE.MEAT) {
					petriRef.current[next_cell[0]][next_cell[1]] = this;
					if (this.vis >= this.div) {
						this.vis = (this.vis * 0.4) | 0;
						petriRef.current[x][y] = new Cell(this.bcs, this.gen + 1, this.vis, this.mutateDNA(this.dna), this._refs);
					} else {
						petriRef.current[x][y] = TYPE.EMPTY;
						this.vis--;
					}
				}
				break;
			}
			case ACTION.EAT:
				if (front_type === TYPE.VEG || front_type === TYPE.MEAT) {
					this.vis += 5;
					petriRef.current[next_cell[0]][next_cell[1]] = this;
					petriRef.current[x][y] = TYPE.EMPTY;
				}
				break;
			case ACTION.HIT:
				if (front_type === TYPE.KIN || front_type === TYPE.CELL) {
					petriRef.current[next_cell[0]][next_cell[1]].vis -= 10;
					front.react(next_cell[0], next_cell[1]);
					this.vis -= 3;
				} else if (front_type === TYPE.VEG || front_type === TYPE.MEAT) {
					petriRef.current[next_cell[0]][next_cell[1]] = TYPE.EMPTY;
				}
				break;
			default:
			case ACTION.NONE:
				this.vis--;
		}

		this.age++;
		this.stp++;
		this.fixer = fixerRef.current;
	}

	react(x, y) {
		if (this.vis < 1) this.die(x, y);
	}

	die(x, y) {
		const { petriRef } = this._refs;
		petriRef.current[x][y] = TYPE.MEAT;
	}

	next_from(x, y, r) {
		const { widthRef } = this._refs;
		let fx = x,
			fy = y;
		switch (r) {
			default:
			case ROTATE.U:
				fx = x;
				fy = y - 1;
				break;
			case ROTATE.UR:
				fx = x + 1;
				fy = y - 1;
				break;
			case ROTATE.R:
				fx = x + 1;
				fy = y;
				break;
			case ROTATE.DR:
				fx = x + 1;
				fy = y + 1;
				break;
			case ROTATE.D:
				fx = x;
				fy = y + 1;
				break;
			case ROTATE.DL:
				fx = x - 1;
				fy = y + 1;
				break;
			case ROTATE.L:
				fx = x - 1;
				fy = y;
				break;
			case ROTATE.UL:
				fx = x - 1;
				fy = y - 1;
				break;
		}
		if (fx < 0) fx += widthRef.current;
		else if (fx >= widthRef.current) fx = fx % widthRef.current;
		if (fy < 0) fy += widthRef.current;
		else if (fy >= widthRef.current) fy = fy % widthRef.current;
		return [fx, fy];
	}

	rg() {
		return (Math.random() * 8) | 0;
	}

	mutateDNA(dna) {
		let new_dna = dna;
		for (let i = MUTATE_COUNT; i > 0; i--) if (Math.random() > MUTATE_CHANCE)
			new_dna = new_dna.replace(new RegExp('(?<=^.{' + (Math.random() * dna.length | 0) + '}).'), this.rg());
		return new_dna;
	}

	randomDNA(braincells = 1) {
		if (braincells < 1) braincells = 1;
		let DNA = '';
		for (let i = (DEFGENES + braincells) * 8; i > 0; i--) DNA += this.rg();
		return DNA;
	}
}

export { DEFGENES, MUTATE_COUNT, MUTATE_CHANCE, TYPE, ROTATE, ACTION };
