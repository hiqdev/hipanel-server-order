import React from 'react'
import {FormattedMessage} from 'react-intl'

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
        <li>
            <b><FormattedMessage id='software' defaultMessage="Software"/>:</b> <span>{software}</span>
        </li>
    );
}

