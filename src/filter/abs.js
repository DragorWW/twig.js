module.exports = function (value) {
    if (value === undefined || value === null) {
      return;
    }

    return Math.abs(value);
};