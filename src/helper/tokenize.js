var log = require('./log.js');
var TwigToken = require('../twig.token.js');

/**
 * Convert a template into high-level tokens.
 */
module.exports = function (template) {
    var tokens = [],
        // An offset for reporting errors locations in the template.
        error_offset = 0,

        // The start and type of the first token found in the template.
        found_token = null,
        // The end position of the matched token.
        end = null;

    while (template.length > 0) {
        // Find the first occurance of any token type in the template
        found_token = TwigToken.findStart(template);

        log.trace("Twig.tokenize: ", "Found token: ", found_token);

        if (found_token.position !== null) {
            // Add a raw type token for anything before the start of the token
            if (found_token.position > 0) {
                tokens.push({
                    type: TwigToken.type.raw,
                    value: template.substring(0, found_token.position)
                });
            }
            template = template.substr(found_token.position + found_token.def.open.length);
            error_offset += found_token.position + found_token.def.open.length;

            // Find the end of the token
            end = TwigToken.findEnd(template, found_token.def, error_offset);

            log.trace("Twig.tokenize: ", "Token ends at ", end);

            tokens.push({
                type:  found_token.def.type,
                value: template.substring(0, end).trim()
            });

            if (template.substr( end + found_token.def.close.length, 1 ) === "\n") {
                switch (found_token.def.type) {
                    case "logic_whitespace_pre":
                    case "logic_whitespace_post":
                    case "logic_whitespace_both":
                    case "logic":
                        // Newlines directly after logic tokens are ignored
                        end += 1;
                        break;
                }
            }

            template = template.substr(end + found_token.def.close.length);

            // Increment the position in the template
            error_offset += end + found_token.def.close.length;

        } else {
            // No more tokens -> add the rest of the template as a raw-type token
            tokens.push({
                type: TwigToken.type.raw,
                value: template
            });
            template = '';
        }
    }

    return tokens;
};
