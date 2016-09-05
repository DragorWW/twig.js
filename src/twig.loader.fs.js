module.exports = function(Twig) {
    'use strict';

    Twig.Templates.registerLoader('fs', require('./loader/fs'));

};
