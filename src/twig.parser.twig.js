var Template = require('./model/Template');
var Templates = require('./model/Templates');

module.exports = function(Twig) {
    'use strict';

    Templates.registerParser('twig', function(params) {
        return new Template(params);
    });
};
