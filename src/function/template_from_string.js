module.exports = function (template) {
    if (template === undefined) {
        template = '';
    }
    return Twig.Templates.parsers.twig({
        options: this.options,
        data: template
    });
}
