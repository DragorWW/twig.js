var phpDate = require('locutus/php/datetime/date');

module.exports = function(value, params) {
  var date = phpDate(value);
  var format = params && params.length ? params[0] : 'F j, Y H:i';
  return phpDate(format, date);
}