// ## twig.lib.js
//
// This file contains 3rd party libraries used within twig.
//
// Copies of the licenses for the code included here can be found in the
// LICENSES.md file.
//

module.exports = function(Twig) {

    // Namespace for libraries
    Twig.lib = { };

    Twig.lib.sprintf = require('locutus/php/strings/sprintf');
    Twig.lib.vsprintf = require('locutus/php/strings/vsprintf');
    Twig.lib.round = require('locutus/php/math/round');
    Twig.lib.max = require('locutus/php/math/max');
    Twig.lib.min = require('locutus/php/math/min');
    Twig.lib.strip_tags = require('locutus/php/strings/strip_tags');
    Twig.lib.strtotime = require('locutus/php/datetime/strtotime');
    Twig.lib.date = require('locutus/php/datetime/date');
    Twig.lib.boolval = require('locutus/php/var/boolval');

    Twig.lib.is = require('./helper/is');

    // shallow-copy an object
    Twig.lib.copy = function(src) {
        var target = {},
            key;
        for (key in src)
            target[key] = src[key];

        return target;
    };

    Twig.lib.extend = function (src, add) {
        var keys = Object.keys(add),
            i;

        i = keys.length;

        while (i--) {
            src[keys[i]] = add[keys[i]];
        }

        return src;
    };

    Twig.lib.replaceAll = function(string, search, replace) {
        return string.split(search).join(replace);
    };

    // chunk an array (arr) into arrays of (size) items, returns an array of arrays, or an empty array on invalid input
    Twig.lib.chunkArray = function (arr, size) {
        var returnVal = [],
            x = 0,
            len = arr.length;

        if (size < 1 || !Twig.lib.is("Array", arr)) {
            return [];
        }

        while (x < len) {
            returnVal.push(arr.slice(x, x += size));
        }

        return returnVal;
    };

    return Twig;
};
