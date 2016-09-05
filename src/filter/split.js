var is = require('../helper/is');

module.exports = function(value, params) {
  if (value === undefined || value === null) {
    return;
  }
  if (params === undefined || params.length < 1 || params.length > 2) {
    throw new Twig.Error("split filter expects 1 or 2 argument");
  }
  if (is("String", value)) {
    var delimiter = params[0],
      limit = params[1],
      split = value.split(delimiter);

    if (limit === undefined) {

      return split;

    } else if (limit < 0) {

      return value.split(delimiter, split.length + limit);

    } else {

      var limitedSplit = [];

      if (delimiter == '') {
        // empty delimiter
        // "aabbcc"|split('', 2)
        //     -> ['aa', 'bb', 'cc']

        while(split.length > 0) {
          var temp = "";
          for (var i=0; i<limit && split.length > 0; i++) {
            temp += split.shift();
          }
          limitedSplit.push(temp);
        }

      } else {
        // non-empty delimiter
        // "one,two,three,four,five"|split(',', 3)
        //     -> ['one', 'two', 'three,four,five']

        for (var i=0; i<limit-1 && split.length > 0; i++) {
          limitedSplit.push(split.shift());
        }

        if (split.length > 0) {
          limitedSplit.push(split.join(delimiter));
        }
      }

      return limitedSplit;
    }

  } else {
    throw new Twig.Error("split filter expects value to be a string");
  }
}