var Templates = require('./model/Templates.js');
module.exports = function(Twig) {
    'use strict';

    Templates.registerParser('source', function(params) {
        return params.data || '';
    });
};
