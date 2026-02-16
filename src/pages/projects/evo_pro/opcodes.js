// 64-opcode instruction set
const OPCODES = {
    0: {
        name: 'NOP', desc: 'no operation', color: 'gray',
        cost: { energy: 1, mass: 1, waste: 0, nutrient_green: 0, nutrient_red: 0, nutrient_blue: 0, },
        action: () => null
    },
    1: { name: 'RAND_R0', desc: 'R0 = random 0–255' },
    2: {
        name: 'MOVE', desc: 'move forward', color: 'yellow', fatigue: 20,
        action: (cell) => ({ intent: { type: 'MOVE' } })
    },
    3: {
        name: 'SPLIT', desc: 'divide organism', fatigue: 100,
        action: (cell) => ({ intent: { type: 'MOVE' } })
    },
    4: {
        name: 'ROT_R', desc: 'rotate right', fatigue: 10,
        action: (cell) => { cell.rotation = (cell.rotation + 1) % 6; }
    },
    5: {
        name: 'ROT_L', desc: 'rotate left', fatigue: 10,
        action: (cell) => { cell.rotation = (cell.rotation + 5) % 6; }
    },
    6: { name: 'HIT', desc: 'attack forward', fatigue: 10,
        action: (cell) => {  } },
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
export default OPCODES;