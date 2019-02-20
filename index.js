const blockChainClass = require('./classes/blockchain');
const Block = require('./classes/Block');

let blockChain = new blockChainClass();

try {
    blockChain.addBlock(new Block(new Date(), {
        "nome": "João Souza",
        "email": "joao@consultorweb.cnt.br"
    }, blockChain.lastBlockHash()));
    blockChain.addBlock(new Block(new Date(), {
        "nome": "Jaqueline Merlugo",
        "email": "jaquelinemerlugo@gmail.com"
    }, blockChain.lastBlockHash()));
} catch (e) {
    console.log(e);
}

console.log(JSON.stringify(blockChain, null, 4));
console.log(blockChain.isValid() ? 'Válido' : 'Inválido');