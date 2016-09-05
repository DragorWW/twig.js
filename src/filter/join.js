var forEach = require('../helper/forEach');

module.exports = function(value, params) {
  if (value === undefined || value === null){
    return;
  }

  var join_str = "",
    output = [],
    keyset = null;

  if (params && params[0]) {
    join_str = params[0];
  }
  if (is("Array", value)) {
    output = value;
  } else {
    keyset = value._keys || Object.keys(value);
    forEach(keyset, function(key) {
      if (key === "_keys") return; // Ignore the _keys property
      if (value.hasOwnProperty(key)) {
        output.push(value[key]);
      }
    });
  }
  return output.join(join_str);
}