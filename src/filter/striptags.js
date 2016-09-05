var strip_tags = require('locutus/php/strings/strip_tags');

module.exports = function(value) {
  if (value === undefined || value === null){
    return;
  }

  return strip_tags(value);
}