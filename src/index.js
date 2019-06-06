import React from 'react'
import {render} from 'react-dom'
import {addLocaleData, IntlProvider} from 'react-intl';
import ru from 'react-intl/locale-data/ru';
import en from 'react-intl/locale-data/en';
import App from './App'

addLocaleData([...en, ...ru]);

// window.hipanel_order_server = {
//     initialStates: {
//         action: 'http://local.hipanel-demo.hipanel.com/server/order/add-to-cart-dedicated',
//         location: 'us',
//         language: 'ru',
//     },
//     configOptions: {
//         nl: [
//             {
//                 id: 1,
//                 name: 'Single Start',
//                 descr: '1 х W-2123 CPU / 16 GB DDR4 / 2 х 2 TB HDD',
//                 price: 127,
//                 currency: 'EUR',
//                 nl_tariff_id: '123',
//                 us_tariff_id: '321',
//             },
//         ],
//         us: [
//             {
//                 id: 2,
//                 name: 'Single Business',
//                 descr: '1 х W-2125 CPU / 32 GB DDR4 / 2 х 2 TB HDD',
//                 price: 175,
//                 currency: 'USD',
//                 nl_tariff_id: '123',
//                 us_tariff_id: '321',
//             },
//             {
//                 id: 3,
//                 name: 'Single Advanced',
//                 descr: '1 х W-2133 CPU / 64 GB DDR4 / 2 х 2 TB HDD',
//                 price: 202,
//                 currency: 'USD',
//                 nl_tariff_id: '123',
//                 us_tariff_id: '321',
//             },
//         ],
//     },
//     imageOptions: [
//         {
//             name: 'centos',
//             label: 'Centos zz.zz'
//         },
//         {
//             name: 'ubuntu',
//             label: 'Ubuntu vv.vv'
//         },
//     ],
//     administrationOptions: [
//         {
//             name: 'managed',
//             label: 'Managed'
//         },
//         {
//             name: 'unmanaged',
//             label: 'Unmanaged'
//         },
//     ],
//     softpackOptions: [
//         {
//             name: 'hipanel',
//             label: 'HiPanel (fully free)'
//         },
//         {
//             name: 'fresh',
//             label: 'Fresh (root)'
//         },
//         {
//             name: 'lamp',
//             label: 'LAMP (root)'
//         },
//         {
//             name: 'branini',
//             label: 'Braini CP (Fully free)'
//         },
//         {
//             name: 'cpanel',
//             label: 'cPanel (Trial)'
//         },
//         {
//             name: 'sipmanager',
//             label: ' ISPManager (Trial)'
//         },
//     ]
// };

const messages = {
    'en': {
        'text.header': 'Make your server even more powerful',
        'text.paragraph': 'Select the technical details and the type of maintenance of your dedicated server. ' +
            'Immediately after placing the order, we will contact you to confirm it and connect your project to the service.',
    },
    'ru': {
        'text.header': 'Сделайте ваш сервер еще мощнее',
        'text.paragraph': 'Выберите технические детали и тип обслуживания выделенного сервера. ' +
            'Сразу после размещения заказа мы свяжемся с вами для подтверждения и подключения вашего проекта к услуге.',

        'nl': 'Нидерланды',
        'us': 'США',
        'label': "Заметка",
        'administration': 'Администрирование',
        'softpack': 'Софт',
        'osimage': 'Образ',
        'order': 'Заказать',
        'select': 'Выбрать',
        'select_locaction': 'Выбирите локацию',
        'no_configurations': 'Нет конфигураций',
    }
};

render(
    <IntlProvider locale={window.hipanel_order_server.initialStates.language}
                  messages={messages[window.hipanel_order_server.initialStates.language]}>
        <App {...window.hipanel_order_server}/>
    </IntlProvider>,
    document.querySelector('#server-order-app')
);