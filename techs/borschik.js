/**
 * borschik
 * ========
 *
 * Обрабатывает файл Борщиком (раскрытие borschik-ссылок, минификация, фризинг).
 *
 * Настройки фризинга и путей описываются в конфиге Борщика (`.borschik`) в корне проекта
 * (https://github.com/veged/borschik/blob/master/README.ru.md).
 *
 * **Опции**
 *
 * * *String* **source** — Исходный файл. Например, `?.js`. Обязательная опция.
 * * *String* **target** — Результирующий файл. Например, `_?.js`. Обязательная опция.
 * * *String* **dependantFiles** — Замораживаемые борщиком файлы. Например `['?.css', '?.js']`.
 * * *Boolean* **minify** — Минифицировать ли в процессе обработки. По умолчанию — `true`.
 * * *Boolean* **freeze** — Использовать ли фризинг в процессе обработки. По умолчанию — `false`.
 * * *Boolean* **noCache** — Не использовать кеш для принятия решения о пересборке файла. По умолчанию — `false`.
 * * *String* **tech** — Технология сборки. По умолчанию — соответствует расширению исходного таргета.
 * * *Object* **techOptions** — Параметры для технологии.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech([ require('enb-borschik/techs/borschik'), {
 *   sourceTarget: '?.css',
 *   destTarget: '_?.css',
 *   dependantFiles: ['?.css', '?.js'],
 *   minify: true,
 *   freeze: true,
 *   tech: 'css+'
 * } ]);
 * ```
 */
var vow = require('vow'),
    preprocessor = new (require('../lib/borschik-preprocessor'))(),
    ProcessorSibling = require('sibling').declare({
        process: function () {
            return preprocessor.preprocessFile.apply(preprocessor, arguments);
        }
    });

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
