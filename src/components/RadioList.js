import React, {useEffect} from 'react'
import {FormattedMessage} from 'react-intl'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding-bottom: 43px;
`;

const RadioLabel = styled.span`
  color: ${props => props.disabled ? "#bdbdbd" : "#38474e"};
`;

const RadioHeader = styled.h5`
  display: block;
  margin-bottom: 11px;
  color: #2F3945;
  padding: 5px 0 5px 20px;
  font-size: 20px;
  line-height: 130%;
  font-weight: bold;
`;

const RadioListWrapper = styled.ul.attrs(props => ({className: 'list-group'}))`
    & > li {
      height: 50px;
    }
    
    & > li.disabled {
      background-color: white;
    }
    
    & > li:nth-of-type(odd) {
      background: #F9FAFC;
    }
`;

const RadioItem = styled.label`
  width: 100%;
  display: inline-block;
  height: 36px;
  font-size: 16px;
  line-height: 27px;
  font-weight: 600 !important;
  padding: 0 0 5px !important;
  
  input[type="checkbox"], input[type="radio"] { display: none; }
  
  .check { top: 4px; margin-right: 19px; }
  
  input[type="radio"]:checked + .check {
    border-color: #FC6D22; 
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.27); 
  }
  
  input[type="radio"] + .check {
    border: 1px solid #B0BBCB;
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50px;
    box-sizing: border-box;
    position: relative;
  }
  
  input[type="radio"]:checked + .check:after {
    position: absolute;
    top: 6px;
    left: 5px;
    content: " ";
    color: white;
    background-image: url('data:image/svg+xml; utf8, <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.7 0.3C7.3 -0.1 6.7 -0.1 6.3 0.3L3 3.6L1.7 2.3C1.3 1.9 0.7 1.9 0.3 2.3C-0.1 2.7 -0.1 3.3 0.3 3.7L2.3 5.7C2.5 5.9 2.8 6 3 6C3.2 6 3.5 5.9 3.7 5.7L7.7 1.7C8.1 1.3 8.1 0.7 7.7 0.3Z" fill="white"/>
</svg>
');
    width: 8px;
    height: 6px;
  }
  
  input[type="radio"]:checked + .check:before {
    content: "";
    color: white;
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #FC6D22;
    position: absolute;
    top: -1px;
    left: -1px;
  }
`;

/**
 *
 * @param current
 * @param props
 * @returns {*}
 * @constructor
 */
export default function RadioList({current, ...props}) {
    const handleChange = evt => {
        props.onInputChange(evt.target.value)
    };
    const isCurrentOptionDisabled = props.options.map((option) => {
        return option.disabled ? null : option.name
    }).indexOf(current) === -1;
    if (isCurrentOptionDisabled) {
        current = null;
    }
    if (current === null) {
        current = props.options.reduce((accumulator, option) => {
            return accumulator === null && !option.disabled || (!option.disabled && option.name === 'unmanaged')
                ? option.name
                : accumulator;
        }, null);
        useEffect(() => {
            props.onInputChange(current);
        });
    }
    const options = props.options.map((option, idx) => (
        <li className={'list-group-item radio radio-' + props.label + (option.disabled === true ? ' disabled' : '')}
            key={idx}>
            <RadioItem>
                <input type="radio" name={props.label.toLowerCase()} value={option.name} onChange={handleChange}
                       checked={current === option.name} //  || (props.label === 'administration' && option.name === 'unmanaged')
                       disabled={(option.disabled === true) ? 'disabled' : ''}/>
                <span className="check">&nbsp;</span>
                <RadioLabel disabled={option.disabled}>{option.title}</RadioLabel>
            </RadioItem>
        </li>
    ));

    return (
        <Wrapper className="form-group">
            <RadioHeader><FormattedMessage id={props.label}/></RadioHeader>
            <RadioListWrapper>{options}</RadioListWrapper>

        </Wrapper>
    );
}
