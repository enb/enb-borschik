/**
 * js-borschik-include
 * ===================
 *
 * Собирает *js*-файлы инклудами борщика, сохраняет в виде `?.js`.
 * Технология нужна, если в исходных *js*-файлах используются инклуды борщика.
 *
 * В последствии, получившийся файл `?.js` следует раскрывать с помощью технологии `borschik`.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. Обязательная опция.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String[]* **sourceSuffixes** — суффиксы файлов, по которым строится files-таргет. По умолчанию — ['js'].
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTechs([
 *     [ require('enb-borschik/techs/js-borschik-include') ],
 *     [ require('enb-borschik/techs/borschik'), {
 *         source: '?.js',
 *         target: '_?.js'
 *     } ]);
 * ]);
 * ```
 */
var EOL = require('os').EOL;
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
