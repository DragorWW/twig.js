var is = require('../helper/is');

module.exports = function(date, time) {
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
      dateObj = new Date(Twig.lib.strtotime(date) * 1000);
    }
  } else if (is("Number", date)) {
    // timestamp
    dateObj = new Date(date * 1000);
  } else {
    throw new Twig.Error("Unable to parse date " + date);
  }
  return dateObj;
}