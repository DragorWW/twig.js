/**
 * Exception thrown by twig.js.
 */
Error = function (message) {
    this.message = message;
    this.name = "TwigException";
    this.type = "TwigException";
};

/**
 * Get the string representation of a Twig error.
 */
Error.prototype.toString = function () {
    var output = this.name + ": " + this.message;

    return output;
};

module.exports = Error;
