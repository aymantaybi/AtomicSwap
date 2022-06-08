export async function fetchTradeHistory(){
    var response = await fetch("http://127.0.0.1:4000/trades/history");
    var responseJson = await response.json();
    return responseJson.data.trades;
}