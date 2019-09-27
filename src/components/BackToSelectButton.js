import React from 'react'
import styled from 'styled-components'
import {FormattedMessage} from 'react-intl'

const StyledButton = styled.button.attrs(props => ({className: 'btn btn-link', 'type': 'button'}))`
  color: #8492A5;
  
  &:hover {
      color: #8492A5;
  }
`;

const BackToSelectButton = props => {
    const handleChange = evt => {
        evt.preventDefault();
        props.onBack(props.currentLocation);
    };

    return (<StyledButton onClick={handleChange}><FormattedMessage id='back_to_select'/></StyledButton>);
};

export default BackToSelectButton;
