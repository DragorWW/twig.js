var log = require('./helper/log');
var TwigToken = require('./twig.token.js');

module.exports = function (tokens) {
    try {
        // Output and intermediate stacks
        var output = [],
            stack = [],
            // The tokens between open and close tags
            intermediate_output = [],

            token = null,
            logic_token = null,
            unclosed_token = null,
            // Temporary previous token.
            prev_token = null,
            // Temporary previous output.
            prev_output = null,
            // Temporary previous intermediate output.
            prev_intermediate_output = null,
            // The previous token's template
            prev_template = null,
            // Token lookahead
            next_token = null,
            // The output token
            tok_output = null,

            // Logic Token values
            type = null,
            open = null,
            next = null;

        var compile_output = function(token) {
            Twig.expression.compile.apply(this, [token]);
            if (stack.length > 0) {
                intermediate_output.push(token);
            } else {
                output.push(token);
            }
        };

        var compile_logic = function(token) {
            // Compile the logic token
            logic_token = Twig.logic.compile.apply(this, [token]);

            type = logic_token.type;
            open = Twig.logic.handler[type].open;
            next = Twig.logic.handler[type].next;

            log.trace("Twig.compile: ", "Compiled logic token to ", logic_token,
                " next is: ", next, " open is : ", open);

            // Not a standalone token, check logic stack to see if this is expected
            if (open !== undefined && !open) {
                prev_token = stack.pop();
                prev_template = Twig.logic.handler[prev_token.type];

                if (indexOf(prev_template.next, type) < 0) {
                    throw new Error(type + " not expected after a " + prev_token.type);
                }

                prev_token.output = prev_token.output || [];

                prev_token.output = prev_token.output.concat(intermediate_output);
                intermediate_output = [];

                tok_output = {
                    type: TwigToken.type.logic,
                    token: prev_token
                };
                if (stack.length > 0) {
                    intermediate_output.push(tok_output);
                } else {
                    output.push(tok_output);
                }
            }

            // This token requires additional tokens to complete the logic structure.
            if (next !== undefined && next.length > 0) {
                log.trace("Twig.compile: ", "Pushing ", logic_token, " to logic stack.");

                if (stack.length > 0) {
                    // Put any currently held output into the output list of the logic operator
                    // currently at the head of the stack before we push a new one on.
                    prev_token = stack.pop();
                    prev_token.output = prev_token.output || [];
                    prev_token.output = prev_token.output.concat(intermediate_output);
                    stack.push(prev_token);
                    intermediate_output = [];
                }

                // Push the new logic token onto the logic stack
                stack.push(logic_token);

            } else if (open !== undefined && open) {
                tok_output = {
                    type: TwigToken.type.logic,
                    token: logic_token
                };
                // Standalone token (like {% set ... %}
                if (stack.length > 0) {
                    intermediate_output.push(tok_output);
                } else {
                    output.push(tok_output);
                }
            }
        };

        while (tokens.length > 0) {
            token = tokens.shift();
            prev_output = output[output.length - 1];
            prev_intermediate_output = intermediate_output[intermediate_output.length - 1];
            next_token = tokens[0];
            log.trace("Compiling token ", token);
            switch (token.type) {
                case TwigToken.type.raw:
                    if (stack.length > 0) {
                        intermediate_output.push(token);
                    } else {
                        output.push(token);
                    }
                    break;

                case TwigToken.type.logic:
                    compile_logic.call(this, token);
                    break;

                // Do nothing, comments should be ignored
                case TwigToken.type.comment:
                    break;

                case TwigToken.type.output:
                    compile_output.call(this, token);
                    break;

                //Kill whitespace ahead and behind this token
                case TwigToken.type.logic_whitespace_pre:
                case TwigToken.type.logic_whitespace_post:
                case TwigToken.type.logic_whitespace_both:
                case TwigToken.type.output_whitespace_pre:
                case TwigToken.type.output_whitespace_post:
                case TwigToken.type.output_whitespace_both:
                    if (token.type !== TwigToken.type.output_whitespace_post && token.type !== TwigToken.type.logic_whitespace_post) {
                        if (prev_output) {
                            //If the previous output is raw, pop it off
                            if (prev_output.type === TwigToken.type.raw) {
                                output.pop();

                                //If the previous output is not just whitespace, trim it
                                if (prev_output.value.match(/^\s*$/) === null) {
                                    prev_output.value = prev_output.value.trim();
                                    //Repush the previous output
                                    output.push(prev_output);
                                }
                            }
                        }

                        if (prev_intermediate_output) {
                            //If the previous intermediate output is raw, pop it off
                            if (prev_intermediate_output.type === TwigToken.type.raw) {
                                intermediate_output.pop();

                                //If the previous output is not just whitespace, trim it
                                if (prev_intermediate_output.value.match(/^\s*$/) === null) {
                                    prev_intermediate_output.value = prev_intermediate_output.value.trim();
                                    //Repush the previous intermediate output
                                    intermediate_output.push(prev_intermediate_output);
                                }
                            }
                        }
                    }

                    //Compile this token
                    switch (token.type) {
                        case TwigToken.type.output_whitespace_pre:
                        case TwigToken.type.output_whitespace_post:
                        case TwigToken.type.output_whitespace_both:
                            compile_output.call(this, token);
                            break;
                        case TwigToken.type.logic_whitespace_pre:
                        case TwigToken.type.logic_whitespace_post:
                        case TwigToken.type.logic_whitespace_both:
                            compile_logic.call(this, token);
                            break;
                    }

                    if (token.type !== TwigToken.type.output_whitespace_pre && token.type !== TwigToken.type.logic_whitespace_pre) {
                        if (next_token) {
                            //If the next token is raw, shift it out
                            if (next_token.type === TwigToken.type.raw) {
                                tokens.shift();

                                //If the next token is not just whitespace, trim it
                                if (next_token.value.match(/^\s*$/) === null) {
                                    next_token.value = next_token.value.trim();
                                    //Unshift the next token
                                    tokens.unshift(next_token);
                                }
                            }
                        }
                    }

                    break;
            }

            log.trace("Twig.compile: ", " Output: ", output,
                " Logic Stack: ", stack,
                " Pending Output: ", intermediate_output );
        }

        // Verify that there are no logic tokens left in the stack.
        if (stack.length > 0) {
            unclosed_token = stack.pop();
            throw new Error("Unable to find an end tag for " + unclosed_token.type +
                ", expecting one of " + unclosed_token.next);
        }
        return output;
    } catch (ex) {
        log.error("Error compiling twig template " + this.id + ": ");
        if (ex.stack) {
            log.error(ex.stack);
        } else {
            log.error(ex.toString());
        }

        if (this.options.rethrow) throw ex;
    }
};
