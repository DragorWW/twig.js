var TwigError = require('../model/Error');

module.exports = function (value, params) {
    if (params !== undefined && params.length > 1) {
        throw new TwigError("default filter expects one argument");
    }
    if (value === undefined || value === null || value === '') {
        if (params === undefined) {
            return '';
        }

        return params[ 0 ];
    } else {
        return value;
    }
}
