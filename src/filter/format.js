module.exports = function(value, params) {
  if (value === undefined || value === null){
    return;
  }

  return Twig.lib.vsprintf(value, params);
}