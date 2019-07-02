import React from 'react'
import {FormattedMessage} from 'react-intl'
import styled from 'styled-components'

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * @param input
 * @param options
 * @param label
 * @returns {null|*}
 * @constructor
 */
export default function SelectedOption({input, options, label}) {
    if (input && options && label) {
        const item = options.find(item => item.name === input);
        if (!item) {
            return null
        }

        return (
            <li>
                <b><FormattedMessage id={label} defaultMessage={capitalize(label)}/>: </b> <span>{item.title}</span>
            </li>
        );
    }

    return null;
}
