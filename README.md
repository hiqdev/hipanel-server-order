# HiPanel Server Order

[![Latest Stable Version](https://poser.pugx.org/hiqdev/hipanel-server-order/v/stable)](https://packagist.org/packages/hiqdev/hipanel-server-order)
[![Total Downloads](https://poser.pugx.org/hiqdev/hipanel-server-order/downloads)](https://packagist.org/packages/hiqdev/hipanel-server-order)
[![Build Status](https://img.shields.io/travis/hiqdev/hipanel-server-order.svg)](https://travis-ci.org/hiqdev/hipanel-server-order)
[![Scrutinizer Code Coverage](https://img.shields.io/scrutinizer/coverage/g/hiqdev/hipanel-server-order.svg)](https://scrutinizer-ci.com/g/hiqdev/hipanel-server-order/)
[![Scrutinizer Code Quality](https://img.shields.io/scrutinizer/g/hiqdev/hipanel-server-order.svg)](https://scrutinizer-ci.com/g/hiqdev/hipanel-server-order/)

**Интеграция пакета**

1. Подключить Bootstrap 3.4.1 и JQuery 2.2.*
2. Подключить шрифты в секции `<head>`: `<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap&subset=cyrillic" rel="stylesheet">`
3. В месте, где нужно чтобы появился плагин, разместить элемент `<div id="server-order-app"></div>`
4. Перед закрытием тега `<head>`, вставить всё что написано в файле `dist/index.html`
5. Сделать запросы на получение доступных конфигураций `https://[api_domain_name]/configsGetAvailable?with_prices=1&seller=dsr`
6. Сделать запросы на получение доступных образов `https://[api_domain_name]/osimagesSearch?type=dedicated&seller=dsr`
7. Сгруппировать полученные конфиги по полю `location`
8. Поместить `dist/icons.svg` в доступную для для веб сервера дирикторию, так что бы он был доступен от корня  `https://[your_domain_name]/icons.svg` или создать переменную глобальной области видимости `window.hipanel_server_order.pathToIcons` и записать туда путь к `icons.svg`
9. Создать в глобальной области видимости переменную `window.hipanel_server_order`. В созданную переменную нужно поместить объект с настройками для плагина такой структуры:
```javascript
window.hipanel_server_order = {
    initialStates: {
        action: 'https://[hipanel_domain_name]/server/order/add-to-cart-dedicated', // действие формы для заказа
        location: 'us', // локация по умолчанию, доступные варианты: 'us', 'nl'
        language: 'en', // язык по умолчанию, доступные варианты: 'ru', 'en'
    },
    configs: {
        /* список конфигураций полученный из `/configsGetAvailable`, сгруппированных по локации, пример в `src/index.js:17` */
    },
    osImages: [
        /* массив доступных образов из `/osimagesSearch`, передать без модификации */
    ],
    pathToIcons: null, // путь к файлу `icons.svg` если `null` то искать `https://[your_domain_name]/icons.svg`
};
```

**Пример на PHP**

1. cp src/example.php dist/
2. php -S localhost:8000 -t dist
3. http://localhost:8000/example.php
