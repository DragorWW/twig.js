var log = require('./log');
var tokenize = require('../helper/tokenize');
var compile = require('../twig.compile');

/**
 * Tokenize and compile a string template.
 *
 * @param {string} data The template.
 *
 * @return {Array} The compiled tokens.
 */
module.exports = function(data) {
    var tokens, raw_tokens;

    // Tokenize
    log.debug("Twig.prepare: ", "Tokenizing ", data);
    raw_tokens = tokenize.apply(this, [data]);

    // Compile
    log.debug("Twig.prepare: ", "Compiling ", raw_tokens);
    tokens = compile.apply(this, [raw_tokens]);

    log.debug("Twig.prepare: ", "Compiled ", tokens);

    return tokens;
};
