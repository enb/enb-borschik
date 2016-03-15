var EOL = require('os').EOL,
    fs = require('fs'),
    path = require('path'),
    vow = require('vow'),
    fsExtra = require('fs-extra'),
    clearConfigCache = require('borschik/lib/freeze').clearConfigCache,
    MockNode = require('mock-enb/lib/mock-node'),
    Tech = require('../../techs/borschik');

describe('borschik', function () {
    var TEST_DATA_FOLDER = path.resolve('./bundle');

    beforeEach(function () {
        fsExtra.ensureDirSync(TEST_DATA_FOLDER);
    });

    afterEach(function () {
        clearConfigCache();
        fsExtra.removeSync(TEST_DATA_FOLDER);
    });

    describe('css', function () {
        var baseOptions = {
            source: '?.css',
            target: '_?.css',
            noCache: true
        };

        it('must replace links in css file', function () {
            var scheme = {
                    configFile: { paths: { './': '/borschik/' } },
                    'bundle.css': '.block { background-image: url(./a/b.gif); }'
                },
                options = mergeConfigs(baseOptions, {
                    minify: false,
                    freeze: false
                });

            return build(scheme, options).then(function (content) {
                content.must.equal('.block { background-image: url("/borschik/a/b.gif"); }');
            });
        });

        it('must replace links in css file with minify option', function () {
            var scheme = {
                    configFile: { paths: { './': '/borschik/' } },
                    'bundle.css': '.block { background-image: url(./a/b.gif); }'
                },
                options = mergeConfigs(baseOptions, {
                    minify: true,
                    freeze: false
                });

            return build(scheme, options).then(function (content) {
                content.must.equal('.block{background-image:url(/borschik/a/b.gif)}');
            });
        });

        it('must replace links in css file with freeze option', function () {
            var scheme = {
                    configFile: {
                        freeze_paths: {
                            '**/*': 'freeze'
                        }
                    },
                    'image.gif': new Buffer('Hello World'),
                    'bundle.css': '.block { background-image: url("image.gif"); }'
                },
                options = mergeConfigs(baseOptions, {
                    minify: false,
                    freeze: true
                });

            return build(scheme, options).then(function (content) {
                content.must.equal(
                    '.block { background-image: url("freeze/Ck1VqNd45QIvq3AZd8XYQLvEhtA.gif"); }');
            });
        });

        it('must replace links in css file with minify and freeze options together', function () {
            var scheme = {
                    configFile: {
                        freeze_paths: {
                            '**/*': 'freeze'
                        }
                    },
                    'image.gif': new Buffer('Hello World'),
                    'bundle.css': '.block { background-image: url("image.gif"); }'
                },
                options = mergeConfigs(baseOptions, {
                    minify: true,
                    freeze: true
                });

            return build(scheme, options).then(function (content) {
                content.must.equal(
                    '.block{background-image:url(freeze/Ck1VqNd45QIvq3AZd8XYQLvEhtA.gif)}');
            });
        });

        it('must properly work with given tech (cleancss)', function () {
            var scheme = {
                    configFile: {
                        freeze_paths: {
                            '**/*': 'freeze'
                        }
                    },
                    'image.gif': new Buffer('Hello World'),
                    'extra.css': 'a { background: url(../partials/extra/down.gif) 0 0 no-repeat;}',
                    'bundle.css': '@import "./extra.css";'
                },
                options = mergeConfigs(baseOptions, {
                    minify: true,
                    freeze: false,
                    tech: 'cleancss'
                });

            return build(scheme, options).then(function (content) {
                content.must.equal('a{background:url(../partials/extra/down.gif) no-repeat}');
            });
        });

        it('must properly work with given tech (cleancss) with options', function () {
            var scheme = {
                    configFile: {
                        freeze_paths: {
                            '**/*': 'freeze'
                        }
                    },
                    'image.gif': new Buffer('Hello World'),
                    'extra.css': 'a { background: url(../partials/extra/down.gif) 0 0 no-repeat;}',
                    'bundle.css': [
                        '/*! Important comments included in minified output. */',
                        '@import "./extra.css";',
                    ].join(EOL)
                },
                options = mergeConfigs(baseOptions, {
                    minify: true,
                    freeze: false,
                    tech: 'cleancss',
                    techOptions: {
                        cleancss: {
                            keepSpecialComments: 0
                        }
                    }
                });

            return build(scheme, options).then(function (content) {
                content.must.equal('a{background:url(../partials/extra/down.gif) no-repeat}');
            });
        });
    });

    describe('js', function () {
        var baseOptions = {
                source: '?.js',
                target: '_?.js',
                noCache: true
            },
            borschikJS;

        before(function () {
            borschikJS = fs.readFileSync(path.resolve('./test/fixtures/borschik.js'), { encoding: 'utf-8' });
        });

        it('must replace links in js file', function () {
            var scheme = {
                    configFile: { paths: { './': '/borschik/' } },
                    'bundle.js': [
                        'var borschik = ' + borschikJS,
                        'exports.src = borschik.link("./a/b.gif");'
                    ].join(EOL)
                },
                options = mergeConfigs(baseOptions, {
                    minify: false,
                    freeze: false
                });

            return build(scheme, options, true).spread(function (content) {
                content.src.must.equal('/borschik/a/b.gif');
            });
        });

        it('must replace links in js file with minify option', function () {
            var scheme = {
                    configFile: { paths: { './': '/borschik/' } },
                    'bundle.js': [
                        'var borschik = ' + borschikJS,
                        'exports.src = function () { return borschik.link("./a/b.gif"); }'
                    ].join(EOL)
                },
                options = mergeConfigs(baseOptions, {
                    minify: true,
                    freeze: false
                });

            return build(scheme, options, true).spread(function (content) {
                content.src.toString().must.equal('function (){return"/borschik/a/b.gif"}');
            });
        });

        it('must replace links in js file with freeze option', function () {
            var scheme = {
                    configFile: {
                        freeze_paths: {
                            '**/*': 'freeze'
                        }
                    },
                    'image.gif': new Buffer('Hello World'),
                    'bundle.js': [
                        'var borschik = ' + borschikJS,
                        'exports.src = borschik.link("image.gif");'
                    ].join(EOL)
                },
                options = mergeConfigs(baseOptions, {
                    minify: false,
                    freeze: true
                });

            return build(scheme, options, true).spread(function (content) {
                content.src.toString().must.equal('freeze/Ck1VqNd45QIvq3AZd8XYQLvEhtA.gif');
            });
        });

        it('must replace links in js file with minify and freeze options together', function () {
            var scheme = {
                    configFile: {
                        freeze_paths: {
                            '**/*': 'freeze'
                        }
                    },
                    'image.gif': new Buffer('Hello World'),
                    'bundle.js': [
                        'var borschik = ' + borschikJS,
                        'exports.src = function () { return borschik.link("image.gif"); }'
                    ].join(EOL)
                },
                options = mergeConfigs(baseOptions, {
                    minify: true,
                    freeze: true
                });

            return build(scheme, options, true).spread(function (content) {
                content.src.toString().must.equal('function (){return"freeze/Ck1VqNd45QIvq3AZd8XYQLvEhtA.gif"}');
            });
        });

        it('must replace links in js file with minify, freeze and uglify', function () {
            var scheme = {
                    configFile: {
                        freeze_paths: {
                            '**/*': 'freeze'
                        }
                    },
                    'image.gif': new Buffer('Hello World'),
                    'bundle.js': [
                        'var borschik = ' + borschikJS,
                        'exports.src = function () { return borschik.link("image.gif"); }'
                    ].join(EOL)
                },
                options = mergeConfigs(baseOptions, {
                    minify: true,
                    freeze: true,
                    techOptions: {
                        uglify: {
                            output: {
                                beautify: true,
                                indent_start: 4
                            }
                        }
                    }
                });

            return build(scheme, options, true).spread(function (content) {
                content.src.toString().must.equal([
                    'function () {',
                    '        return "freeze/Ck1VqNd45QIvq3AZd8XYQLvEhtA.gif";',
                    '    }'
                ].join(EOL));
            });
        });
    });

    describe('bemtree', function () {
        var baseOptions = {
                source: '?.bemtree.js',
                target: '_?.bemtree.js',
                noCache: true
            },
            borschikJS;

        before(function () {
            borschikJS = fs.readFileSync(path.resolve('./test/fixtures/borschik.js'), { encoding: 'utf-8' });
        });

        it('must freeze url to js file inside bemtree template', function () {
            var scheme = {
                    configFile: {
                        freeze_paths: {
                            '**/*': 'freeze'
                        }
                    },
                    'site.js': new Buffer('Hello World'),
                    'bundle.bemtree.js': [
                        'var borschik = ' + borschikJS,
                        fs.readFileSync(path.resolve('./test/fixtures/bundle.bemtree.js'), { encoding: 'utf-8' })
                    ].join(EOL)
                },
                options = mergeConfigs(baseOptions, {
                    minify: false,
                    freeze: true
                });

            return build(scheme, options, true).spread(function (content) {
                global.Vow = vow;
                return content.BEMTREE.apply({ block: 'page' }).then(function (bemjson) {
                    bemjson.content[1].url.must.equal('freeze/Ck1VqNd45QIvq3AZd8XYQLvEhtA.js');
                });
            });
        });
    });

    describe('borschik process error', function () {
        it('must throw error on borschik processing error', function () {
            var scheme = {
                    configFile: { paths: { './': '/borschik/' } },
                    'bundle.css': '.block { background-image: url(./a/b.gif); }'
                },
                options = {
                    sourceTarget: '?.css',
                    destTarget: '_?.css',
                    noCache: true,
                    minify: false,
                    freeze: false,
                    tech: 'my-missed-invalid-tech'
                };

            return build(scheme, options).fail(function (error) {
                error.message.must.equal('Cannot find module \'borschik-tech-my-missed-invalid-tech\'');
            });
        });
    });

    describe('cache', function () {
        it('must skip rebuild with disabled "no_cache" tech option', function () {
            var bundle,
                expected = '.block { background-image: url("/borschik1/a1/b1.gif"); }',
                scheme = {
                    configFile: { paths: { './': '/borschik1/' } },
                    'bundle1': '.block { background-image: url(./a1/b1.gif); }',
                    'bundle2': '.block { background-image: url(./a2/b2.gif); }'
                },
                options = {
                    sourceTarget: '?.css',
                    destTarget: '_?.css',
                    noCache: false,
                    minify: false,
                    freeze: false
                };

            writeFiles(scheme);
            bundle = new MockNode('bundle');

            fs.symlinkSync(path.join(TEST_DATA_FOLDER, 'bundle1'), path.join(TEST_DATA_FOLDER, 'bundle.css'));

            return bundle.runTechAndGetContent(Tech, options)
                .spread(function (content1) {
                    content1.must.equal(expected);

                    clearConfigCache();
                    fs.unlinkSync(path.join(TEST_DATA_FOLDER, 'bundle.css'));
                    fs.symlinkSync(path.join(TEST_DATA_FOLDER, 'bundle2'), path.join(TEST_DATA_FOLDER, 'bundle.css'));

                    return bundle.runTechAndGetContent(Tech, options)
                        .spread(function (content2) {
                            content2.must.equal(expected);
                        });
                });
        });

        it('must rebuild with disabled "no_cache" tech option for modified file', function (done) {
            var bundle,
                expected1 = '.block { background-image: url("/borschik1/a1/b1.gif"); }',
                expected2 = '.block { background-image: url("/borschik2/a2/b2.gif"); }',
                scheme1 = {
                    configFile: { paths: { './': '/borschik1/' } },
                    'bundle.css': '.block { background-image: url(./a1/b1.gif); }'
                },
                options = {
                    sourceTarget: '?.css',
                    destTarget: '_?.css',
                    noCache: false,
                    minify: false,
                    freeze: false
                };

            writeFiles(scheme1);

            bundle = new MockNode('bundle');
            bundle.runTechAndGetContent(Tech, options)
                .spread(function (content1) {
                    content1.must.equal(expected1);

                    clearConfigCache();
                    var scheme2 = {
                        configFile: { paths: { './': '/borschik2/' } },
                        'bundle.css': '.block { background-image: url(./a2/b2.gif); }'
                    };

                    setTimeout(function () {
                        writeFiles(scheme2);

                        return bundle.runTechAndGetContent(Tech, options)
                            .spread(function (content2) {
                                content2.must.equal(expected2);
                                done();
                            });
                    }, 1000);

                });
        });
    });

    function mergeConfigs(baseOptions, options) {
        return Object.keys(baseOptions).reduce(function (prev, item) {
            prev[item] = baseOptions[item];
            return prev;
        }, options);
    }

    function writeFiles(scheme) {
        Object.keys(scheme).forEach(function (item) {
            if (item === 'configFile') {
                fsExtra.writeJSONSync(path.join(TEST_DATA_FOLDER, '.borschik'), scheme[item]);
            } else {
                fs.writeFileSync(path.join(TEST_DATA_FOLDER, item), scheme[item], { encoding: 'utf-8' });
            }
        });
    }

    function build(scheme, options, isNeedRequire) {
        var bundle,
            testFunc;

        writeFiles(scheme);
        bundle = new MockNode('bundle');

        testFunc = isNeedRequire ? bundle.runTechAndRequire : bundle.runTechAndGetContent;

        return testFunc.call(bundle, Tech, options)
            .then(function (content) {
                return isNeedRequire ? content : content.toString('utf-8');
            });
    }
});
