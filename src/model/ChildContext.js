/**
 * Wrapper for child context objects in Twig.
 *
 * @param {Object} context Values to initialize the context with.
 */
module.exports = function(context) {
    var ChildContext = function ChildContext() {};
    ChildContext.prototype = context;
    return new ChildContext();
};
