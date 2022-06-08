const formatValue = (value) => {
    value = String(value)
    return value.length < 2 ? `0${value}` : value;
}

const formatTime = (timestamp) => {
    
    const date = new Date(Number(String(timestamp).padEnd(13, "0")));

    var fullYear = formatValue(date.getFullYear().toString());
    var month = formatValue((date.getMonth() + 1).toString())
    var day = formatValue(date.getDate().toString());

    var hours = formatValue(date.getHours().toString())
    var minutes = formatValue(date.getMinutes().toString())
    var secondes = formatValue(date.getSeconds().toString())

    return `${fullYear}-${month}-${day}T${hours}:${minutes}:00`;
}

module.exports = { formatTime };