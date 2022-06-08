import Decimal from 'decimal.js';

async function fetchPrice() {
    var response = await fetch("http://127.0.0.1:4000/charts/price");
    var responseJson = await response.json();
    return responseJson.data.candles;
}

function getAmountIn(amountOut: string | Decimal, reserveIn: string | Decimal, reserveOut: string | Decimal) {
    var numerator = new Decimal(reserveIn).times(amountOut).times('1000');
    var denominator = new Decimal(reserveOut).minus(amountOut).times('997');
    var amountIn = numerator.dividedBy(denominator);
    return amountIn;
};

function getAmountOut(amountIn: string | Decimal, reserveIn: string | Decimal, reserveOut: string | Decimal) {
    var amountInWithFee = new Decimal(amountIn).times('997');
    var numerator = new Decimal(amountInWithFee).times(reserveOut);
    var denominator = new Decimal(reserveIn).times('1000').plus(amountInWithFee);
    var amountOut = numerator.dividedBy(denominator);
    return amountOut;
};

export { fetchPrice, getAmountIn, getAmountOut };