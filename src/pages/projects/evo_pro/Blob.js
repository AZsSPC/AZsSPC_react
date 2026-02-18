export default class Blob {
    constructor(stat = {}) {
        this.stat = stat;
        this.type = 'BLOB';
    }
}
