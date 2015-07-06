var EOL = require('os').EOL;

/**
 * @class JSBorschikIncludeTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Collects js files declared by borschik (https://github.com/bem/borschik) includes.
 * It must be used in case if you use borschik include declarations in your js files.
 *
 * More detail about this:
 * https://en.bem.info/tools/optimizers/borschik/js-include
 * https://ru.bem.info/tools/optimizers/borschik/js-include
 *
 * @param {Object}      options                            Options
 * @param {String}      options.target                     Path to target with compiled file.
 * @param {String[]}    [options.sourceSuffixes=['js']]    Files with specified suffixes involved in the assembly.
 *
 * @example
 * var BrowserJsTech = require('enb-diverse-js/techs/browser-js'),
 *     BorschikJsIncludeTech = require('enb-borschik/techs/js-borschik-include'),
 *     FileProvideTech = require('enb/techs/file-provider'),
 *     bem = require('enb-bem-techs');
 *
 * module.exports = function(config) {
 *     config.node('bundle', function(node) {
 *         // get FileList
 *         node.addTechs([
 *             [FileProvideTech, { target: '?.bemdecl.js' }],
 *             [bem.levels, levels: ['blocks']],
 *             bem.deps,
 *             bem.files
 *         ]);
 *
 *         // build js file
 *         node.addTechs([BrowserJsTech, { target: '?.js' }]);
 *
 *         // open js include declarations
 *         node.addTech(BorschikJsIncludeTech);
 *
 *         node.addTarget('?.js');
 *     });
 * };
 */
module.exports = require('enb/lib/build-flow').create()
    .name('js-borschik-include')
    .target('target', '?.js')
    .useFileList(['js'])
    .builder(function (files) {
        return files.map(function (file) {
            return '/*borschik:include:' + this.node.relativePath(file.fullname) + '*/';
        }, this).join(EOL);
    })
    .createTech();
