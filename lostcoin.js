const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timstamp, transactions, previousHash = "0") {
    this.timstamp = timstamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nounce = 0;
  }

  calculateHash() {
    return SHA256(
        this.previousHash +
        this.timstamp +
        JSON.stringify(this.transactions) +
        this.nounce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nounce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined:" + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(Date.parse("2018-01-01"), [], "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTranscation(miningRewardAddress){
      let block = new Block(Date.now(), this.pendingTransactions, this.getLastBlock().hash);
      block.mineBlock(this.difficulty);

      console.log("Block successfully mined");
      this.chain.push(block);

      this.pendingTransactions = [
          new Transaction(null, miningRewardAddress, this.miningReward)
      ]
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
      let balance = 0;

      for(const block of this.chain){
          console.log(JSON.stringify(block));
          for(const trans of block.transactions){
              if(trans.fromAddress === address){
                  balance -= trans.amount;
              }

              if(trans.toAddress === address){
                  balance += trans.amount;
              }
          }
      }
      
      return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.calculateHash()) {
        return false;
      }

      return true;
    }
  }
}

let lostCoin = new Blockchain();

lostCoin.createTransaction(new Transaction('address1', 'address2', 100));
lostCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log("\n Strating the miner");
lostCoin.minePendingTranscation("Etherium-address");

console.log("\n Balance of Address 1 is", lostCoin.getBalanceOfAddress('address1'));

console.log("\n Balance of Etherium is", lostCoin.getBalanceOfAddress('Etherium-address'));

console.log("\n Strating the miner");
lostCoin.minePendingTranscation("Etherium-address");

console.log("\n Balance of Etherium is", lostCoin.getBalanceOfAddress('Etherium-address'));