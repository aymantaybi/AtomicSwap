var Web3 = require('web3');

const { BatchManager } = require('web3-core-requestmanager');

const Jsonrpc = require('web3-core-requestmanager/src/jsonrpc');

var { errors } = require('web3-core-helpers');

BatchManager.prototype.executeAsync = function () {

    return new Promise((resolve, reject) => {
        
        var requests = this.requests;

        this.requestManager.sendBatch(requests, function (err, results) {

            results = results || [];

            var response = requests.map(function (request, index) {

                return results[index] || {};

            }).map(function (result, index) {

                if (result && result.error) {
                    return errors.ErrorResponse(result);
                }

                if (!Jsonrpc.isValidResponse(result)) {
                    return errors.InvalidResponse(result);
                }

                return requests[index].format ? requests[index].format(result.result) : result.result;

            });

            resolve(response);

        });
    })
}

module.exports = Web3;