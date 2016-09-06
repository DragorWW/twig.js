var vsprintf = require('locutus/php/strings/vsprintf');

module.exports = function (value, params) {
    if (value === undefined || value === null) {
        return;
    }

    return vsprintf(value, params);
}
