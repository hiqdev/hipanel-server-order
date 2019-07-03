import React from 'react'
import {FormattedMessage} from 'react-intl'
import {ConfigLabel, ConfigItem, ConfigValue} from './ConfigViewer'

const describer = pack => {
    let title = '';
    if (!pack) {
        return null;
    }
    pack.packages.map(item => {
        title += `${item.name} ${item.version} + `;
    });

    return title.replace(new RegExp("[\\s+]*$"), '');
};

/**
 *
 * @param osImage
 * @returns {null|*}
 * @constructor
 */
export default function Software({osImage}) {
    if (osImage === null) {
        return null;
    }
    if (osImage.softpack === null) {
        return null;
    }
    const software = describer(osImage.softpack);

    return (
        <ConfigItem>
            <ConfigValue>{software}</ConfigValue><ConfigLabel><FormattedMessage id='software' defaultMessage="Software"/></ConfigLabel>
        </ConfigItem>
    );
}

