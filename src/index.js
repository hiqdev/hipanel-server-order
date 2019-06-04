import React from 'react'
import {render} from 'react-dom'
import {addLocaleData, IntlProvider} from 'react-intl';
import ru from 'react-intl/locale-data/ru';
import en from 'react-intl/locale-data/en';

addLocaleData([...en, ...ru]);

import App from './App'

const lng = 'ru';
const messages = {
    'ru': {
        'label': "Заметка",
        'netherlands': 'Нидерланды',
        'administration': 'Администрирование',
        'softpack': 'Софт',
        'os': 'ОС',
        'order': 'Заказать',
        'select': 'Выбрать',
        'usa': 'США',
        'select_locaction': 'Выбирите локацию',
    }
};

render(<IntlProvider locale={lng} messages={messages[lng]}>
    <App/></IntlProvider>, document.querySelector('#server-order-app'));