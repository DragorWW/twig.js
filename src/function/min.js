var is = require('../helper/is');

module.exports = function(values) {
  if(is("Object", values)) {
    delete values["_keys"];
    return Twig.lib.min(values);
  }

  return Twig.lib.min.apply(null, arguments);
}