var express = require('express');
const Web3 = require('./web3');
const Decimal = require('decimal.js');
const abiDecoder = require('abi-decoder');

const pairABI = require('./roninChain/contracts/abi/Pair.json');
const katanaRouterABI = require('./roninChain/contracts/abi/KatanaRouter.json');

const { sendEvent, writeEvent } = require('./ServerSentEvent');

const web3 = new Web3(new Web3.providers.WebsocketProvider("http://ws.node.atomicswap.online",
    {
        reconnect: {
            auto: true,
            delay: 10,
            maxAttempts: 1000,
            onTimeout: false
        }
    }
));

const router = express.Router();

const tokens = {
    addresses: {
        "AXS": "0x97a9107c1793bc407d6f527b77e7fff4d812bece",
        "ETH": "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5",
        "WETH": "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5",
        "SLP": "0xa8754b9fa15fc18bb59458815510e40a12cd2014",
        "USDC": "0x0b7007c13325c48911f73a2dad5fa5dcbf808adc"
    },
    decimals: {
        "0x97a9107c1793bc407d6f527b77e7fff4d812bece": 18,
        "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5": 18,
        "0xa8754b9fa15fc18bb59458815510e40a12cd2014": 0,
        "0x0b7007c13325c48911f73a2dad5fa5dcbf808adc": 6
    }
};

const pairs = [
    {
        address: "0x306a28279d04a47468ed83d55088d0dcd1369294",
        tokens: [
            "0xa8754b9fa15fc18bb59458815510e40a12cd2014",
            "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"
        ]
    },
    {
        address: "0x2ecb08f87f075b5769fe543d0e52e40140575ea7",
        tokens: [
            "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5",
            "0xe514d9deb7966c8be0ca922de8a064264ea6bcd4"
        ]
    },
    {
        address: "0xc6344bc1604fcab1a5aad712d766796e2b7a70b9",
        tokens: [
            "0x97a9107c1793bc407d6f527b77e7fff4d812bece",
            "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"
        ]
    },
    {
        address: "0xa7964991f339668107e2b6a6f6b8e8b74aa9d017",
        tokens: [
            "0x0b7007c13325c48911f73a2dad5fa5dcbf808adc",
            "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5"
        ]
    },
]

var swaps = [];

var responseReferences = [];

web3.eth.subscribe('newBlockHeaders').on("data", (blockHeader) => {

    var { timestamp, number: blockNumber } = blockHeader;

    web3.eth.getBlock(blockNumber, true).then(async (data) => {

        abiDecoder.addABI(katanaRouterABI);

        var rawSwaps = [];

        var jsonInterface = katanaRouterABI.find(interface => interface.name == "swapExactTokensForTokens");

        var encodedFunctionSignature = web3.eth.abi.encodeFunctionSignature(jsonInterface);

        var swapTransactions = data.transactions.filter(tx => tx.to == "0x7D0556D55ca1a92708681e2e231733EBd922597D" && tx.input.startsWith(encodedFunctionSignature));

        var batch = new web3.BatchRequest();

        for (var transaction of swapTransactions) {

            var decodedData = abiDecoder.decodeMethod(transaction.input);

            var amountIn = decodedData.params.find(param => param.name == '_amountIn')?.value;
            //var amountOutMin = decodedData.params.find(param => param.name == '_amountOutMin')?.value;
            var path = decodedData.params.find(param => param.name == '_path')?.value;
            var sender = decodedData.params.find(param => param.name == '_to')?.value;

            var transactionHash = transaction.hash;
            var transactionIndex = transaction.transactionIndex;

            batch.add(web3.eth.getTransactionReceipt.request(transactionHash));

            rawSwaps.push({ amountIn, path, sender, transactionHash, transactionIndex, blockNumber, timestamp });
        }

        if (rawSwaps.length == 0) return;

        var batchResponse = await batch.executeAsync();

        abiDecoder.addABI(pairABI);

        for (var transactionReceipt of batchResponse) {

            if (!transactionReceipt.status) break;

            var rawSwap = rawSwaps.find(rawSwap => rawSwap.transactionHash == transactionReceipt.transactionHash);

            var pairsAddress = [];

            for (var i = 1; i < rawSwap.path.length; i++) {
                var pair = pairs.find(pair => pair.tokens.includes(rawSwap.path[i - 1]) && pair.tokens.includes(rawSwap.path[i]));

                if (pair) {
                    pairsAddress.push(pair.address);
                }
            }

            var decodedLogs = abiDecoder.decodeLogs(transactionReceipt.logs);

            var decodedSwapLog = decodedLogs.find(log => log.name == "Swap" && log.address.toLowerCase() == pairsAddress[pairsAddress.length - 1]);

            var amount0Out = decodedSwapLog.events.find(param => param.name == "amount0Out").value;

            var amount1Out = decodedSwapLog.events.find(param => param.name == "amount1Out").value;

            var amountOut = amount0Out == "0" ? amount1Out : amount0Out;

            swaps.push({
                ...rawSwap,
                amountOut: new Decimal(amountOut).dividedBy(10 ** tokens.decimals[rawSwap.path[rawSwap.path.length - 1]]).toDecimalPlaces(5),
                amountIn: new Decimal(rawSwap.amountIn).dividedBy(10 ** tokens.decimals[rawSwap.path[0]]).toDecimalPlaces(5),
            });
        }

        swaps = swaps.sort((a, b) => b.blockNumber - a.blockNumber || b.transactionIndex - a.transactionIndex).slice(0, 100);

        for (var res of responseReferences) {
            var data = { swaps };
            writeEvent(res, data);
        }

    });

});

router.get('/history', async (req, res) => {

    var index = responseReferences.length;

    responseReferences.push(res);

    res.on('close', () => {
        responseReferences.splice(index, 1);
        res.end();
        console.log('Stream Closed');
    });

    var data = { swaps };
    sendEvent(res, data);
});

module.exports = router;
