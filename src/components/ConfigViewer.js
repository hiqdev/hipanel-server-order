import React from 'react'
import styled from 'styled-components'

const ConfigValue = styled.span`
  font-size: 18px;
  line-height: 27px;
  font-weight: 600;
  padding: 8px 0 10px 0;
`;

const ConfigLabel = styled(ConfigValue)`
  color: #bdbdbd;
  font-weight: 300 !important;
  padding-left: .5em;
`;

const ConfigItem = styled.li`
  line-height: 32px;
`;

export {
    ConfigValue,
    ConfigLabel,
    ConfigItem,
}
