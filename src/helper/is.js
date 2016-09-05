/**
 *
 * @param {String} type
 * @param {Object} obj
 * @returns {boolean}
 */
module.exports = function(type, obj) {
  var clas = Object.prototype.toString.call(obj).slice(8, -1);
  return obj !== undefined && obj !== null && clas === type;
}