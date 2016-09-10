var Templates = require('../model/Templates.js');
module.exports = function (template) {
    if (template === undefined) {
        template = '';
    }
    return Templates.parsers.twig({
        options: this.options,
        data: template
    });
}
