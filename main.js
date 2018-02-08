const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timstamp, data, previousHash = "0") {
    this.index = index;
    this.timstamp = timstamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nounce = 0;
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timstamp + JSON.stringify(this.data) + this.nounce).toString();
  }

  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nounce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined:"+ this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 5;
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2018", { amount: 0 }, "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLastBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid(){
    for( let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1];

      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.calculateHash()){
        return false;
      }

      return true;
    }
  }
}

let lostCoin = new Blockchain();
console.log("Mine block 1...");
lostCoin.addBlock(new Block(1, "01/04/2018", {amount: 4}));
console.log("Mine block 2...");
lostCoin.addBlock(new Block(2, '01/05/2018', {amount: 10}));
console.log("Mine block 3...");
lostCoin.addBlock(new Block(3, '01/21/2018', {amount: 30}));

// console.log(JSON.stringify(lostCoin, null, 6));

// console.log("is Lost Coin vaild:" + lostCoin.isChainValid());

