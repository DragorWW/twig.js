/**
 * Create safe output
 *
 * @param {string} content safe to output
 *
 * @return {String} Content wrapped into a String
 */
module.exports = function(content, strategy) {
    if(typeof strategy == 'undefined') {
        strategy = true;
    }

    if (typeof content === 'string' && content.length > 0) {
        content = new String(content);
        content.twig_markup = strategy;
    }
    return content;
};
