var replaceAll = require('../helper/replaceAll');

module.exports = function (value) {
    if (value === undefined || value === null) {
        return;
    }
    var linebreak_tag = "BACKSLASH_n_replace",
        br = "<br />" + linebreak_tag;

    value = Twig.filters.escape(value)
        .replace(/\r\n/g, br)
        .replace(/\r/g, br)
        .replace(/\n/g, br);

    value = replaceAll(value, linebreak_tag, "\n");

    return Twig.Markup(value);
}
