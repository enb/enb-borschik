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
 *   tech: 'css+'
 * } ]);
 * ```
 */
var vow = require('vow');
var inherit = require('inherit');
var BorschikPreprocessor = require('../lib/borschik-preprocessor');

/**
 * @type {Tech}
 */
module.exports = inherit(require('enb/lib/tech/base-tech'), {
    getName: function () {
        return 'borschik';
    },

    configure: function () {
        this._source = this.getOption('sourceTarget');
        if (!this._source) {
            this._source = this.getRequiredOption('source');
        }
        this._target = this.getOption('destTarget');
        if (!this._target) {
            this._target = this.getRequiredOption('target');
        }
        this._freeze = this.getOption('freeze', false);
        this._minify = this.getOption('minify', true);
        this._noCache = this.getOption('noCache', false);
        this._tech = this.getOption('tech', null);
        this._techOptions = this.getOption('techOptions', null);
    },

    getTargets: function () {
        return [this.node.unmaskTargetName(this._target)];
    },

    build: function () {
        var target = this.node.unmaskTargetName(this._target);
        var targetPath = this.node.resolvePath(target);
        var source = this.node.unmaskTargetName(this._source);
        var sourcePath = this.node.resolvePath(source);
        var _this = this;
        var cache = this.node.getNodeCache(target);
        return this.node.requireSources([source]).then(function () {
            if (_this._noCache ||
                cache.needRebuildFile('source-file', sourcePath) ||
                cache.needRebuildFile('target-file', targetPath)
            ) {
                var borschikProcessor = BorschikProcessorSibling.fork();
                return vow.when(
                    borschikProcessor.process(
                        sourcePath,
                        targetPath,
                        _this._freeze,
                        _this._minify,
                        _this._tech,
                        _this._techOptions)
                ).then(function () {
                    cache.cacheFileInfo('source-file', sourcePath);
                    cache.cacheFileInfo('target-file', targetPath);
                    _this.node.resolveTarget(target);
                    borschikProcessor.dispose();
                });
            } else {
                _this.node.isValidTarget(target);
                _this.node.resolveTarget(target);
                return null;
            }
        });
    }
});

var BorschikProcessorSibling = require('sibling').declare({
    process: function (sourcePath, targetPath, freeze, minify, tech, techOptions) {
        return (new BorschikPreprocessor()).preprocessFile(sourcePath, targetPath, freeze, minify, tech, techOptions);
    }
});
