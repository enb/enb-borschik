var EOL = require('os').EOL,
    fs = require('fs'),
    path = require('path'),
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
        fsExtra.deleteSync(TEST_DATA_FOLDER);
    });

    describe('required options', function () {
        it('must throw error if sourceTarget property is missed', function () {
            var options = {},
                bundle = new MockNode('bundle');

            (function () {
                return bundle.runTechAndGetContent(Tech, options);
            }).must.throw('Option "source" is required for technology "borschik".');
        });

        it('must throw error if destTarget property is missed', function () {
            var options = { sourceTarget: '?.css' },
                bundle = new MockNode('bundle');

            (function () {
                return bundle.runTechAndGetContent(Tech, options);
            }).must.throw('Option "target" is required for technology "borschik".');
        });
    });

    describe('css', function () {
        it('must replace links in css file', function () {
            var scheme = {
                    configFile: { paths: { './': '/borschik/' } },
                    'bundle.css': '.block { background-image: url(./a/b.gif); }'
                },
                options = {
                    sourceTarget: '?.css',
                    destTarget: '_?.css',
                    noCache: true,
                    minify: false,
                    freeze: false
                };

            return build(scheme, options).then(function (content) {
                content.must.equal('.block { background-image: url("/borschik/a/b.gif"); }');
            });
        });

        it('must replace links in css file with minify option', function () {
            var scheme = {
                    configFile: { paths: { './': '/borschik/' } },
                    'bundle.css': '.block { background-image: url(./a/b.gif); }'
                },
                options = {
                    sourceTarget: '?.css',
                    destTarget: '_?.css',
                    noCache: true,
                    minify: true,
                    freeze: false
                };

            return build(scheme, options).then(function (content) {
                content.must.equal('.block{background-image:url("/borschik/a/b.gif")}');
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
                options = {
                    sourceTarget: '?.css',
                    destTarget: '_?.css',
                    noCache: true,
                    minify: false,
                    freeze: true
                };

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
                options = {
                    sourceTarget: '?.css',
                    destTarget: '_?.css',
                    noCache: true,
                    minify: true,
                    freeze: true
                };

            return build(scheme, options).then(function (content) {
                content.must.equal(
                    '.block{background-image:url("freeze/Ck1VqNd45QIvq3AZd8XYQLvEhtA.gif")}');
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
                    'extra.css': 'a { background:url(../partials/extra/down.gif) 0 0 no-repeat;}',
                    'bundle.css': '@import "./extra.css";'
                },
                options = {
                    sourceTarget: '?.css',
                    destTarget: '_?.css',
                    noCache: true,
                    minify: true,
                    freeze: false,
                    tech: 'cleancss'
                };

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
                    'extra.css': 'a { background:url(../partials/extra/down.gif) 0 0 no-repeat;}',
                    'bundle.css': [
                        '/*! Important comments included in minified output. */',
                        '@import "./extra.css";',
                    ].join(EOL)
                },
                options = {
                    sourceTarget: '?.css',
                    destTarget: '_?.css',
                    noCache: true,
                    minify: true,
                    freeze: false,
                    tech: 'cleancss',
                    techOptions: {
                        cleancss: {
                            keepSpecialComments: 0
                        }
                    }
                };

            return build(scheme, options).then(function (content) {
                content.must.equal('a{background:url(../partials/extra/down.gif) no-repeat}');
            });
        });
    });

    describe('js', function () {

    });

    function build(scheme, options) {
        var bundle;

        Object.keys(scheme).forEach(function (item) {
            if (item === 'configFile') {
                fsExtra.writeJSONSync(path.join(TEST_DATA_FOLDER, '.borschik'), scheme[item]);
            } else {
                fs.writeFileSync(path.join(TEST_DATA_FOLDER, item), scheme[item], { encoding: 'utf-8' });
            }
        });
        bundle = new MockNode('bundle');
        return bundle.runTechAndGetContent(Tech, options)
            .then(function (content) {
                return content.toString('utf-8');
            });
    }
});
