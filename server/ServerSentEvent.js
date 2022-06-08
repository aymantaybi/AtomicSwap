
const writeEvent = (res, data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
};

const sendEvent = (res, data) => {

    if (!res.headersSent) {

        res.writeHead(200, {
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
        });

    }

    writeEvent(res, data);
};

module.exports = { sendEvent, writeEvent };

