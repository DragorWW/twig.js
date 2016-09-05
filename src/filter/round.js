var is = require('../helper/is');
var round = require('locutus/php/math/round');

module.exports = function(value, params) {
  params = params || [];

  var precision = params.length > 0 ? params[0] : 0,
    method = params.length > 1 ? params[1] : "common";

  value = parseFloat(value);

  if(precision && !is("Number", precision)) {
    throw new Twig.Error("round filter expects precision to be a number");
  }

  if (method === "common") {
    return round(value, precision);
  }

  if(!is("Function", Math[method])) {
    throw new Twig.Error("round filter expects method to be 'floor', 'ceil', or 'common'");
  }

  return Math[method](value * Math.pow(10, precision)) / Math.pow(10, precision);
}