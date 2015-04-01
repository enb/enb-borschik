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
 * * *Boolean* **minify** — Минифицировать ли в процессе обработки. По умолчанию — `true`.
 * * *Boolean* **freeze** — Использовать ли фризинг в процессе обработки. По умолчанию — `false`.
 * * *Boolean* **freezeableExts** — Расширения замораживаемых файлов через пробел.
 * * *String* **depsTargets** — Замораживаемые борщиком таргеты.
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
 *   minify: true,
 *   freeze: true,
 *   freezeableExts: 'js css ico',
 *   depsTargets: ['?.css', '?.js'],
 *   tech: 'css+'
 * } ]);
 * ```
 */
var vow = require('vow'),
    borschikPreprocessor = new (require('../lib/borschik-preprocessor'))(),
    BorschikProcessorSibling = require('sibling').declare({
        process: function() { return borschikPreprocessor.preprocessFile.apply(borschikPreprocessor, arguments); }
    });

var buildFlow = require('enb/lib/build-flow').create();

// переопределить метод сохранения результата сборки, чтобы он не перетер файл с результатом работы борщика
buildFlow._saveFunc = function() {};

module.exports = buildFlow
    .name('borschik')
    .target('target')
    .defineRequiredOption('source')
    .defineOption('freeze', false)
    .defineOption('freezeableExts')
    .defineOption('minify', true)
    .defineOption('noCache', false)
    .defineOption('tech', null)
    .defineOption('techOptions', null)
    .useSourceResult('source')
    .useSourceListFilenames('depsTargets')
    .builder(function() {
        var node = this.node,
            getTargetAbsPath = function(target) { return node.resolvePath(node.unmaskTargetName(target)); },
            borschikProcessor = BorschikProcessorSibling.fork();

        if(this._freezeableExts) process.env.BORSCHIK_FREEZABLE_EXTS = this._freezeableExts;

        return vow.when(borschikProcessor.process(
                getTargetAbsPath(this._source),
                getTargetAbsPath(this._target),
                this._freeze,
                this._minify,
                this._tech,
                this._techOptions))
            .then(function() { borschikProcessor.dispose(); });
    })
    .createTech();
