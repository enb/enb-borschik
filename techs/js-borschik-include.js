var EOL = require('os').EOL,
    enb = require('enb'),
    buildFlow = enb.buildFlow || require('enb/lib/build-flow');

/**
 * @class JSBorschikIncludeTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Collects js files declared by borschik (https://github.com/bem/borschik) includes.
 * Use this technology to compile source files that contain borschik includes.
 *
 * More details:
 * https://en.bem.info/tools/optimizers/borschik/js-include
 * https://ru.bem.info/tools/optimizers/borschik/js-include
 *
 * @param {Object}      [options]                          Options
 * @param {String}      [options.target=js]                Path to target with compiled file.
 * @param {String[]}    [options.sourceSuffixes=['js']]    Files with specified suffixes involved in the build process.
 *
 * @example
 * var BorschikTech = require('enb-borschik/techs/borschik'),
 *     BorschikJsIncludeTech = require('enb-borschik/techs/js-borschik-include'),
 *     FileProvideTech = require('enb/techs/file-provider'),
 *     bemTechs = require('enb-bem-techs');
 *
 * module.exports = function(config) {
 *     config.node('bundle', function(node) {
 *         // get FileList
 *         node.addTechs([
 *             [FileProvideTech, { target: '?.bemdecl.js' }],
 *             [bemTechs.levels, levels: ['blocks']],
 *             bemTechs.deps,
 *             bemTechs.files
 *         ]);
 *
 *         node.addTechs([
 *             // build JS file with `borschik:include`
 *             [BorschikJsIncludeTech, { target: '?.pre.js' }],
 *             // process JS file, open `borschik:include` notations
 *             [BorschikTech, {
 *                 target: '?.js',
 *                 source: '?.pre.js'
 *             }]
 *         ]);
 *         node.addTarget('?.js');
 *     });
 * };
 */
module.exports = buildFlow.create()
    .name('js-borschik-include')
    .target('target', '?.js')
    .useFileList(['js'])
    .builder(function (files) {
        return files.map(function (file) {
            return '/*borschik:include:' + this.node.relativePath(file.fullname) + '*/';
        }, this).join(EOL);
    })
    .createTech();
