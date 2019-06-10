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
//         language: 'en',
//     },
//     token: {
//         name: '_csrf',
//         value: '123',
//     },
//     configs: {
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
//     osImages: {
//         ubuntu_1810_clean: {
//             name: "ubuntu_1810_clean",
//             title: "Ubuntu 18.10 Clean installation (demo)",
//             os: "Ubuntu",
//             version: 18.1,
//             panel: null,
//             deprecated: false,
//             softpack: null,
//             osimage: "ubuntu_1810_clean"
//         },
//         ubuntu_1804_lemp: {
//             name: "ubuntu_1804_lemp",
//             title: "Ubuntu 18.04 LTS x64 with LEMP stack (demo)",
//             os: "Ubuntu",
//             version: "18.04 LTS",
//             panel: null,
//             deprecated: false,
//             softpack: {
//                 name: "lemp",
//                 panel: null,
//                 packages: [
//                     {
//                         name: "Nginx",
//                         version: "1.15.0"
//                     },
//                     {
//                         name: "MySQL",
//                         version: 8
//                     },
//                     {
//                         name: "PHP-FPM",
//                         version: "7.3.0"
//                     }
//                 ]
//             },
//             osimage: "ubuntu_1804_lemp"
//         },
//         centos_7_clean: {
//             name: "centos_7_clean",
//             title: "CentOS 7 (demo)",
//             os: "CentOS",
//             version: 7,
//             panel: null,
//             deprecated: false,
//             softpack: null,
//             osimage: "centos_7_clean"
//         },
//         freebsd_11_lamp: {
//             name: "freebsd_11_lamp",
//             title: "FreeBSD 11 LEMP stack (demo)",
//             os: "FreeBSD",
//             version: 11,
//             panel: null,
//             deprecated: false,
//             softpack: {
//                 name: "lamp",
//                 panel: "HiPanel",
//                 packages: [
//                     {
//                         name: "Apache",
//                         version: 2.2
//                     },
//                     {
//                         name: "MySQL",
//                         version: 8
//                     },
//                     {
//                         name: "PHP-FPM",
//                         version: "7.3.0"
//                     }
//                 ]
//             },
//             osimage: "freebsd_11_lamp"
//         },
//         windows_10_clean: {
//             name: "windows_10_clean",
//             title: "Windows 10 (demo)",
//             os: "Windows",
//             version: 10.1,
//             panel: null,
//             deprecated: false,
//             softpack: null,
//             osimage: "windows_10_clean"
//         },
//         centos_6_lamp: {
//             name: "centos_6_lamp",
//             title: "CentOS 6 x64 with LAMP stack (demo)",
//             os: "CentOS",
//             version: 6,
//             panel: null,
//             deprecated: true,
//             softpack: {
//                 name: "lamp",
//                 panel: null,
//                 packages: [
//                     {
//                         name: "Apache",
//                         version: "2.0.1"
//                     },
//                     {
//                         name: "MySQL",
//                         version: 5.5
//                     },
//                     {
//                         name: "PHP-FPM",
//                         version: "5.6.0"
//                     }
//                 ]
//             },
//             osimage: "centos_6_lamp"
//         }
//     }
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
        'software': 'Программное обеспечение'
    }
};

render(
    <IntlProvider locale={window.hipanel_order_server.initialStates.language}
                  messages={messages[window.hipanel_order_server.initialStates.language]}>
        <App {...window.hipanel_order_server}/>
    </IntlProvider>,
    document.querySelector('#server-order-app')
);