# HiPanel Server Order

[![Latest Stable Version](https://poser.pugx.org/hiqdev/hipanel-server-order/v/stable)](https://packagist.org/packages/hiqdev/hipanel-server-order)
[![Total Downloads](https://poser.pugx.org/hiqdev/hipanel-server-order/downloads)](https://packagist.org/packages/hiqdev/hipanel-server-order)
[![Build Status](https://img.shields.io/travis/hiqdev/hipanel-server-order.svg)](https://travis-ci.org/hiqdev/hipanel-server-order)
[![Scrutinizer Code Coverage](https://img.shields.io/scrutinizer/coverage/g/hiqdev/hipanel-server-order.svg)](https://scrutinizer-ci.com/g/hiqdev/hipanel-server-order/)
[![Scrutinizer Code Quality](https://img.shields.io/scrutinizer/g/hiqdev/hipanel-server-order.svg)](https://scrutinizer-ci.com/g/hiqdev/hipanel-server-order/)

**Интеграция пакета**

1. Подключить Bootstrap ^3.4
2. Подключить шрифты в секции `<head>`: `<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap&subset=cyrillic" rel="stylesheet">`
3. В месте, где нужно чтобы появился плагин, разместить элемент `<div id="server-order-app"></div>`
4. Перед закрытием тега `<head>`, вставить всё что написано в файле `dist/index.html`
5. Сделать запросы на получение доступных конфигураций `/configsGetAvailable?0=and&1%5Bseller%5D=dsr&2%5Bwith_prices%5D=1&select%5B%2A%5D=%2A&select%5Bprices%5D=prices&with_prices=1&seller=dsr`
6. Сделать запросы на получение доступных образов `/osimagesSearch?type=dedicated&type=dedicated&seller=dsr`
7. Для получения данных и последующий передачи их в плагин выбора и заказа конфигурации, нужно создать глобальную переменную `window.hipanel_order_server`
8. В созданную переменную нужно поместить объект с настройками для плагина такой структуры:
```javascript
window.hipanel_order_server = {
    initialStates: {
        action: '/server/order/add-to-cart-dedicated', // действие формы для заказа
        location: 'us', // локация по умолчанию, доступные варианты: 'us', 'nl'
        language: 'en', // язык по умолчанию, доступные варианты: 'ru', 'en'
    },
    token: {
        /* Настройки сгруппированных по */
        name: '_csrf',
        value: '123',
    },
    configs: {
        /* список конфигураций полученный из `/configsGetAvailable`, сгруппированных по локациям */
    },
    osImages: [
        /* массив доступных образов передать без модификации */
    ],
};
```
