module.exports = function(value) {
  if (is("Array", value)) {
    return value.sort();
  } else if (is('Object', value)) {
    // Sorting objects isn't obvious since the order of
    // returned keys isn't guaranteed in JavaScript.
    // Because of this we use a "hidden" key called _keys to
    // store the keys in the order we want to return them.

    delete value._keys;
    var keys = Object.keys(value),
      sorted_keys = keys.sort(function(a, b) {
        var a1, a2;

        // if a and b are comparable, we're fine :-)
        if((value[a] > value[b]) == !(value[a] <= value[b])) {
          return value[a] > value[b] ? 1 :
            value[a] < value[b] ? -1 :
              0;
        }
        // if a and b can be parsed as numbers, we can compare
        // their numeric value
        else if(!isNaN(a1 = parseFloat(value[a])) &&
          !isNaN(b1 = parseFloat(value[b]))) {
          return a1 > b1 ? 1 :
            a1 < b1 ? -1 :
              0;
        }
        // if one of the values is a string, we convert the
        // other value to string as well
        else if(typeof value[a] == 'string') {
          return value[a] > value[b].toString() ? 1 :
            value[a] < value[b].toString() ? -1 :
              0;
        }
        else if(typeof value[b] == 'string') {
          return value[a].toString() > value[b] ? 1 :
            value[a].toString() < value[b] ? -1 :
              0;
        }
        // everything failed - return 'null' as sign, that
        // the values are not comparable
        else {
          return null;
        }
      });
    value._keys = sorted_keys;
    return value;
  }
}