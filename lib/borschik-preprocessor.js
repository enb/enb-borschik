/**
 * BorschikPreprocessor
 * ====================
 */

var borschik = require('borschik');

/**
 * Осуществляет обработку js/css-файла Борщиком.
 * @param {String} sourceFilename Исходный файл.
 * @param {String} destFilename Результирующий файл.
 * @param {Boolean} freeze Осуществлять ли фризинг.
 * @param {Boolean} minimize Осуществлять ли минимизацию.
 * @param {Tech} [tech]
 * @param {Object} [techOptions] Параметры для технологии.
 * @param {Boolean} comments Добавлять ли комментарии.
 * @returns {*}
 */
module.exports = function (sourceFilename, destFilename, freeze, minimize, tech, techOptions, comments) {
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

    return borschik.api(opts);
};
