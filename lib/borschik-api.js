var fs = require('fs'),
    path = require('path'),
    FileCache = require('enb/lib/cache/file-cache'),
    borschik = require('borschik/lib/coa'),
    borschikUtil = require('borschik/lib/util');

// удаляем дефолтное поведение боршика
borschik._act.pop();

borschik.act(function (opts) {
    var tech = opts.tech,
        input = opts.input;

    if (!tech && typeof input === 'string') {
        tech = path.extname(input).substr(1);
    }

    if (!tech || !tech.Tech) {
        tech = borschikUtil.getTech(tech, true);
    }

    var instance = new (tech.Tech)(opts),
        fileCache = new FileCache({
            tmpDir: opts.tmpDir,
            root: opts.root
        });

    instance.cache = {
        getProcessedContent: function (filename, data) {
            try {
                var cachedData = data || {},
                    stats = fs.statSync(filename);

                cachedData.mtime = stats.mtime;

                var cachedPath = fileCache._getPath(filename, cachedData);

                return fs.readFileSync(cachedPath, { encoding: 'utf-8' });
            } catch (err) {}
        },
        setProcessedContent: function (filename, contents, data) {
            var cachedData = data || {},
                stats;

            try {
                var cachedData = data || {},
                    stats = fs.statSync(filename);

                cachedData.mtime = stats.mtime;

                var cachedPath = fileCache._getPath(filename, cachedData);

                return fs.writeFileSync(cachedPath, contents, { encoding: 'utf-8' });
            } catch (err) {}
        }
    };

    return instance.process();
});

module.exports = borschik.api;
