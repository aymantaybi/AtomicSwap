const formateDate = (timestamp: number) => {
    const date = new Date(Number(String(timestamp).padEnd(13, "0")));
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
};

const formatValue = (value: String) => {
    value = String(value)
    return value.length < 2 ? `0${value}` : value;
}

const formatHour = (timestamp: number) => {
    const date = new Date(Number(String(timestamp).padEnd(13, "0")));
    var hours = formatValue(date.getHours().toString())
    var minutes = formatValue(date.getMinutes().toString())
    var secondes = formatValue(date.getSeconds().toString())
    return `${hours}:${minutes}:${secondes}`
}

function formatPrice(value: number | string) {
    var digits = String(value).split("");
    var firstIndex = digits.findIndex(digit => digit != "0" && digit != ".");
    return String(value).slice(0, firstIndex + 6);
}


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export { formateDate, formatHour, formatPrice, sleep };