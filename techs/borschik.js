var path = require('path'),
    enb = require('enb'),
    buildFlow = enb.buildFlow || require('enb/lib/build-flow');

/**
 * @class BorschikTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Processes file with borschik tool (https://github.com/bem/borschik).
 *
 * Can be used:
 *
 * - To replace and freeze links to images, fonts etc. inside *.css, *.js, *.html files,
 * - To compress files.
 *
 * @param {Object}      options                    Options
 * @param {String}      options.target             Path to a target with processed file.
 * @param {String}      options.source             Path to a source file which should be processed.
 * @param {String[]}    [options.dependantFiles]   Files that must be built before borschik tech execution.
 * @param {Boolean}     [options.minify=true]      Minimize file during borschik processing.
 * @param {Boolean}     [options.freeze=true]      Freeze links to sources.
 * @param {Boolean}     [options.noCache=false]    Drops cache usage forcibly.
 * @param {String}      [options.tech]             Technology that should be processed with borschik.
 * @param {Object}      [options.techOptions]      Params for 'tech' option
 *
 * @example
 * var BorschikTech = require('enb-bh/techs/borschik'),
 *     FileProvideTech = require('enb/techs/file-provider');
 *
 * module.exports = function(config) {
 *     // build CSS file with `.dev.css` extension
 *
 *     // in dev mode process CSS-file using `borschik`
 *     config.mode('development', function () {
 *         config.node('bundle', function (node) {
 *             node.addTech([BorschikTech, {
 *                 source: '?.dev.css',
 *                 target: '?.css',
 *                 minify: false,
 *                 freeze: true
 *             }]);
 *         });
 *     });
 *
 *     // in production mode process CSS-file using `borschik`
 *     // and minimize it using `cleancss`
 *     config.mode('production', function () {
 *         config.node('bundle', function (node) {
 *             node.addTech([BorschikTech, {
 *                 source: '?.dev.css',
 *                 target: '?.css',
 *                 minify: true,
 *                 freeze: true,
 *                 tech: 'cleancss'
 *             }]);
 *         });
 *     });
 * };
 */
module.exports = buildFlow.create()
    .name('borschik')
    .target('target')
    .useSourceFilename('source')
    .defineRequiredOption('source')
    .optionAlias('target', 'destTarget')
    .optionAlias('source', 'sourceTarget')
    .defineOption('minify', true)
    .defineOption('freeze', true)
    .defineOption('noCache', false)
    .defineOption('tech', null)
    .defineOption('techOptions', null)
    .defineOption('dependantFiles', [])
    .needRebuild(function () {
        return this._noCache;
    })
    .saver(function () {})
    .builder(function () {
        var node = this.node,
            modulePath = path.resolve(__dirname, '../lib/borschik-api'),
            opts = {
                input: node.resolvePath(this._source),
                output: node.resolvePath(this._target),
                freeze: this._freeze,
                minimize: this._minify,
                tech: this._tech,
                techOptions: this._techOptions
            },
            jobQueue = this.node.getSharedResources().jobQueue,
            sourcesByNodes = this._dependantFiles.reduce(function (acc, dependancy) {
                if (typeof dependancy === 'object') {
                    return dependancy;
                }

                var nodePath = node.getPath();

                acc[nodePath] || (acc[nodePath] = []);
                acc[nodePath].push(dependancy);

                return acc;
            }, {});

        return node.requireNodeSources(sourcesByNodes).then(function () {
            return jobQueue.push(modulePath, opts);
        });
    })
    .createTech();
