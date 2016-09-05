/**
 * Replace all `search` in `string` on `replace`.
 *
 * @param {String} string
 * @param {String} search
 * @param {String} replace
 *
 * @returns {string}
 */
module.exports = function(string, search, replace) {
  return string.split(search).join(replace);
};