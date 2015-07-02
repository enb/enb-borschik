var vow = require('vow'),
    preprocessor = new (require('../lib/borschik-preprocessor'))(),
    ProcessorSibling = require('sibling').declare({
        process: function () {
            return preprocessor.preprocessFile.apply(preprocessor, arguments);
        }
    });

/**
 * @class BorschikTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Processes file with borschik tool (https://github.com/bem/borschik).
 *
 * Can be used for replace and freeze links to images, fonts e.t.c. inside *.css, *.js, *.html source files,
 * and compress source files.
 *
 * Also has ability to override links to *.js and *.css files inside bemtree templates
 *
 * @param {Object}      [options]                  Options
 * @param {String}      [options.target]           Path to target with compiled file.
 * @param {String}      [options.source]           Path to source file which should be processed.
 * @param {String[]}    [options.dependantFiles]   Files with specified suffixes must be built before this tech execution.
 * @param {Boolean}     [options.minify=true]      Minimize file during borschik processing.
 * @param {Boolean}     [options.freeze=false]     Freeze links to sources.
 * @param {Boolean}     [options.noCache=false]    Forcibly drop cache usage.
 * @param {String}      [options.tech]             Technology for borschik processing. By default it corresponds to source file extension.
 * @param {Object}      [options.techOptions]      Params for 'tech' technology option
 *
 * @example
 * var CssStylus = require('enb-stylus/techs/stylus'),
 *     CssAutoprefixer = require('enb-autoprefixer/techs/css-autoprefixer'),
 *     Borschik = require('enb-borschik/techs/borschik'),
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
 *         // build css file
 *         node.addTechs([
 *            [CssStylus, { target: '?.noprefix.css' }],
 *            [CssAutoprefixer, {
 *                sourceTarget: '?.noprefix.css',
 *                destTarget: '?.css',
 *                browserSupport: ['last 2 versions', 'ie 10', 'opera 12.16']
 *            }]
 *         ]);
 *
 *         // minimize and freeze links inside *.css file by borschik
 *         node.addTech([Borschik, {
 *             source: '?.css',
 *             target: '_?.css',
 *             tech: 'cleancss',
 *             freeze: true,
 *             minify: true
 *         }]);
 *         node.addTarget('_?.css');
 *     });
 * };
 */
module.exports = require('enb/lib/build-flow').create()
    .name('borschik')
    .target('target')
    .useSourceFilename('source')
    .useSourceListFilenames('dependantFiles')
    .optionAlias('target', 'destTarget')
    .optionAlias('source', 'sourceTarget')
    .defineOption('minify', true)
    .defineOption('freeze', false)
    .defineOption('noCache', false)
    .defineOption('tech', null)
    .defineOption('techOptions', null)
    .needRebuild(function () {
        return this._noCache;
    })
    .saver(function () {})
    .builder(function () {
        var node = this.node,
            borschikProcessor = ProcessorSibling.fork();

        return vow
            .when(borschikProcessor.process(
                node.resolvePath(this._source),
                node.resolvePath(this._target),
                this._freeze,
                this._minify,
                this._tech,
                this._techOptions
            ))
            .then(function () {
                borschikProcessor.dispose();
            })
            .fail(function (err) {
                borschikProcessor.dispose();
                throw err;
            });
    })
    .createTech();
