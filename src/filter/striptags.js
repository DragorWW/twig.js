module.exports = function(value) {
  if (value === undefined || value === null){
    return;
  }

  return Twig.lib.strip_tags(value);
}