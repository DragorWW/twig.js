/**
 * Twig.js 0.8.9
 *
 * @copyright 2011-2016 John Roepke and the Twig.js Contributors
 * @license   Available under the BSD 2-Clause License
 * @link      https://github.com/twigjs/twig.js
 */
var indexOf = require('./helper/indexOf');
var forEach = require('./helper/forEach');
var TwigError = require('./model/Error');
var log = require('./helper/log');
var markup = require('./helper/markup');
var TwigToken = require('./twig.token.js');

function Twig () {
    this.VERSION = '0.8.9';
    this.trace = false;
    this.debug = false;
    // Default caching to true for the improved performance it offers
    this.cache = true;
}

/**
 * Join the output token's stack and escape it if needed
 *
 * @param {Array} output token's stack
 *
 * @return {string|String} Autoescaped output
 */
Twig.prototype.output = function(output) {
    if (!this.options.autoescape) {
        return output.join("");
    }

    var strategy = 'html';
    if(typeof this.options.autoescape == 'string')
        strategy = this.options.autoescape;

    // [].map would be better but it's not supported by IE8-
    var escaped_output = [];
    forEach(output, function (str) {
        if (str && (str.twig_markup !== true && str.twig_markup != strategy)) {
            str = Twig.filters.escape(str, [ strategy ]);
        }
        escaped_output.push(str);
    });
    return markup(escaped_output.join(""));
};

require('./twig.compiler')(Twig);
require('./twig.expression')(Twig);
require('./twig.filters')(Twig);
require('./twig.functions')(Twig);
require('./twig.loader.ajax')(Twig);
require('./twig.loader.fs')(Twig);
require('./twig.logic')(Twig);
require('./twig.parser.source')(Twig);
require('./twig.parser.twig')(Twig);
require('./twig.path')(Twig);
require('./twig.tests')(Twig);
require('./twig.exports')(Twig);

module.exports = Twig.exports;
