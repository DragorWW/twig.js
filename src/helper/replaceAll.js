module.exports = function(string, search, replace) {
  return string.split(search).join(replace);
};