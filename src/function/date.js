var is = require('../helper/is');
var strtotime = require('locutus/php/datetime/strtotime');
var TwigError = require('../model/Error');

module.exports = function (date, time) {
    var dateObj;
    if (date === undefined || date === null || date === "") {
        dateObj = new Date();
    } else if (is("Date", date)) {
        dateObj = date;
    } else if (is("String", date)) {
        if (date.match(/^[0-9]+$/)) {
            dateObj = new Date(date * 1000);
        }
        else {
            dateObj = new Date(strtotime(date) * 1000);
        }
    } else if (is("Number", date)) {
        // timestamp
        dateObj = new Date(date * 1000);
    } else {
        throw new TwigError("Unable to parse date " + date);
    }
    return dateObj;
}
