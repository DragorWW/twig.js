module.exports = function (value) {
    if (typeof value !== "string") {
        return value;
    }

    return value.toLowerCase().replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
        return p1 + p2.toUpperCase();
    });
}
