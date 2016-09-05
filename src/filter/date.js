module.exports = function(value, params) {
  var date = Twig.functions.date(value);
  var format = params && params.length ? params[0] : 'F j, Y H:i';
  return Twig.lib.date(format, date);
}