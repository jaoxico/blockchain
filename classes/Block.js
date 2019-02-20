const sha256 = require('crypto-js/sha256');

class Block {

    constructor(date, data, previousHash = null) {
        this.setDate(date);
        this.setData(data);
        this.setPreviousHash(previousHash);
        this.hash = this.generateHash();
    }

    setDate(date) {
        if (!(date instanceof Date)) {
            throw new Error('Data inválida!');
        }
        this.date = date;
    }

    setData(data) {
        if (data === 'genesis') {
            this.data = data;
            return;
        }
        if (typeof data !== 'object') {
            throw new Error('Dados inválidos!');
        }
        // Aqui serão validados os dados do bloco.
        this.data = data;
    }

    setPreviousHash(previousHash) {
        if (previousHash === null) {
            if (this.data === 'genesis') {
                this.previousHash = previousHash;
                return;
            }
        }
        if (previousHash === null || !Block.isValidHash(previousHash)) {
            throw new Error('Previous hash inválida!');
        }
        this.previousHash = previousHash;
        // e194b2ce406a0b92525099a943b41903f761af21f761d0f534d329096af4d8fa
    }

    generateHash() {
        return sha256(this.date+JSON.stringify(this.data)+this.previousHash).toString();
    }

    static isValidHash(hash) {
        return typeof hash === 'string' && /^[0-9a-f]{64}$/.test(hash);
    }

    isValidBlock() {
        return this.generateHash() === this.hash;
    }
}

module.exports = Block;