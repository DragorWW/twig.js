module.exports = function(value) {
  if ( typeof value !== "string" ) {
    return value;
  }

  return value.substr(0, 1).toUpperCase() + value.toLowerCase().substr(1);
}