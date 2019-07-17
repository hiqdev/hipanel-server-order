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
    if (window.hipanel_server_order.pathToIcons != null) {
        pathToIcons = window.hipanel_server_order.pathToIcons;
    }
    const href = `${pathToIcons}icons.svg#${id}`;
    return (
        <Wrapper viewBox="0 0 24 24">
            <use xlinkHref={href}></use>
        </Wrapper>
    );
}
