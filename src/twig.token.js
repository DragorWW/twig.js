var log = require('./helper/log.js');
var TwigError = require('./model/Error');

/**
 * Container for methods related to handling high level template tokens
 *      (for example: {{ expression }}, {% logic %}, {# comment #}, raw data)
 */
var token = {};

/**
 * Token types.
 */
token.type = {
    output:                 'output',
    logic:                  'logic',
    comment:                'comment',
    raw:                    'raw',
    output_whitespace_pre:  'output_whitespace_pre',
    output_whitespace_post: 'output_whitespace_post',
    output_whitespace_both: 'output_whitespace_both',
    logic_whitespace_pre:   'logic_whitespace_pre',
    logic_whitespace_post:  'logic_whitespace_post',
    logic_whitespace_both:  'logic_whitespace_both'
};

/**
 * Token syntax definitions.
 */
token.definitions = [
    {
        type: token.type.raw,
        open: '{% raw %}',
        close: '{% endraw %}'
    },
    {
        type: token.type.raw,
        open: '{% verbatim %}',
        close: '{% endverbatim %}'
    },
    // *Whitespace type tokens*
    //
    // These typically take the form `{{- expression -}}` or `{{- expression }}` or `{{ expression -}}`.
    {
        type: token.type.output_whitespace_pre,
        open: '{{-',
        close: '}}'
    },
    {
        type: token.type.output_whitespace_post,
        open: '{{',
        close: '-}}'
    },
    {
        type: token.type.output_whitespace_both,
        open: '{{-',
        close: '-}}'
    },
    {
        type: token.type.logic_whitespace_pre,
        open: '{%-',
        close: '%}'
    },
    {
        type: token.type.logic_whitespace_post,
        open: '{%',
        close: '-%}'
    },
    {
        type: token.type.logic_whitespace_both,
        open: '{%-',
        close: '-%}'
    },
    // *Output type tokens*
    //
    // These typically take the form `{{ expression }}`.
    {
        type: token.type.output,
        open: '{{',
        close: '}}'
    },
    // *Logic type tokens*
    //
    // These typically take a form like `{% if expression %}` or `{% endif %}`
    {
        type: token.type.logic,
        open: '{%',
        close: '%}'
    },
    // *Comment type tokens*
    //
    // These take the form `{# anything #}`
    {
        type: token.type.comment,
        open: '{#',
        close: '#}'
    }
];


/**
 * What characters start "strings" in token definitions. We need this to ignore token close
 * strings inside an expression.
 */
token.strings = ['"', "'"];

token.findStart = function (template) {
    var output = {
            position: null,
            close_position: null,
            def: null
        },
        i,
        token_template,
        first_key_position,
        close_key_position;

    for (i=0;i<token.definitions.length;i++) {
        token_template = token.definitions[i];
        first_key_position = template.indexOf(token_template.open);
        close_key_position = template.indexOf(token_template.close);

        log.trace("token.findStart: ", "Searching for ", token_template.open, " found at ", first_key_position);

        //Special handling for mismatched tokens
        if (first_key_position >= 0) {
            //This token matches the template
            if (token_template.open.length !== token_template.close.length) {
                //This token has mismatched closing and opening tags
                if (close_key_position < 0) {
                    //This token's closing tag does not match the template
                    continue;
                }
            }
        }
        // Does this token occur before any other types?
        if (first_key_position >= 0 && (output.position === null || first_key_position < output.position)) {
            output.position = first_key_position;
            output.def = token_template;
            output.close_position = close_key_position;
        } else if (first_key_position >= 0 && output.position !== null && first_key_position === output.position) {
            /*This token exactly matches another token,
             greedily match to check if this token has a greater specificity*/
            if (token_template.open.length > output.def.open.length) {
                //This token's opening tag is more specific than the previous match
                output.position = first_key_position;
                output.def = token_template;
                output.close_position = close_key_position;
            } else if (token_template.open.length === output.def.open.length) {
                if (token_template.close.length > output.def.close.length) {
                    //This token's opening tag is as specific as the previous match,
                    //but the closing tag has greater specificity
                    if (close_key_position >= 0 && close_key_position < output.close_position) {
                        //This token's closing tag exists in the template,
                        //and it occurs sooner than the previous match
                        output.position = first_key_position;
                        output.def = token_template;
                        output.close_position = close_key_position;
                    }
                } else if (close_key_position >= 0 && close_key_position < output.close_position) {
                    //This token's closing tag is not more specific than the previous match,
                    //but it occurs sooner than the previous match
                    output.position = first_key_position;
                    output.def = token_template;
                    output.close_position = close_key_position;
                }
            }
        }
    }

    delete output['close_position'];

    return output;
};

token.findEnd = function (template, token_def, start) {
    var end = null,
        found = false,
        offset = 0,

        // String position variables
        str_pos = null,
        str_found = null,
        pos = null,
        end_offset = null,
        this_str_pos = null,
        end_str_pos = null,

        // For loop variables
        i,
        l;

    while (!found) {
        str_pos = null;
        str_found = null;
        pos = template.indexOf(token_def.close, offset);

        if (pos >= 0) {
            end = pos;
            found = true;
        } else {
            // throw an exception
            throw new TwigError("Unable to find closing bracket '" + token_def.close +
                "'" + " opened near template position " + start);
        }

        // Ignore quotes within comments; just look for the next comment close sequence,
        // regardless of what comes before it. https://github.com/justjohn/twig.js/issues/95
        if (token_def.type === token.type.comment) {
            break;
        }
        // Ignore quotes within raw tag
        // Fixes #283
        if (token_def.type === token.type.raw) {
            break;
        }

        l = token.strings.length;
        for (i = 0; i < l; i += 1) {
            this_str_pos = template.indexOf(token.strings[i], offset);

            if (this_str_pos > 0 && this_str_pos < pos &&
                (str_pos === null || this_str_pos < str_pos)) {
                str_pos = this_str_pos;
                str_found = token.strings[i];
            }
        }

        // We found a string before the end of the token, now find the string's end and set the search offset to it
        if (str_pos !== null) {
            end_offset = str_pos + 1;
            end = null;
            found = false;
            while (true) {
                end_str_pos = template.indexOf(str_found, end_offset);
                if (end_str_pos < 0) {
                    throw "Unclosed string in template";
                }
                // Ignore escaped quotes
                if (template.substr(end_str_pos - 1, 1) !== "\\") {
                    offset = end_str_pos + 1;
                    break;
                } else {
                    end_offset = end_str_pos + 1;
                }
            }
        }
    }
    return end;
};

module.exports = token;
