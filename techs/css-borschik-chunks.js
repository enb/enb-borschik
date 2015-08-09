/**
 * css-borschik-chunks
 * ===================
 *
 * Из *css*-файлов по deps'ам, собирает `css-chunks.js`-файл, обрабатывая инклуды, ссылки.
 * Умеет минифицировать и фризить.
 *
 * `css-chunks.js`-файлы нужны для создания bembundle-файлов или bembundle-страниц.
 * Технология bembundle активно используется в bem-tools для выделения
 * из проекта догружаемых кусков функционала и стилей (js/css).
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию `?.css-chunks.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *Boolean* **minify** — Минифицировать ли в процессе обработки. По умолчанию — `true`.
 * * *Boolean* **freeze** — Использовать ли фризинг в процессе обработки. По умолчанию — `true`.
 * * *String* **tech** — Технология сборки. По умолчанию — соответствует расширению исходного таргета.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech([ require('enb-borschik/techs/css-borschik-chunks'), {
 *   minify: true,
 *   freeze: false
 * } ]);
 * ```
 */
var vowFs = require('enb/lib/fs/async-fs'),
    borschik = require('borschik');

module.exports = require('enb-bembundle/techs/css-chunks').buildFlow()
    .name('css-borschik-chunks')
    .deprecated('enb-borschik', 'enb-bembundle', 'css-borschik-chunks',
        'It will be removed from this package in the next major version')
    .defineOption('freeze', true)
    .defineOption('minify', false)
    .defineOption('tech', null)
    .methods({
        processChunkData: function (sourceFilename) {
            var _this = this,
                target = this._target;

            return this.node.createTmpFileForTarget(target).then(function (tmpFile) {
                return borschik.api({
                        input: sourceFilename,
                        output: tmpFile,
                        freeze: _this._freeze,
                        minimize: _this._minify,
                        tech: _this._tech
                    })
                    .then(function () {
                        return vowFs.read(tmpFile, 'utf8').then(function (data) {
                            vowFs.remove(tmpFile);
                            return data;
                        });
                });
            });
        }
    })
    .createTech();
