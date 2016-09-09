var Template = require('./model/Template');

module.exports = function(Twig) {
    'use strict';

    Twig.Templates.registerParser('twig', function(params) {
        return new Template(params);
    });
};
