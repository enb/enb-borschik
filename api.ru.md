API технологий
==============

Пакет предоставляет следующие технологии:

* [borschik](#borschik)
* [js-borschik-include](#js-borschik-include)

borschik
--------

Обрабатывает файл с помощью [borschik](https://ru.bem.info/tools/optimizers/borschik/).

Технология может использоваться для работы с CSS-, JavaScript-, JSON- и HTML-файлами. Основные возможности:

* обработка ссылок/путей;
* заморозка (freeze) ссылок/путей;
* минимизация кода.

Настройки описываются в конфигурационном файле `.borschik`. Файл должен располагаться в корне проекта.

**Опции**

* [source](#source)
* [target](#target)
* [dependantFiles](#dependantfiles)
* [minify](#minify)
* [freeze](#freeze)
* [comments](#comments)
* [tech](#tech)
* [techOptions](#techoptions)

### source

Тип: `String`. Обязательная опция.

Имя исходного файла, который будет обработан с помощью `borschik`.

### target

Тип: `String`. Обязательная опция.

Имя обработанного файла.

#### dependantFiles

Тип: `String[]` или `Object[]`. По умолчанию: `[]`.

Имена файлов, после сборки которых запустится обработка исходного файла с помощью `borschik`.

Опция ожидает массив объектов, где ключ это путь к ноде, а значение — массив файлов из указанной ноды.

```js
{
    dependantFiles: [{
        'path/to/index': ['index.css', 'index.js'],
        'path/to/keyboard': ['keyboard.css', 'keyboard.js']
    }]
}
```

Если переданы строки, то ожидается, что это имена таргетов текущей ноды:

```js
{
    dependantFiles: ['index.css', 'index.js']
}
```

#### minify

Тип: `Boolean`. По умолчанию: `true`.

Включает минимизацию при обработке исходного файла.

#### freeze

Тип: `Boolean`. По умолчанию: `true`.

Включает [freeze](https://ru.bem.info/tools/optimizers/borschik/freeze/) при обработке исходного файла.

#### comments

Тип: `Boolean`. По умолчанию: `true`.

Позволяет настраивать опцию `comments` пакета `borschik`, которая отвечает за поясняющие комментарии к склеенным файлам.

#### tech

Тип: `String`.

Имя технологии для обработки исходного файла. По умолчанию определяется по расширению файла.

#### techOptions

Тип: `Object`. По умолчанию: `{}`.

Параметры для обрабатывающей технологии. Возможные значения зависият от конкретной технологии.

--------------------------------------

**Пример**

```javascript
var BorschikTech = require('enb-borschik/techs/borschik'),
    FileProvideTech = require('enb/techs/file-provider');

module.exports = function(config) {
    /* Собираем CSS-файл в файл с расширением `.dev.css` */

    // В dev-режиме обрабатываем CSS-файл с помощью `borschik`
    config.mode('development', function () {
        config.node('bundle', function (node) {
            node.addTech([BorschikTech, {
                source: '?.dev.css',
                target: '?.css',
                minify: false
            }]);
        });
    });

    // В production-режиме обрабатываем CSS-файл с помощью `borschik`
    // и минимизируем его с помощью `cleancss`
    config.mode('production', function () {
        config.node('bundle', function (node) {
            node.addTech([BorschikTech, {
                source: '?.dev.css',
                target: '?.css',
                minify: true,
                tech: 'cleancss'
            }]);
        });
    });
};
```

js-borschik-include
-------------------

Собирает JS-файлы c помощью специальной нотации [borschik:include](https://ru.bem.info/tools/optimizers/borschik/js-include/).

Результат сборки — `?.js`-файл, который содержит подключения необходимых исходных JS-файлов.

**Важно:** После сборки необходимо обработать получившийся файл из специальных нотаций с помощью технологии [borschik](#borschik). Все вхождения `borschik:include` будут заменены на содержимое указанных файлов.

Технология необходима, если в исходных JS-файлах встречаются специальные нотации `borschik:include`. Все пути обрабатываются относительно того файла, в котором прописан `borschik:include`.

**Опции**

* [target](#target-1)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)

#### target

Тип: `String`. По умолчанию: `?.js`.

Имя файла, куда будет записан результат сборки необходимых JS-файлов проекта — скомпилированный файл `?.js`.

#### filesTarget

Тип: `String`. По умолчанию: `?.files`.

Имя таргета, откуда будет доступен список исходных файлов для сборки. Список файлов предоставляет технология [files](https://github.com/enb-bem/enb-bem-techs/blob/master/docs/api.ru.md#files) пакета [enb-bem-techs](https://github.com/enb-bem/enb-bem-techs/blob/master/README.md).

#### sourceSuffixes

Тип: `String | String[]`. По умолчанию: `['js']`.

Суффиксы файлов, по которым отбираются JS-файлы для дальнейшей сборки.

--------------------------------------
**Пример**

```javascript
var BorschikTech = require('enb-borschik/techs/borschik'),
    BorschikJsIncludeTech = require('enb-borschik/techs/js-borschik-include'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Получаем FileList
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, levels: ['blocks']],
            bemTechs.deps,
            bemTechs.files
        ]);

        node.addTechs([
            // Собираем JS-файл, состоящий из `borschik:include`
            [BorschikJsIncludeTech, { target: '?.pre.js' }],
            // Обрабатываем собранный JS-файл, раскрываем найденные `borschik:include`
            [BorschikTech, {
                target: '?.js',
                source: '?.pre.js'
            }]
        ]);
        node.addTarget('?.js');
    });
};
```
