module.exports = function (value, params) {
  var length = 30,
    preserve = false,
    separator = '...';

  value =  value + '';
  if (params) {
    if (params[0]) {
      length = params[0];
    }
    if (params[1]) {
      preserve = params[1];
    }
    if (params[2]) {
      separator = params[2];
    }
  }

  if (value.length > length) {

    if (preserve) {
      length = value.indexOf(' ', length);
      if (length === -1) {
        return value;
      }
    }

    value =  value.substr(0, length) + separator;
  }

  return value;
}