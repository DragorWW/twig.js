module.exports = function(Twig) {
    'use strict';

    Twig.Templates.registerLoader('ajax', require('./loader/ajax'));

};
