module.exports = function(value, params) {
  if (value === undefined || value === null) {
    return;
  }
  if (params === undefined || params.length !== 1) {
    throw new Twig.Error("date_modify filter expects 1 argument");
  }

  var modifyText = params[0], time;

  if (Twig.lib.is("Date", value)) {
    time = Twig.lib.strtotime(modifyText, value.getTime() / 1000);
  }
  if (Twig.lib.is("String", value)) {
    time = Twig.lib.strtotime(modifyText, Twig.lib.strtotime(value));
  }
  if (Twig.lib.is("Number", value)) {
    time = Twig.lib.strtotime(modifyText, value);
  }

  return new Date(time * 1000);
}