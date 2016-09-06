module.exports = function (value) {
    if (value === undefined || value === null) {
        return;
    }

    var result = encodeURIComponent(value);
    result = result.replace("'", "%27");
    return result;
}
