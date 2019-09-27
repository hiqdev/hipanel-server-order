import React from 'react'
import {render} from 'react-dom'
import {addLocaleData, IntlProvider} from 'react-intl';
import ru from 'react-intl/locale-data/ru';
import en from 'react-intl/locale-data/en';
import ServerOrder from './ServerOrder'

addLocaleData([...en, ...ru]);

if (!window.hipanel_server_order) {
    window.hipanel_server_order = {
        initialStates: {
            action: '/server/order/add-to-cart-dedicated',
            location: 'us',
            language: 'en',
        },
        pathToIcons: null,
        configs: {
            nl: [
                {
                    id: 1,
                    name: 'Single Start',
                    label: 'SUPERMICRO 1U',
                    descr: 'The Test Config Description',
                    price: 187,
                    currency: 'EUR',
                    nl_tariff_id: '123',
                    us_tariff_id: '321',
                    cpu: "1 x W-2123",
                    ssd: "2 x 2 TB",
                    ram: '16 GB',
                    traffic: '150',
                    monthly_support_time: "0.07",
                    nl_old_price: "17.55",
                    us_old_price: "12.33",
                    profiles: ['“Profi plus” servers'],
                },
            ],
            us: [
                {
                    id: 2,
                    name: 'Single Business',
                    label: 'SUPERMICRO 1U',
                    descr: 'The Test Config Description',
                    price: 175,
                    currency: 'USD',
                    nl_tariff_id: '123',
                    us_tariff_id: '321',
                    cpu: '1 х W-2125 CPU',
                    hdd: '2 х 2 TB',
                    ram: '100',
                    traffic: '150',
                    monthly_support_time: 1.7,
                    nl_old_price: "11.14",
                    profiles: ['“Big data” servers'],
                    us_old_price: "0.83"
                },
                {
                    id: 3,
                    name: 'Single Advanced',
                    label: 'SUPERMICRO 1U',
                    descr: 'The Test Config Description',
                    price: 202,
                    currency: 'USD',
                    nl_tariff_id: '123',
                    us_tariff_id: '321',
                    cpu: '1 х W-2133 CPU',
                    hdd: '2 х 2 TB',
                    ram: '64 GB DDR4',
                    traffic: '150',
                    profiles: ['“Profi plus” servers'],
                    monthly_support_time: 0.7,
                },
                {
                    id: 4,
                    name: 'Single Start 2',
                    label: 'SUPERMICRO 1U',
                    descr: 'The Test Config Description',
                    price: 155,
                    currency: 'USD',
                    nl_tariff_id: '123',
                    us_tariff_id: '321',
                    cpu: '1 х W-2123',
                    ssd: '2 х 240 ГБ',
                    ram: '16 ГБ DDR4',
                    traffic: '150',
                    profiles: ['“Profi plus” servers'],
                    monthly_support_time: 100,
                },
                {
                    id: 5,
                    name: 'Single Business',
                    label: 'SUPERMICRO 1U',
                    descr: 'The Test Config Description',
                    price: 175,
                    currency: 'USD',
                    nl_tariff_id: '123',
                    us_tariff_id: '321',
                    cpu: '1 х W-2125 CPU',
                    hdd: '2 х 2 TB',
                    ram: '2 x 2 TB',
                    traffic: '55',
                    monthly_support_time: 1.7,
                    profiles: ['“Big data” servers'],
                    nl_old_price: "11.14",
                    us_old_price: "1.31"
                },
                {
                    id: 6,
                    name: 'Single Advanced',
                    label: 'SUPERMICRO 1U',
                    descr: 'The Test Config Description',
                    price: 202,
                    currency: 'USD',
                    nl_tariff_id: '123',
                    us_tariff_id: '321',
                    cpu: '1 х W-2133 CPU',
                    hdd: '2 х 2 TB',
                    ram: '64 GB DDR4',
                    traffic: '55',
                    monthly_support_time: 0.7,
                    profiles: ['“Big data” servers', '“Profi plus” servers'],
                },
                {
                    id: 7,
                    name: 'Single Start 2',
                    label: 'SUPERMICRO 1U',
                    descr: 'The Test Config Description',
                    price: 155,
                    currency: 'USD',
                    nl_tariff_id: '123',
                    us_tariff_id: '321',
                    cpu: '1 х W-2123',
                    hdd: '2 х 240 ГБ SSD',
                    ram: '16 ГБ DDR4',
                    traffic: '50',
                    monthly_support_time: 100,
                    profiles: ['“Big data” servers', '“Profi plus” servers'],
                },
            ],
        },
        osImages: [
            {
                name: "freebsd_11_clear",
                title: "Clear FreeBSD 11 LEMP (demo)",
                os: "FreeBSD",
                version: 11,
                panel: null,
                deprecated: false,
                softpack: null,
                osimage: "freebsd_11_clear"
            },
            {
                name: "ubuntu_1810_clean",
                title: "Ubuntu 18.10 Clean installation (demo)",
                os: "Ubuntu",
                version: 18.1,
                panel: null,
                deprecated: false,
                softpack: null,
                osimage: "ubuntu_1810_clean"
            },
            {
                name: "ubuntu_1804_lemp",
                title: "Ubuntu 18.04 LTS x64 with LEMP stack (demo)",
                os: "Ubuntu",
                version: "18.04 LTS",
                panel: null,
                deprecated: false,
                softpack: {
                    name: "lemp",
                    panel: null,
                    packages: [
                        {
                            name: "Nginx",
                            version: "1.15.0"
                        },
                        {
                            name: "MySQL",
                            version: 8
                        },
                        {
                            name: "PHP-FPM",
                            version: "7.3.0"
                        }
                    ]
                },
                osimage: "ubuntu_1804_lemp"
            },
            {
                name: "centos_7_clean",
                title: "CentOS 7 (demo)",
                os: "CentOS",
                version: 7,
                panel: null,
                deprecated: false,
                softpack: null,
                osimage: "centos_7_clean"
            },
            {
                name: "ubuntu_1804_lemp_hipanel",
                title: "Ubuntu 18.04 LTS x64 with LEMP stack and HiPanel (demo)",
                os: "Ubuntu",
                version: "18.04 LTS",
                panel: null,
                deprecated: false,
                softpack: {
                    name: "lemp",
                    panel: "HiPanel",
                    packages: [
                        {
                            name: "Nginx",
                            version: "1.15.1"
                        },
                        {
                            name: "MySQL",
                            version: "8.0.2"
                        },
                        {
                            name: "PHP-FPM",
                            version: "7.3.2"
                        }
                    ]
                },
                osimage: "ubuntu_1804_lemp_hipanel"
            },
            {
                name: "freebsd_11_lamp",
                title: "FreeBSD 11 LEMP stack (demo)",
                os: "FreeBSD",
                version: 11,
                panel: null,
                deprecated: false,
                softpack: {
                    name: "lamp",
                    panel: "HiPanel",
                    packages: [
                        {
                            name: "Apache",
                            version: 2.2
                        },
                        {
                            name: "MySQL",
                            version: 8
                        },
                        {
                            name: "PHP-FPM",
                            version: "7.3.0"
                        }
                    ]
                },
                osimage: "freebsd_11_lamp"
            },
            {
                name: "ubuntu_1804_clean",
                title: "Ubuntu 18.04 LTS x64",
                os: "Ubuntu",
                version: "18.04 LTS",
                panel: null,
                deprecated: false,
                softpack: null,
                osimage: "ubuntu_1804_clean"
            },
            {
                name: "windows_10_clean",
                title: "Windows 10 (demo)",
                os: "Windows",
                version: 10.1,
                panel: null,
                deprecated: false,
                softpack: null,
                osimage: "windows_10_clean"
            },
            {
                name: "centos_6_lamp",
                title: "CentOS 6 x64 with LAMP stack (demo)",
                os: "CentOS",
                version: 6,
                panel: null,
                deprecated: true,
                softpack: {
                    name: "lamp",
                    panel: null,
                    packages: [
                        {
                            name: "Apache",
                            version: "2.0.1"
                        },
                        {
                            name: "MySQL",
                            version: 5.5
                        },
                        {
                            name: "PHP-FPM",
                            version: "5.6.0"
                        }
                    ]
                },
                osimage: "centos_6_lamp"
            },
            {
                name: "ubuntu_1804_lamp_hipanel",
                title: "Ubuntu 18.04 LTS x64 with LAMP stack and HiPanel (demo)",
                os: "Ubuntu",
                version: "18.04 LTS",
                panel: null,
                deprecated: false,
                softpack: {
                    name: "lamp",
                    panel: "HiPanel",
                    packages: [
                        {
                            name: "Apache",
                            version: "2.2.2"
                        },
                        {
                            name: "MySQL",
                            version: "8.0.1"
                        },
                        {
                            name: "PHP-FPM",
                            version: "7.3.2"
                        }
                    ]
                },
                osimage: "ubuntu_1804_lamp_hipanel"
            },
            {
                name: "ubuntu_1804_lamp",
                title: "Ubuntu 18.04 LTS x64 with LAMP stack (demo)",
                os: "Ubuntu",
                version: "18.04 LTS",
                panel: null,
                deprecated: false,
                softpack: {
                    name: "lamp",
                    panel: null,
                    packages: [
                        {
                            name: "Apache",
                            version: 2.2
                        },
                        {
                            name: "MySQL",
                            version: 8
                        },
                        {
                            name: "PHP-FPM",
                            version: "7.3.1"
                        }
                    ]
                },
                osimage: "ubuntu_1804_lamp"
            }
        ]
    };
}

const messages = {
    'en': {
        'text.header': 'Make your server even more powerful',
        'text.paragraph': 'Select the technical details and the type of maintenance of your dedicated server. ' +
            'Immediately after placing the order, we will contact you to confirm it and connect your project to the service.',
        'os': 'Operating system',
        'administration': 'Administration',
        'softpack': 'Soft',
        'select_location': 'Select location',
        'no_configurations': 'No configurations found',
        'managed': 'Expert service 24/7',
        'unmanaged': 'Basic maintenance',
        'select': ' Select',
        'order': 'Order',
        'featured_dedicated_servers': 'Select a server location region',
        'configuration_setting': 'Make your server even more powerful',
        'configuration_desc': 'Select the technical details and the type of maintenance of your dedicated server. Immediately after placing the order, we will contact you to confirm it and connect your project to the service.',
        'server_label': "Server label",
        'dedicated_server': 'Dedicated servers',
        'server_configuration': 'Server configuration',
        'checkout': 'Checkout',
        'mbps': 'Mbit/s',
        'per_month': '{currency}{price}/mo',
        'from_month': 'From {oldPrice} {price}/mo',
        'main_header': 'Pricing plans Dedicated servers',
        'back_to_select': 'Back to server selection',
    },
    'ru': {
        'dedicated_server': 'Выделенные серверы',
        'server_configuration': 'Настройка сервера',
        'checkout': 'Оформление заказа',
        'featured_dedicated_servers': 'Выберите регион расположения сервера',
        'configuration_setting': 'Сделайте ваш сервер еще мощнее',
        'text.header': 'Сделайте ваш сервер еще мощнее',
        'text.paragraph': 'Выберите технические детали и тип обслуживания выделенного сервера. ' +
            'Сразу после размещения заказа мы свяжемся с вами для подтверждения и подключения вашего проекта к услуге.',
        'nl': 'Нидерланды',
        'us': 'США',
        'server_label': "Заметка",
        'administration': 'Администрирование',
        'softpack': 'Софт',
        'os': 'Операционная система',
        'order': 'Заказать',
        'select': 'Выбрать',
        'select_location': 'Выбирите локацию',
        'no_configurations': 'Нет конфигураций',
        'software': 'Программное обеспечение',
        'no_softpack': 'отсутствует',
        'managed': 'Управляемое',
        'unmanaged': 'Неуправляемое',
        'per_month': '{currency}{price}/мес',
        'from_month': 'От {oldPrice} {price}/мес',
        'mbps': 'Мбит/с',
        'back_to_select': 'Вернутся к выбору сервера',
    }
};

render(
    <IntlProvider locale={window.hipanel_server_order.initialStates.language}
                  messages={messages[window.hipanel_server_order.initialStates.language]}>
        <ServerOrder {...window.hipanel_server_order}/>
    </IntlProvider>,
    document.querySelector('#server-order-app')
);