var express = require('express');
const Web3 = require('./web3');
const Decimal = require('decimal.js');

const { formatTime } = require('./utils');

const { sendEvent, writeEvent } = require('./ServerSentEvent');

const pairABI = require('./roninChain/contracts/abi/Pair.json');
const pairAddress = "0x306a28279d04a47468ed83d55088d0dcd1369294";
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

var blockTime = 3; // seconds

var syncSubscriptions = {
    /*  "0x306A28279d04a47468ed83d55088d0DCd1369294": {
         responseReferences: ["lol"]
     } */
};

const syncEventTopics = ['0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1'];

const subscription = web3.eth.subscribe('logs', { topics: syncEventTopics }).on("data", async (log) => {

    const { address: pairAddress } = log;

    if (
        !(
            pairAddress in syncSubscriptions
            &&
            Array.isArray(syncSubscriptions[pairAddress].responseReferences)
            &&
            syncSubscriptions[pairAddress].responseReferences.length > 0
        )
    ) return;

    var pairContract = new web3.eth.Contract(pairABI, pairAddress);

    var updates = await syncEventCallback(pairContract);

    for (var res of syncSubscriptions[pairAddress].responseReferences) {

        var data = {
            updates,
            token0: {
                address: "",
                decimals: 0
            },
            token1: {
                address: "",
                decimals: 18
            }
        };

        writeEvent(res, data);
    }

});

router.get('/reserves/:pairAddress', async (req, res) => {

    const { pairAddress } = req.params;

    syncSubscriptions[pairAddress] = syncSubscriptions[pairAddress] || { responseReferences: [] };

    var index = syncSubscriptions[pairAddress].responseReferences.length;

    syncSubscriptions[pairAddress].responseReferences.push(res);

    res.on('close', () => {
        syncSubscriptions[pairAddress].responseReferences.splice(index, 1);
        res.end();
        console.log('Stream Closed');
    });

    var pairContract = new web3.eth.Contract(pairABI, pairAddress);

    var updates = await syncEventCallback(pairContract);

    var data = {
        updates,
        token0: {
            address: "",
            decimals: 0
        },
        token1: {
            address: "",
            decimals: 18
        }
    };

    sendEvent(res, data);
});

router.get('/price', async (req, res) => {

    var pairContract = new web3.eth.Contract(pairABI, pairAddress);

    var blockTime = 3; // seconds

    var timeframe = 7200;

    var candlesNumber = 10;

    var candleBlocks = (timeframe / blockTime) / candlesNumber;

    var block = await web3.eth.getBlock("latest");

    var { number: blockNumber, timestamp: blockTimestamp } = block;

    var pastEvents = await pairContract.getPastEvents('Sync', { fromBlock: blockNumber - (timeframe / blockTime), toBlock: 'latest' });

    var data = {};

    pastEvents.forEach(event => {

        var { blockNumber } = event;

        var reserve0 = new Decimal(event.returnValues.reserve0);
        var reserve1 = new Decimal(event.returnValues.reserve1);

        var price = reserve1.dividedBy(10 ** 18).dividedBy(reserve0).times(997).dividedBy(1000);

        data[blockNumber] = { price }

    });

    var blockSeries = [];

    for (var i = blockNumber - (timeframe / blockTime); i < blockNumber; i += candleBlocks) {

        blockSeries.push([i, i + candleBlocks])

    }

    var candles = [];

    for (var blockSerie of blockSeries) {

        var openBlock = Object.keys(data).find(blockNumber => Number(blockNumber) >= blockSerie[0]);
        var closeBlock = Object.keys(data).reverse().find(blockNumber => Number(blockNumber) <= blockSerie[1]);

        candles.push({
            timestamp: blockTimestamp - ((blockNumber - closeBlock) * blockTime),
            open: data[openBlock].price,
            close: data[closeBlock].price,
        });

    }

    res.json({ data: { candles } });
});

module.exports = router;

async function syncEventCallback(pairContract) {

    var block = await web3.eth.getBlock("latest");

    var { number: blockNumber, timestamp: blockTimestamp } = block;

    var pastEvents = await pairContract.getPastEvents('Sync', { fromBlock: blockNumber - 1200, toBlock: 'latest' });

    var rawUpdates = pastEvents.map(event => ({
        reserve0: event.returnValues.reserve0,
        reserve1: event.returnValues.reserve1,
        time: new Date(formatTime((blockTimestamp - ((blockNumber - event.blockNumber) * blockTime)))).getTime(),
    }))

    var updates = [];

    for (var i = rawUpdates[0].time; i < rawUpdates[rawUpdates.length - 1].time; i += 60000) {

        var periodeUpdates = rawUpdates.filter(update => update.time == i);

        if (periodeUpdates.length > 0) {
            var lastPeriodeUpdate = periodeUpdates[periodeUpdates.length - 1];
            updates.push({ ...lastPeriodeUpdate });
        } else {
            updates.push({ ...updates[updates.length - 1], time: i });
        }

    }

    return updates;
}