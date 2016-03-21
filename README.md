enb-borschik
============

[![NPM version](http://img.shields.io/npm/v/enb-borschik.svg?style=flat)](https://www.npmjs.org/package/enb-borschik)
[![Build Status](http://img.shields.io/travis/enb/enb-borschik/master.svg?style=flat&label=tests)](https://travis-ci.org/enb/enb-borschik)
[![Coverage Status](https://img.shields.io/coveralls/enb/enb-borschik.svg?style=flat)](https://coveralls.io/r/enb/enb-borschik?branch=master)
[![devDependency Status](http://img.shields.io/david/enb/enb-borschik.svg?style=flat)](https://david-dm.org/enb/enb-borschik)

Пакет предоставляет набор [ENB](https://ru.bem.info/tools/bem/enb-bem/)-технологий для обработки файлов с помощью [borschik](https://ru.bem.info/tools/optimizers/borschik/).

**Технологии пакета `enb-borschik`:**

* [borschik](api.ru.md#borschik)
* [js-borschik-include](api.ru.md#js-borschik-include)

Принципы работы технологий и их API описаны в документе [API технологий](api.ru.md).

**Совместимость:** технологии пакета `enb-borschik` поддерживают версию `borschik`'а `1.4.1`.

Документация
------------

* [`borschik` и технологии](https://ru.bem.info/tools/optimizers/borschik/where-is-my-tech/)
* [Заморозка (freeze) статических ресурсов](https://ru.bem.info/tools/optimizers/borschik/freeze/)
* [Нотация для JS include](https://ru.bem.info/tools/optimizers/borschik/js-include/)

Как начать использовать?
------------------------

Установите пакет `enb-borschik`:

```sh
$ npm install --save-dev enb-borschik
```

**Требования:** зависимость от пакета `enb` версии `0.16.0` или выше.

Для обработки файлов используйте технологию [borschik](api.ru.md#borschik).

При необходимости собирать JS-файлы со специальными нотациями `borschik:include`, используйте технологию [js-borschik-include](api.ru.md#js-borschik-include).

Лицензия
--------

© 2014 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
