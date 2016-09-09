var Twig = {};
Twig.trace =  false; // FIXME: remove
Twig.debug =  false; // FIXME: remove
/**
 * Wrapper for logging to the console.
 */
module.exports = {
    trace: function () {if (Twig.trace && console) {console.log(Array.prototype.slice.call(arguments));}},
    debug: function () {if (Twig.debug && console) {console.log(Array.prototype.slice.call(arguments));}},
    error: function () {if (console) {console.log(Array.prototype.slice.call(arguments));}}
};
