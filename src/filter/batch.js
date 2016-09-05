module.exports = function(items, params) {
  var size = params.shift(),
    fill = params.shift(),
    result,
    last,
    missing;

  if (!Twig.lib.is("Array", items)) {
    throw new Twig.Error("batch filter expects items to be an array");
  }

  if (!Twig.lib.is("Number", size)) {
    throw new Twig.Error("batch filter expects size to be a number");
  }

  size = Math.ceil(size);

  result = Twig.lib.chunkArray(items, size);

  if (fill && items.length % size != 0) {
    last = result.pop();
    missing = size - last.length;

    while (missing--) {
      last.push(fill);
    }

    result.push(last);
  }

  return result;
}