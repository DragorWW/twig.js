var is = require('../helper/is');
var strtotime = require('locutus/php/datetime/strtotime');

module.exports = function(value, params) {
  if (value === undefined || value === null) {
    return;
  }
  if (params === undefined || params.length !== 1) {
    throw new Twig.Error("date_modify filter expects 1 argument");
  }

  var modifyText = params[0], time;

  if (is("Date", value)) {
    time = strtotime(modifyText, value.getTime() / 1000);
  }
  if (is("String", value)) {
    time = strtotime(modifyText, strtotime(value));
  }
  if (is("Number", value)) {
    time = strtotime(modifyText, value);
  }

  return new Date(time * 1000);
}