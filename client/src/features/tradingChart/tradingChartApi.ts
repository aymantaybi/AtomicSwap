export async function fetchPrice() {
    var response = await fetch("http://127.0.0.1:4000/charts/price");
    var responseJson = await response.json();
    return responseJson.data.candles;
}
