# HiPanel Server Order

[![Latest Stable Version](https://poser.pugx.org/hiqdev/hipanel-server-order/v/stable)](https://packagist.org/packages/hiqdev/hipanel-server-order)
[![Total Downloads](https://poser.pugx.org/hiqdev/hipanel-server-order/downloads)](https://packagist.org/packages/hiqdev/hipanel-server-order)
[![Build Status](https://img.shields.io/travis/hiqdev/hipanel-server-order.svg)](https://travis-ci.org/hiqdev/hipanel-server-order)
[![Scrutinizer Code Coverage](https://img.shields.io/scrutinizer/coverage/g/hiqdev/hipanel-server-order.svg)](https://scrutinizer-ci.com/g/hiqdev/hipanel-server-order/)
[![Scrutinizer Code Quality](https://img.shields.io/scrutinizer/g/hiqdev/hipanel-server-order.svg)](https://scrutinizer-ci.com/g/hiqdev/hipanel-server-order/)

**Интеграция пакета**

1. В месте, где нужно чтобы появился плагин, разместить элемент `<div id="server-order-app"></div>`
2. Перед закрытием тега `<head>`, вставить всё что написано в файле `dist/index.html`
3. Сделать запросы на получение доступных конфигураций `https://hiapi.advancedhosting.com/configsGetAvailable?with_prices=1&seller=dsr`
4. Сделать запросы на получение доступных образов `https://hiapi.advancedhosting.com/osimagesSearch?type=dedicated&seller=dsr`
5. Сгруппировать полученные конфиги по полю `location`
6. Поместить `dist/*.svg` в доступную для для веб сервера дирикторию, так что бы он был доступен от корня  `https://[your_domain_name]/*.svg` или создать переменную глобальной области видимости `window.hipanel_server_order.pathToIcons` и записать туда путь к `*.svg`
7. Создать в глобальной области видимости переменную `window.hipanel_server_order`. В созданную переменную нужно поместить объект с настройками для плагина такой структуры:
8. Для того что бы изменить локацию, нужно вызвать функцию `hipanel_server_order_app.setLocation('nl')`, передав ей строкой одно из двух значений: `nl` или `us`

```javascript
window.hipanel_server_order = {
    initialStates: {
        action: 'https://hipanel.advancedhosting.com/server/order/add-to-cart-dedicated', // действие формы для заказа
        location: 'us', // локация по умолчанию, доступные варианты: 'us', 'nl'
        language: 'en', // язык по умолчанию, доступные варианты: 'ru', 'en'
    },
    configs: {
        /* список конфигураций полученный из `/configsGetAvailable`, сгруппированных по локации, пример в `src/index.js:17` */
    },
    osImages: [
        /* массив доступных образов из `/osimagesSearch`, передать без модификации */
    ],
    pathToIcons: null, // путь к файлам `*.svg` из папки `dist`, если `null` то искать в корне, на пример `https://[your_domain_name]/*.svg`
};
```

**Пример на PHP**

1. cp src/example.php dist/
2. php -S localhost:8000 -t dist
3. http://localhost:8000/example.php
