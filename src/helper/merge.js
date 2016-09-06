var forEach = require('./forEach');

/**
 * Merge 2 object
 * @param {Object} target
 * @param {Object} source
 * @param {Boolean} onlyChanged
 * @returns {Object}
 */
module.exports = function (target, source, onlyChanged) {
    forEach(Object.keys(source), function (key) {
        if (onlyChanged && !(key in target)) {
            return;
        }

        target[ key ] = source[ key ]
    });

    return target;
}
