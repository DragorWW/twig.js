var forEach = require('../helper/forEach');

module.exports = function(value, params) {
  var obj = [],
    arr_index = 0,
    keyset = [];

  // Check to see if all the objects being merged are arrays
  if (!is("Array", value)) {
    // Create obj as an Object
    obj = { };
  } else {
    forEach(params, function(param) {
      if (!is("Array", param)) {
        obj = { };
      }
    });
  }
  if (!is("Array", obj)) {
    obj._keys = [];
  }

  if (is("Array", value)) {
    forEach(value, function(val) {
      if (obj._keys) obj._keys.push(arr_index);
      obj[arr_index] = val;
      arr_index++;
    });
  } else {
    keyset = value._keys || Object.keys(value);
    forEach(keyset, function(key) {
      obj[key] = value[key];
      obj._keys.push(key);

      // Handle edge case where a number index in an object is greater than
      //   the array counter. In such a case, the array counter is increased
      //   one past the index.
      //
      // Example {{ ["a", "b"]|merge({"4":"value"}, ["c", "d"])
      // Without this, d would have an index of "4" and overwrite the value
      //   of "value"
      var int_key = parseInt(key, 10);
      if (!isNaN(int_key) && int_key >= arr_index) {
        arr_index = int_key + 1;
      }
    });
  }

  // mixin the merge arrays
  forEach(params, function(param) {
    if (is("Array", param)) {
      forEach(param, function(val) {
        if (obj._keys) obj._keys.push(arr_index);
        obj[arr_index] = val;
        arr_index++;
      });
    } else {
      keyset = param._keys || Object.keys(param);
      forEach(keyset, function(key) {
        if (!obj[key]) obj._keys.push(key);
        obj[key] = param[key];

        var int_key = parseInt(key, 10);
        if (!isNaN(int_key) && int_key >= arr_index) {
          arr_index = int_key + 1;
        }
      });
    }
  });
  if (params.length === 0) {
    throw new Twig.Error("Filter merge expects at least one parameter");
  }

  return obj;
}