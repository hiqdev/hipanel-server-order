import React from 'react'
import {FormattedMessage} from 'react-intl'
import {ConfigLabel, ConfigItem, ConfigValue} from './ConfigViewer'


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
            <ConfigItem>
                <ConfigValue><FormattedMessage id={item.name} defaultMessage={item.name}/> </ConfigValue>
                <ConfigLabel><FormattedMessage id={label} defaultMessage={capitalize(label)}/></ConfigLabel>
            </ConfigItem>
        );
    }

    return null;
}
