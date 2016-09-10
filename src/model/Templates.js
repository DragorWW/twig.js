// Namespace for template storage and retrieval
var Templates = {
    /**
     * Registered template loaders - use Templates.registerLoader to add supported loaders
     * @type {Object}
     */
    loaders: {},

    /**
     * Registered template parsers - use Templates.registerParser to add supported parsers
     * @type {Object}
     */
    parsers: {},

    /**
     * Cached / loaded templates
     * @type {Object}
     */
    registry: {}
};

/**
 * Is this id valid for a twig template?
 *
 * @param {string} id The ID to check.
 *
 * @throws {TwigError} If the ID is invalid or used.
 * @return {boolean} True if the ID is valid.
 */
Twig.validateId = function(id) {
    if (id === "prototype") {
        throw new TwigError(id + " is not a valid twig identifier");
    } else if (Twig.cache && Templates.registry.hasOwnProperty(id)) {
        throw new TwigError("There is already a template with the ID " + id);
    }
    return true;
}

/**
 * Register a template loader
 *
 * @example
 * Twig.extend(function(Twig) {
     *    Templates.registerLoader('custom_loader', function(location, params, callback, error_callback) {
     *        // ... load the template ...
     *        params.data = loadedTemplateData;
     *        // create and return the template
     *        var template = new Twig.Template(params);
     *        if (typeof callback === 'function') {
     *            callback(template);
     *        }
     *        return template;
     *    });
     * });
 *
 * @param {String} method_name The method this loader is intended for (ajax, fs)
 * @param {Function} func The function to execute when loading the template
 * @param {Object|undefined} scope Optional scope parameter to bind func to
 *
 * @throws TwigError
 *
 * @return {void}
 */
Templates.registerLoader = function(method_name, func, scope) {
    if (typeof func !== 'function') {
        throw new TwigError('Unable to add loader for ' + method_name + ': Invalid function reference given.');
    }
    if (scope) {
        func = func.bind(scope);
    }
    this.loaders[method_name] = func;
};

/**
 * Remove a registered loader
 *
 * @param {String} method_name The method name for the loader you wish to remove
 *
 * @return {void}
 */
Templates.unRegisterLoader = function(method_name) {
    if (this.isRegisteredLoader(method_name)) {
        delete this.loaders[method_name];
    }
};

/**
 * See if a loader is registered by its method name
 *
 * @param {String} method_name The name of the loader you are looking for
 *
 * @return {boolean}
 */
Templates.isRegisteredLoader = function(method_name) {
    return this.loaders.hasOwnProperty(method_name);
};

/**
 * Register a template parser
 *
 * @example
 * Twig.extend(function(Twig) {
     *    Templates.registerParser('custom_parser', function(params) {
     *        // this template source can be accessed in params.data
     *        var template = params.data
     *
     *        // ... custom process that modifies the template
     *
     *        // return the parsed template
     *        return template;
     *    });
     * });
 *
 * @param {String} method_name The method this parser is intended for (twig, source)
 * @param {Function} func The function to execute when parsing the template
 * @param {Object|undefined} scope Optional scope parameter to bind func to
 *
 * @throws TwigError
 *
 * @return {void}
 */
Templates.registerParser = function(method_name, func, scope) {
    if (typeof func !== 'function') {
        throw new TwigError('Unable to add parser for ' + method_name + ': Invalid function regerence given.');
    }

    if (scope) {
        func = func.bind(scope);
    }

    this.parsers[method_name] = func;
};

/**
 * Remove a registered parser
 *
 * @param {String} method_name The method name for the parser you wish to remove
 *
 * @return {void}
 */
Templates.unRegisterParser = function(method_name) {
    if (this.isRegisteredParser(method_name)) {
        delete this.parsers[method_name];
    }
};

/**
 * See if a parser is registered by its method name
 *
 * @param {String} method_name The name of the parser you are looking for
 *
 * @return {boolean}
 */
Templates.isRegisteredParser = function(method_name) {
    return this.parsers.hasOwnProperty(method_name);
};

/**
 * Save a template object to the store.
 *
 * @param {Twig.Template} template   The twig.js template to store.
 */
Templates.save = function(template) {
    if (template.id === undefined) {
        throw new TwigError("Unable to save template with no id");
    }
    Templates.registry[template.id] = template;
};

/**
 * Load a previously saved template from the store.
 *
 * @param {string} id   The ID of the template to load.
 *
 * @return {Twig.Template} A twig.js template stored with the provided ID.
 */
Templates.load = function(id) {
    if (!Templates.registry.hasOwnProperty(id)) {
        return null;
    }
    return Templates.registry[id];
};

/**
 * Load a template from a remote location using AJAX and saves in with the given ID.
 *
 * Available parameters:
 *
 *      async:       Should the HTTP request be performed asynchronously.
 *                      Defaults to true.
 *      method:      What method should be used to load the template
 *                      (fs or ajax)
 *      parser:      What method should be used to parse the template
 *                      (twig or source)
 *      precompiled: Has the template already been compiled.
 *
 * @param {string} location  The remote URL to load as a template.
 * @param {Object} params The template parameters.
 * @param {function} callback  A callback triggered when the template finishes loading.
 * @param {function} error_callback  A callback triggered if an error occurs loading the template.
 *
 *
 */
Templates.loadRemote = function(location, params, callback, error_callback) {
    var loader;

    // Default to async
    if (params.async === undefined) {
        params.async = true;
    }

    // Default to the URL so the template is cached.
    if (params.id === undefined) {
        params.id = location;
    }

    // Check for existing template
    if (Twig.cache && Templates.registry.hasOwnProperty(params.id)) {
        // A template is already saved with the given id.
        if (typeof callback === 'function') {
            callback(Templates.registry[params.id]);
        }
        // TODO: if async, return deferred promise
        return Templates.registry[params.id];
    }

    //if the parser name hasn't been set, default it to twig
    params.parser = params.parser || 'twig';

    // Assume 'fs' if the loader is not defined
    loader = this.loaders[params.method] || this.loaders.fs;
    return loader.apply(this, arguments);
};

module.exports = Templates;
