import React from 'react'
import styled from 'styled-components'

const ConfigValue = styled.span`
  font-size: 16px;
  line-height: 27px;
  font-weight: 600;
  padding: 8px 0 10px 0;
`;

const ConfigLabel = styled(ConfigValue)`
  color: #8492A5;
  font-weight: 300 !important;
  padding-left: .5em;
  font-size: 14px;
`;

const ConfigItem = styled.li.attrs(props => ({className: 'list-group-item'}))`
  text-align: center;
`;

export {
    ConfigValue,
    ConfigLabel,
    ConfigItem,
}
