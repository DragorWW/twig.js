// ## twig.filters.js
//
// This file handles parsing filters.
module.exports = function (Twig) {

    // Determine object type
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    Twig.filters = {
        // String Filters
        upper: require('./filter/upper'),
        lower: require('./filter/lower'),
        capitalize: require('./filter/capitalize'),
        title: require('./filter/title'),
        length: require('./filter/length'),

        // Array/Object Filters
        reverse: require('./filter/reverse'),
        sort: require('./filter/sort'),
        keys: require('./filter/keys'),
        url_encode: require('./filter/url_encode'),
        join: require('./filter/join'),
        "default": require('./filter/default'),
        json_encode: require('./filter/json_encode'),
        merge: require('./filter/merge'),
        date: require('./filter/date'),
        date_modify: require('./filter/date_modify'),
        replace: require('./filter/replace'),
        format: require('./filter/format'),
        striptags: require('./filter/striptags'),
        escape: require('./filter/escape'),
        /* Alias of escape */
        "e": require('./filter/escape'),
        nl2br: require('./filter/nl2br'),
        number_format: require('./filter/number_format'),
        trim: require('./filter/trim'),
        truncate: require('./filter/truncate'),
        slice: require('./filter/slice'),
        abs: require('./filter/abs'),
        first: require('./filter/first'),
        split: require('./filter/split'),
        last: require('./filter/last'),
        raw: function(value) {
            return Twig.Markup(value);
        },
        batch: require('./filter/batch'),
        round: require('./filter/round')
    };

    Twig.filter = function(filter, value, params) {
        if (!Twig.filters[filter]) {
            throw "Unable to find filter " + filter;
        }
        return Twig.filters[filter].apply(this, [value, params]);
    };

    Twig.filter.extend = function(filter, definition) {
        Twig.filters[filter] = definition;
    };

    return Twig;

};
