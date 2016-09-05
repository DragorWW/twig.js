var forEach = require('../helper/forEach');

module.exports = function() {
  var EOL = '\n',
    indentChar = '  ',
    indentTimes = 0,
    out = '',
    args = Array.prototype.slice.call(arguments),
    indent = function(times) {
      var ind  = '';
      while (times > 0) {
        times--;
        ind += indentChar;
      }
      return ind;
    },
    displayVar = function(variable) {
      out += indent(indentTimes);
      if (typeof(variable) === 'object') {
        dumpVar(variable);
      } else if (typeof(variable) === 'function') {
        out += 'function()' + EOL;
      } else if (typeof(variable) === 'string') {
        out += 'string(' + variable.length + ') "' + variable + '"' + EOL;
      } else if (typeof(variable) === 'number') {
        out += 'number(' + variable + ')' + EOL;
      } else if (typeof(variable) === 'boolean') {
        out += 'bool(' + variable + ')' + EOL;
      }
    },
    dumpVar = function(variable) {
      var i;
      if (variable === null) {
        out += 'NULL' + EOL;
      } else if (variable === undefined) {
        out += 'undefined' + EOL;
      } else if (typeof variable === 'object') {
        out += indent(indentTimes) + typeof(variable);
        indentTimes++;
        out += '(' + (function(obj) {
            var size = 0, key;
            for (key in obj) {
              if (obj.hasOwnProperty(key)) {
                size++;
              }
            }
            return size;
          })(variable) + ') {' + EOL;
        for (i in variable) {
          out += indent(indentTimes) + '[' + i + ']=> ' + EOL;
          displayVar(variable[i]);
        }
        indentTimes--;
        out += indent(indentTimes) + '}' + EOL;
      } else {
        displayVar(variable);
      }
    };

  // handle no argument case by dumping the entire render context
  if (args.length == 0) args.push(this.context);

  forEach(args, function(variable) {
    dumpVar(variable);
  });

  return out;
}