import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  width: 24px;
  height: 24px;
  fill: #bdbdbd;
  vertical-align: top;
  margin-right: 9px;
`;

export default function Icon({id}) {
    let pathToIcons = '';
    if (window.hipanel_order_server_path_to_icons) {
        pathToIcons = window.hipanel_order_server_path_to_icons;
    }
    const href = `${pathToIcons}icons.svg#${id}`;
    return (
        <Wrapper viewBox="0 0 24 24">
            <use xlinkHref={href}></use>
        </Wrapper>
    );
}
