// ## twig.functions.js
//
// This file handles parsing filters.
module.exports = function (Twig) {
    Twig.functions = {
        range: require('./function/range'),
        cycle: require('./function/cycle'),
        dump: require('./function/dump'),
        date: require('./function/date'),
        block: require('./function/block'),
        parent: require('./function/parent'),
        attribute: require('./function/attribute'),
        max: require('./function/max'),
        min: require('./function/min'),
        template_from_string: require('./function/template_from_string'),
        random: require('./function/random'),
        source: require('./function/source')
    };

    Twig._function = function(_function, value, params) {
        if (!Twig.functions[_function]) {
            throw "Unable to find function " + _function;
        }
        return Twig.functions[_function](value, params);
    };

    Twig._function.extend = function(_function, definition) {
        Twig.functions[_function] = definition;
    };

    return Twig;

};
