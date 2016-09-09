var forEach = require('../helper/forEach');
var TwigError = require('../model/Error');
var log = require('../helper/log');
var is = require('../helper/is');
var prepare = require('../helper/prepare');

module.exports = Template;

/**
 * Create a new twig.js template.
 *
 * Parameters: {
     *      data:   The template, either pre-compiled tokens or a string template
     *      id:     The name of this template
     *      blocks: Any pre-existing block from a child template
     * }
 *
 * @param {Object} params The template parameters.
 */
function Template ( params ) {
    var data = params.data,
        id = params.id,
        blocks = params.blocks,
        macros = params.macros || {},
        base = params.base,
        path = params.path,
        url = params.url,
        name = params.name,
        method = params.method,
        // parser options
        options = params.options;

    // # What is stored in a Twig.Template
    //
    // The Twig Template hold several chucks of data.
    //
    //     {
    //          id:     The token ID (if any)
    //          tokens: The list of tokens that makes up this template.
    //          blocks: The list of block this template contains.
    //          base:   The base template (if any)
    //            options:  {
    //                Compiler/parser options
    //
    //                strict_variables: true/false
    //                    Should missing variable/keys emit an error message. If false, they default to null.
    //            }
    //     }
    //

    this.id     = id;
    this.method = method;
    this.base   = base;
    this.path   = path;
    this.url    = url;
    this.name   = name;
    this.macros = macros;
    this.options = options;

    this.reset(blocks);

    if (is('String', data)) {
        this.tokens = prepare.apply(this, [data]);
    } else {
        this.tokens = data;
    }

    if (id !== undefined) {
        Twig.Templates.save(this);
    }
};

Template.prototype.reset = function(blocks) {
    log.debug("Twig.Template.reset", "Reseting template " + this.id);
    this.blocks = {};
    this.importedBlocks = [];
    this.originalBlockTokens = {};
    this.child = {
        blocks: blocks || {}
    };
    this.extend = null;
};

Template.prototype.render = function (context, params) {
    params = params || {};

    var output,
        url;

    this.context = context || {};

    // Clear any previous state
    this.reset();
    if (params.blocks) {
        this.blocks = params.blocks;
    }
    if (params.macros) {
        this.macros = params.macros;
    }

    output = Twig.parse.apply(this, [this.tokens, this.context]);

    // Does this template extend another
    if (this.extend) {
        var ext_template;

        // check if the template is provided inline
        if ( this.options.allowInlineIncludes ) {
            ext_template = Twig.Templates.load(this.extend);
            if ( ext_template ) {
                ext_template.options = this.options;
            }
        }

        // check for the template file via include
        if (!ext_template) {
            url = Twig.path.parsePath(this, this.extend);

            ext_template = Twig.Templates.loadRemote(url, {
                method: this.getLoaderMethod(),
                base: this.base,
                async:  false,
                id:     url,
                options: this.options
            });
        }

        this.parent = ext_template;

        return this.parent.render(this.context, {
            blocks: this.blocks
        });
    }

    if (params.output == 'blocks') {
        return this.blocks;
    } else if (params.output == 'macros') {
        return this.macros;
    } else {
        return output;
    }
};

Template.prototype.importFile = function(file) {
    var url, sub_template;
    if (!this.url && this.options.allowInlineIncludes) {
        file = this.path ? this.path + '/' + file : file;
        sub_template = Twig.Templates.load(file);

        if (!sub_template) {
            sub_template = Twig.Templates.loadRemote(url, {
                id: file,
                method: this.getLoaderMethod(),
                async: false,
                options: this.options
            });

            if (!sub_template) {
                throw new TwigError("Unable to find the template " + file);
            }
        }

        sub_template.options = this.options;

        return sub_template;
    }

    url = Twig.path.parsePath(this, file);

    // Load blocks from an external file
    sub_template = Twig.Templates.loadRemote(url, {
        method: this.getLoaderMethod(),
        base: this.base,
        async: false,
        options: this.options,
        id: url
    });

    return sub_template;
};

Template.prototype.importBlocks = function(file, override) {
    var sub_template = this.importFile(file),
        context = this.context,
        that = this;

    override = override || false;

    sub_template.render(context);

    // Mixin blocks
    forEach(Object.keys(sub_template.blocks), function(key) {
        if (override || that.blocks[key] === undefined) {
            that.blocks[key] = sub_template.blocks[key];
            that.importedBlocks.push(key);
        }
    });
};

Template.prototype.importMacros = function(file) {
    var url = Twig.path.parsePath(this, file);

    // load remote template
    var remoteTemplate = Twig.Templates.loadRemote(url, {
        method: this.getLoaderMethod(),
        async: false,
        id: url
    });

    return remoteTemplate;
};

Template.prototype.getLoaderMethod = function() {
    if (this.path) {
        return 'fs';
    }
    if (this.url) {
        return 'ajax';
    }
    return this.method || 'fs';
};

Template.prototype.compile = function(options) {
    // compile the template into raw JS
    return Twig.compiler.compile(this, options);
};
