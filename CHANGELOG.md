История изменений
=================

2.0.0
-----

### Технологии

* [ __*major*__ ] Технология `css-borschik-chunks` была удалена ([#14], [#38]). Вместо нее следует использовать одноименную технологию из пакета `enb-bembundle`.

#### `borschik`

Технология [borschik](api.ru.md#borschik) была переписана с помощью `build-flow` ([#20]). Кроме того, произошли следующие изменения:

* [ __*major*__ ] [freeze](api.ru.md#freeze) включен по умолчанию и будет работать только при наличии конфигурационного файла `.borschik` ([#37]).
* Добавлена опция [dependantFiles](api.ru.md#dependantfiles) ([#24]). Она необходима для случаев, когда обрабатываемый файл зависит от других собираемых файлов (например, для обработки HTML-файла могут понадобиться CSS- и JS-файлы).
* Для ускорения сборки вместо модуля `sibling` используется [общая очередь дочерних процессов](https://github.com/enb-make/enb#nodegetsharedresources) ([#32]).

### Зависимости

* [ __*major*__ ] Модуль `borschik@1.3.2` обновлен до версии `1.4.1` и больше не является `peer`-зависимостью.
* [ __*major*__ ] Изменились требования к версии модуля `enb`. Теперь для корректной работы требуется `enb` версии `0.16.0` или выше.
* Модуль `vow@0.4.3` обновлен до версии `0.4.10`.
* Модуль `inherit@2.2.1` обновлен до версии `2.2.2`.

[#38]: https://github.com/enb-make/enb-borschik/issues/38
[#37]: https://github.com/enb-make/enb-borschik/issues/37
[#32]: https://github.com/enb-make/enb-borschik/pull/32
[#24]: https://github.com/enb-make/enb-borschik/issues/24
[#20]: https://github.com/enb-make/enb-borschik/issues/20
[#14]: https://github.com/enb-make/enb-borschik/issues/14
