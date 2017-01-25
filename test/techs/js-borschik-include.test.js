var EOL = require('os').EOL,
    fs = require('fs'),
    path = require('path'),
    fsExtra = require('fs-extra'),
    FileList = require('enb/lib/file-list'),
    MockNode = require('mock-enb/lib/mock-node'),
    loadDirSync = require('mock-enb/utils/dir-utils').loadDirSync,
    Tech = require('../../techs/js-borschik-include');

describe('js-borschik-include', function () {
    var FOLDER = {
        blocks: path.resolve('./blocks'),
        bundle: path.resolve('./bundle')
    };

    beforeEach(function () {
        fsExtra.ensureDirSync(FOLDER.blocks);
        fsExtra.ensureDirSync(FOLDER.bundle);
    });

    afterEach(function () {
        fsExtra.removeSync(FOLDER.blocks);
        fsExtra.removeSync(FOLDER.bundle);
    });

    it('must join files with borschik includes', function () {
        var scheme = {
            'block1.js': 'var block1 = "block1";',
            'block2.js': 'var block2 = "block2";'
        };

        return build(scheme).spread(function (content) {
            content.must.equal([
                '/*borschik:include:../blocks/block1.js*/',
                '/*borschik:include:../blocks/block2.js*/'
            ].join(EOL));
        });
    });

    it('must work with empty set of files', function () {
        return build({}).spread(function (content) {
            content.must.equal('');
        });
    });

    it('must work with prefixString option correctly', function () {
        var scheme = {
                'block1.js': 'var block1 = "block1";',
                'block2.js': 'var block2 = "block2";'
            },
            options = {
                prefixString: '/*foobar*/'
            };

        return build(scheme, options).spread(function (content) {
            content.must.equal([
                '/*foobar*//*borschik:include:../blocks/block1.js*/',
                '/*foobar*//*borschik:include:../blocks/block2.js*/'
            ].join(EOL));
        });
    });

    it('must work with wrapper option correctly', function () {
        var scheme = {
                'block1.js': 'var block1 = "block1";',
                'block2.js': 'var block2 = "block2";'
            },
            options = {
                wrapper: function (file, content) {
                    return '/*foobar(' + file.fullname + ')*/' + content;
                }
            };

        return build(scheme, options).spread(function (content) {
            content.must.equal([
                '/*foobar(blocks/block1.js)*//*borschik:include:../blocks/block1.js*/',
                '/*foobar(blocks/block2.js)*//*borschik:include:../blocks/block2.js*/'
            ].join(EOL));
        });
    });

    function build(scheme, options) {
        var bundle = new MockNode('bundle'),
            fileList = new FileList();

        Object.keys(scheme).forEach(function (item) {
            fs.writeFileSync(path.join(FOLDER.blocks, item), scheme[item], { encoding: 'utf-8' });
        });

        fileList.addFiles(loadDirSync('blocks'));
        bundle.provideTechData('?.files', fileList);

        return bundle.runTechAndGetContent(Tech, options);
    }
});
