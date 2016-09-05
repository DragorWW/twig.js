var is = require('../helper/is');
var min = require('locutus/php/math/min');

module.exports = function(values) {
  if(is("Object", values)) {
    delete values["_keys"];
    return min(values);
  }

  return min.apply(null, arguments);
}