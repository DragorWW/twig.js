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

    return Twig;
};
