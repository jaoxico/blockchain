const config = require('../config');
const Block = require('./Block');
const fs = require('fs');
const crypto = require('crypto');

class BlockChain {
    constructor() {
        this.config = config;
        this.chain = [];
        try {
            fs.statSync(this.config.file);
            let fileData = fs.readFileSync(this.config.file).toString();
            let decipher = crypto.createDecipher(this.config.alg, this.config.secret);
            let decryptedFile = decipher.update(fileData, 'hex', 'utf8');
            decryptedFile += decipher.final('utf8');
            let chainFile = JSON.parse(decryptedFile);
            let c = -1;
            while (++c < chainFile.length) {
                this.addBlock(new Block(chainFile[c].date, chainFile[c].data, chainFile[c].previousHash));
            }
        } catch (e) {
            try {
                this.addBlock(new Block(new Date(), 'genesis'));
            } catch (e) {
                console.log(e);
            }
        }
    }

    addBlock(block) {
        if (!block.isValidBlock()) throw new Error('Bloco inválido!');
        this.chain.push(block);
        this.saveChain();
    }

    lastBlockHash() {
        return this.chain[this.chain.length - 1].hash;
    }

    isValid() {
        let b = 0;
        while (++b < this.chain.length) {
            let currentBlock = this.chain[b];
            let previousBlock = this.chain[b - 1];
            if (!currentBlock.isValidBlock()) {
                return false;
            }
            if (previousBlock.hash !== currentBlock.previousHash) {
                return false;
            }
        }
        return true;
    }

    saveChain() {
        let cipher = crypto.createCipher(this.config.alg, this.config.secret);
        let encriptedChain = cipher.update(JSON.stringify(this.chain), 'utf8', 'hex');
        encriptedChain += cipher.final('hex');
        fs.writeFileSync(this.config.file, encriptedChain);
    }
}

module.exports = BlockChain;