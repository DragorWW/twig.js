var is = require('../helper/is');

module.exports = function(values) {
  if(is("Object", values)) {
    delete values["_keys"];
    return Twig.lib.max(values);
  }

  return Twig.lib.max.apply(null, arguments);
}