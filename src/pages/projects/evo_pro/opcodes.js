// 64-opcode instruction set
const OPCODES = {

    0b000000: {
        name: 'NOP',
        desc: 'no operation',
        color: 'gray',
        cost: () => true,
        action: () => null
    },

    /* ================= RNG ================= */

    0b000001: {
        name: 'RAND_R0',
        desc: 'R0 = random 0–255',
        cost: () => true,
        action: (cell) => {
            cell.cpu.R0 = Math.random() * 256 | 0;
        }
    },

    /* ================= MOVEMENT ================= */

    0b000010: {
        name: 'MOVE',
        desc: 'move forward',
        color: 'yellow',
        fatigue: 20,
        cost: (cell) => {
            if ((cell.stat.energy || 0) <= 0.5) return false;
            cell.stat.energy -= 0.5;
            return true;
        },
        action: () => ({ intent: { type: 'MOVE' } })
    },

    0b000011: {
        name: 'SPLIT',
        desc: 'divide organism',
        fatigue: 100,
        cost: (cell) => {
            if (cell.stat.energy < 20 || cell.stat.mass < 10) return false;
            cell.stat.energy *= 0.5;
            cell.stat.mass *= 0.5;
            return true;
        },
        action: () => ({ intent: { type: 'SPLIT' } })
    },

    0b000100: {
        name: 'ROT_R',
        desc: 'rotate right',
        fatigue: 10,
        cost: () => true,
        action: (cell) => {
            cell.rotation = (cell.rotation + 1) % 6;
        }
    },

    0b000101: {
        name: 'ROT_L',
        desc: 'rotate left',
        fatigue: 10,
        cost: () => true,
        action: (cell) => {
            cell.rotation = (cell.rotation + 5) % 6;
        }
    },

    /* ================= COMBAT ================= */

    0b000110: {
        name: 'HIT',
        desc: 'attack forward',
        fatigue: 15,
        cost: (cell) => {
            if (cell.stat.energy < 2) return false;
            cell.stat.energy -= 2;
            return true;
        },
        action: () => ({ intent: { type: 'ATTACK' } })
    },

    0b000111: {
        name: 'BITE',
        desc: '',
        cost: () => true,
        action: () => null
    },

    /* ================= SENSORS ================= */

    0b001000: {
        name: 'EXAM_SELF',
        desc: 'scan self',
        cost: () => true,
        action: (cell) => {
            cell.cpu.R0 = cell.stat.mass | 0;
            cell.cpu.R1 = cell.stat.energy | 0;
        }
    },

    0b001001: {
        name: 'EXAM_FRONT',
        desc: 'scan forward cell',
        cost: () => true,
        is_scan: true,
        action: (cell, target) => {
            if (!target) {
                cell.cpu.R0 = 0;
                cell.cpu.R1 = 0;
                cell.cpu.ZF = 1;
                return;
            }
            cell.cpu.R0 = target.stat.mass | 0;
            cell.cpu.R1 = target.frontColor.r;
            cell.cpu.ZF = 0;
        }
    },

    /* ================= REGISTER OPS ================= */

    0b001010: {
        name: 'MOV_R0_R1', cost: () => true,
        action: (c) => { c.cpu.R0 = c.cpu.R1; }
    },

    0b001011: {
        name: 'MOV_R1_R0', cost: () => true,
        action: (c) => { c.cpu.R1 = c.cpu.R0; }
    },

    0b001100: {
        name: 'SWAP_R0_R1', cost: () => true,
        action: (c) => {
            [c.cpu.R0, c.cpu.R1] = [c.cpu.R1, c.cpu.R0];
        }
    },

    0b001101: {
        name: 'CLR_R0', cost: () => true,
        action: (c) => { c.cpu.R0 = 0; }
    },

    0b001110: {
        name: 'INC_R0', cost: () => true,
        action: (c) => { c.cpu.R0 = (c.cpu.R0 + 1) & 255; }
    },

    0b001111: {
        name: 'DEC_R0', cost: () => true,
        action: (c) => { c.cpu.R0 = (c.cpu.R0 - 1) & 255; }
    },

    /* ================= ALU ================= */

    0b010000: {
        name: 'ADD_R0_R1', cost: () => true,
        action: (c) => { c.cpu.R0 = (c.cpu.R0 + c.cpu.R1) & 255; }
    },

    0b010001: {
        name: 'SUB_R0_R1', cost: () => true,
        action: (c) => { c.cpu.R0 = (c.cpu.R0 - c.cpu.R1) & 255; }
    },

    0b010010: {
        name: 'AND_R0_R1', cost: () => true,
        action: (c) => { c.cpu.R0 &= c.cpu.R1; }
    },

    0b010011: {
        name: 'XOR_R0_R1', cost: () => true,
        action: (c) => { c.cpu.R0 ^= c.cpu.R1; }
    },

    /* ================= FLAGS ================= */

    0b010100: {
        name: 'CMP_R0_R1', cost: () => true,
        action: (c) => { c.cpu.ZF = (c.cpu.R0 === c.cpu.R1) | 0; }
    },

    0b010101: {
        name: 'CMP_R0_ZERO', cost: () => true,
        action: (c) => { c.cpu.ZF = (c.cpu.R0 === 0) | 0; }
    },

    /* ================= FLOW ================= */

    0b010110: {
        name: 'JMP_REL', cost: () => true,
        action: (c, arg) => { c.q += arg; }
    },

    0b010111: {
        name: 'JZ_REL', cost: () => true,
        action: (c, arg) => { if (c.cpu.ZF) c.q += arg; }
    },

    0b011000: {
        name: 'JNZ_REL', cost: () => true,
        action: (c, arg) => { if (!c.cpu.ZF) c.q += arg; }
    },

    0b011001: {
        name: 'LOOP_R0', cost: () => true,
        action: (c, arg) => {
            c.cpu.R0 = (c.cpu.R0 - 1) & 255;
            if (c.cpu.R0 !== 0) c.q += arg;
        }
    },

    /* ================= DNA OPS ================= */

    0b011010: {
        name: 'FIND_MARK',
        cost: () => true,
        action: (cell) => {
            const code = cell.code;
            for (let i = cell.q; i < code.length; i += 4) {
                if (code[i] === 'M') { // пример
                    cell.cpu.R0 = i >> 2;
                    return;
                }
            }
            cell.cpu.R0 = 0;
        }
    },

    0b011011: {
        name: 'SET_IP_R0',
        cost: () => true,
        action: (c) => { c.q = c.cpu.R0; }
    },

    0b011100: {
        name: 'READ_GEN_R0',
        cost: () => true,
        action: (c) => {
            c.cpu.R0 = c.code.charCodeAt(c.cpu.R1 % c.code.length);
        }
    },

    0b011101: {
        name: 'WRITE_GEN_R0',
        cost: () => true,
        action: (c) => {
            // mutation handled in birth phase
            return { intent: { type: 'GEN_WRITE', index: c.cpu.R1, value: c.cpu.R0 } };
        }
    },

    0b011110: {
        name: 'INSERT_GEN',
        cost: () => true,
        action: (c) => {
            return { intent: { type: 'GEN_INSERT', index: c.cpu.R1, value: c.cpu.R0 } };
        }
    },

    0b011111: {
        name: 'DELETE_GEN',
        cost: () => true,
        action: (c) => {
            return { intent: { type: 'GEN_DELETE', index: c.cpu.R1 } };
        }
    },

    0b100000: {
        name: 'PHOTOSYNTH',
        desc: 'convert light → energy',
        fatigue: 40,
        cost: () => true,
        action: (cell) => {

            let gain = 2;

            if (cell.metaType === 0) gain = 6;
            else if (cell.metaType === 3) gain = 2;
            else gain = 1;

            cell.stat.energy += gain;
            cell.stat.waste += 0.2;
        }
    },

    0b100001: {
        name: 'ABSORB_FRONT',
        desc: 'absorb nutrients from front',
        fatigue: 25,
        cost: (cell) => {
            if (cell.stat.energy < 1) return false;
            cell.stat.energy--;
            return true;
        },
        action: () => ({ intent: { type: 'ABSORB' } })
    },

    0b100010: {
        name: 'PASSIVE_ABSORB',
        fatigue: 60,
        cost: () => true,
        action: (cell) => {
            cell.stat.nutrient_blue += 0.5;
        }
    },

    0b100011: {
        name: 'FILTER_WASTE',
        fatigue: 30,
        cost: (cell) => {
            if (cell.stat.energy < 2) return false;
            cell.stat.energy -= 2;
            return true;
        },
        action: (cell) => {
            cell.stat.waste = Math.max(0, cell.stat.waste - 3);
        }
    },

    0b100100: {
        name: 'DIGEST_GREEN',
        fatigue: 20,
        cost: () => true,
        action: (cell) => {

            let eff = [1.0, 1.6, 0.3, 1.2][cell.metaType];

            const used = Math.min(5, cell.stat.nutrient_green);

            cell.stat.nutrient_green -= used;
            cell.stat.energy += used * eff;
            cell.stat.waste += used * (2 - eff);
        }
    },

    0b100101: {
        name: 'DIGEST_RED',
        fatigue: 20,
        cost: () => true,
        action: (cell) => {

            let eff = [0.2, 0.8, 2.0, 1.3][cell.metaType];

            const used = Math.min(5, cell.stat.nutrient_red);

            cell.stat.nutrient_red -= used;
            cell.stat.energy += used * eff;
            cell.stat.waste += used * (2 - eff);
        }
    },

    0b100110: {
        name: 'DIGEST_BLUE',
        fatigue: 15,
        cost: () => true,
        action: (cell) => {
            const used = Math.min(4, cell.stat.nutrient_blue);
            cell.stat.nutrient_blue -= used;
            cell.stat.mass += used * 0.5;
        }
    },

    0b100111: {
        name: 'STORE_ENERGY',
        fatigue: 15,
        cost: (cell) => {
            if (cell.stat.energy < 5) return false;
            cell.stat.energy -= 5;
            return true;
        },
        action: (cell) => {
            cell.stat.mass += 2;
        }
    },

    0b101000: {
        name: 'BURN_MASS',
        fatigue: 10,
        cost: () => true,
        action: (cell) => {
            if (cell.stat.mass <= 1) return;
            cell.stat.mass -= 1;
            cell.stat.energy += 3;
            cell.stat.waste += 1;
        }
    },

    0b101001: {
        name: 'EXCRETE',
        fatigue: 10,
        cost: () => true,
        action: () => ({ intent: { type: 'EXCRETE' } })
    },

    0b101010: {
        name: 'CHECK_ENERGY',
        cost: () => true,
        action: (c) => {
            c.cpu.R0 = c.stat.energy | 0;
        }
    },

    0b101011: {
        name: 'CHECK_WASTE',
        cost: () => true,
        action: (c) => {
            c.cpu.R0 = c.stat.waste | 0;
        }
    },

    0b101100: {
        name: 'CHECK_MASS',
        cost: () => true,
        action: (c) => {
            c.cpu.R0 = c.stat.mass | 0;
        }
    },

    0b101101: {
        name: 'ID_TYPE',
        cost: () => true,
        action: (c) => {
            c.cpu.R0 = c.metaType;
        }
    },

    0b101110: {
        name: 'SLEEP',
        fatigue: 80,
        cost: () => true,
        action: (cell) => {
            cell.fatigue += 80;
            cell.stat.energy += 1;
        }
    },

    0b101111: {
        name: 'SIGNAL',
        cost: (cell) => {
            if (cell.stat.energy < 1) return false;
            cell.stat.energy--;
            return true;
        },
        action: () => ({ intent: { type: 'SIGNAL' } })
    },

};

export default OPCODES;