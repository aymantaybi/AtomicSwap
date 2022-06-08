const Web3 = require('./web3');

const Decimal = require('decimal.js');

const pairABI = require('./roninChain/contracts/abi/Pair.json');

const pairAddress = "0x306a28279d04a47468ed83d55088d0dcd1369294";

const web3 = new Web3("ws://ws.node.atomicswap.online");

web3.eth.getBlock("latest", true).then(async (data) => {
console.log(data);
})