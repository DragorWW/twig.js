var log = require('./log.js');
var forEach = require('./forEach');
var TwigToken = require('../twig.token');
var markup = require('../helper/markup');
/**
 * Parse a compiled template.
 *
 * @param {Array} tokens The compiled tokens.
 * @param {Object} context The render context.
 *
 * @return {string} The parsed template.
 */
module.exports = function (tokens, context) {
    try {
        var output = [],
            // Track logic chains
            chain = true,
            that = this;

        forEach(tokens, function parseToken(token) {
            log.debug("Twig.parse: ", "Parsing token: ", token);

            switch (token.type) {
                case TwigToken.type.raw:
                    output.push(markup(token.value));
                    break;

                case TwigToken.type.logic:
                    var logic_token = token.token,
                        logic = Twig.logic.parse.apply(that, [logic_token, context, chain]);

                    if (logic.chain !== undefined) {
                        chain = logic.chain;
                    }
                    if (logic.context !== undefined) {
                        context = logic.context;
                    }
                    if (logic.output !== undefined) {
                        output.push(logic.output);
                    }
                    break;

                case TwigToken.type.comment:
                    // Do nothing, comments should be ignored
                    break;

                //Fall through whitespace to output
                case TwigToken.type.output_whitespace_pre:
                case TwigToken.type.output_whitespace_post:
                case TwigToken.type.output_whitespace_both:
                case TwigToken.type.output:
                    log.debug("Twig.parse: ", "Output token: ", token.stack);
                    // Parse the given expression in the given context
                    output.push(Twig.expression.parse.apply(that, [token.stack, context]));
                    break;
            }
        });
        return Twig.output.apply(this, [output]);
    } catch (ex) {
        log.error("Error parsing twig template " + this.id + ": ");
        if (ex.stack) {
            log.error(ex.stack);
        } else {
            log.error(ex.toString());
        }

        if (this.options.rethrow) throw ex;

        if (Twig.debug) {
            return ex.toString();
        }
    }
};
