enb-borschik [![Build Status](https://travis-ci.org/enb-make/enb-borschik.png?branch=master)](https://travis-ci.org/enb-make/enb-borschik)
==========

Предоставляет технологии `borschik`, `css-borschik-chunks` и `js-borschik-include`.

borschik
========

Обрабатывает файл Борщиком (раскрытие borschik-ссылок, минификация, фризинг).

Настройки фризинга и путей описываются в конфиге Борщика (`.borschik`) в корне проекта
(https://github.com/bem/borschik/blob/master/README.md).

**Опции**

* *String* **sourceTarget** — Исходный таргет. Например, `?.js`. Обязательная опция.
* *String* **destTarget** — Результирующий таргет. Например, `_?.js`. Обязательная опция.
* *Boolean* **minify** — Минифицировать ли в процессе обработки. По умолчанию — `true`.
* *Boolean* **freeze** — Использовать ли фризинг в процессе обработки. По умолчанию — `false`.
* *String* **tech** — Технология сборки. По умолчанию — соответствует расширению исходного таргета.
* *Object* **techOptions** — Параметры для технологии сборки. Возможные значения зависият от конкретной технологии.

**Пример**

```javascript
nodeConfig.addTech([ require('enb-borschik/techs/borschik'), {
  sourceTarget: '?.css',
  destTarget: '_?.css',
  minify: true,
  freeze: true,
  tech: 'css+'
} ]);
```

css-borschik-chunks
===================

Из *css*-файлов по deps'ам, собирает `css-chunks.js`-файл, обрабатывая инклуды, ссылки.
Умеет минифицировать и фризить.

`css-chunks.js`-файлы нужны для создания bembundle-файлов или bembundle-страниц.

Технология bembundle активно используется в bem-tools для выделения
из проекта догружаемых кусков функционала и стилей (js/css).

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию `?.css-chunks.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
  (его предоставляет технология `files`). По умолчанию — `?.files`.
* *Boolean* **minify** — Минифицировать ли в процессе обработки. По умолчанию — `true`.
* *Boolean* **freeze** — Использовать ли фризинг в процессе обработки. По умолчанию — `false`.
* *String* **tech** — Технология сборки. По умолчанию — соответствует расширению исходного таргета.

**Пример**

```javascript
nodeConfig.addTech([ require('enb-borschik/techs/css-borschik-chunks'), {
  minify: true,
  freeze: true
} ]);
```

js-borschik-include
===================

Собирает *js*-файлы инклудами борщика, сохраняет в виде `?.js`.
Технология нужна, если в исходных *js*-файлах используются инклуды борщика.

В последствии, получившийся файл `?.js` следует раскрывать с помощью технологии `borschik`.

**Опции**

* *String* **target** — Результирующий таргет. Обязательная опция.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String[]* **sourceSuffixes** — суффиксы файлов, по которым строится files-таргет. По умолчанию — ['js'].

**Пример**

```javascript
nodeConfig.addTechs([
  [ require('enb-borschik/techs/js-borschik-include') ],
  [ require('enb-borschik/techs/borschik'), {
      source: '?.js',
      target: '_?.js'
  } ]);
]);
```
