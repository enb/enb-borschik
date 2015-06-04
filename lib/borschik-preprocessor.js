/**
 * BorschikPreprocessor
 * ====================
 */

var inherit = require('inherit');
var vow = require('vow');
var borschik = require('borschik');

/**
 * BorschikPreprocessor — препроцессор js/css-файлов на основе Борщика.
 * @name BorschikPreprocessor
 */
module.exports = inherit({
    /**
     * Осуществляет обработку файла Борщиком.
     * @param {String} sourceFilename Исходный файл.
     * @param {String} destFilename Результирующий файл.
     * @param {Boolean} freeze Осуществлять ли фризинг.
     * @param {Boolean} minimize Осуществлять ли минимизацию.
     * @param {Tech} [tech]
     * @param {Object} [techOptions] Параметры для технологии.
     * @param {Boolean} comments Добавлять ли комментарии.
     * @returns {*}
     */
    preprocessFile: function (sourceFilename, destFilename, freeze, minimize, tech, techOptions, comments) {
        var opts = {
            input: sourceFilename,
            output: destFilename,
            freeze: freeze,
            minimize: minimize,
            comments: comments
        };

        if (tech) {
            opts.tech = tech;
        }

        if (techOptions) {
            opts.techOptions = techOptions;
        }

        return vow.when(borschik.api(opts));
    }
});
