var Templates = require('./model/Templates.js');
module.exports = function(Twig) {
    'use strict';

    Templates.registerLoader('fs', require('./loader/fs'));

};
