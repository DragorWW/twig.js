/**
 * @constant
 * @type {string}
 */
var TEMPLATE_NOT_FOUND_MESSAGE = 'Template "{name}" is not defined.';

/**
 * Returns the content of a template without rendering it
 * @param {string} name
 * @param {boolean} [ignore_missing=false]
 * @returns {string}
 */
module.exports = function (name, ignore_missing) {
    var templateSource;
    var templateFound = false;
    var isNodeEnvironment = typeof module !== 'undefined' && typeof module.exports !== 'undefined' && typeof window === 'undefined';
    var loader;
    var path;

    //if we are running in a node.js environment, set the loader to 'fs' and ensure the
    // path is relative to the CWD of the running script
    //else, set the loader to 'ajax' and set the path to the value of name
    if (isNodeEnvironment) {
        loader = 'fs';
        path = __dirname + '/' + name;
    } else {
        loader = 'ajax';
        path = name;
    }

    //build the params object
    var params = {
        id: name,
        path: path,
        method: loader,
        parser: 'source',
        async: false,
        fetchTemplateSource: true
    };

    //default ignore_missing to false
    if (typeof ignore_missing === 'undefined') {
        ignore_missing = false;
    }

    //try to load the remote template
    //
    //on exception, log it
    try {
        templateSource = Twig.Templates.loadRemote(name, params);

        //if the template is undefined or null, set the template to an empty string and do NOT flip the
        // boolean indicating we found the template
        //
        //else, all is good! flip the boolean indicating we found the template
        if (typeof templateSource === 'undefined' || templateSource === null) {
            templateSource = '';
        } else {
            templateFound = true;
        }
    } catch (e) {
        Twig.log.debug('Twig.functions.source: ', 'Problem loading template  ', e);
    }

    //if the template was NOT found AND we are not ignoring missing templates, return the same message
    // that is returned by the PHP implementation of the twig source() function
    //
    //else, return the template source
    if (!templateFound && !ignore_missing) {
        return TEMPLATE_NOT_FOUND_MESSAGE.replace('{name}', name);
    } else {
        return templateSource;
    }
}
