import React, {useEffect} from 'react'
import {FormattedMessage} from 'react-intl'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding-bottom: 43px;
`;

const RadioLabel = styled.span`
  color: ${props => props.disabled ? "#bdbdbd" : "#38474e"};
`;

const RadioHeader = styled.label`
  display: block;
  border-bottom: 1px solid rgba(189, 189, 189, 0.3);
  margin-bottom: 11px;
  color: #bdbdbd;
  padding: 5px 0 12px 0;
  font-size: 22px;
  line-height: 27px;
  font-weight: 400;
`;

const RadioItem = styled.label`
  width: 100%;
  display: inline-block;
  height: 36px;
  font-size: 18px;
  line-height: 27px;
  font-weight: 600 !important;
  padding: 8px 0 5px !important;
  
  input[type="checkbox"], input[type="radio"] { display: none; }
  
  .check { top: 4px; margin-right: 19px; }
  
  input[type="radio"]:checked + .check {
    border-color: #ff5252; 
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.27); 
  }
  
  input[type="radio"] + .check {
    border: 2px solid #bdbdbd;
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50px;
    box-sizing: border-box;
    position: relative;
  }
  
  input[type="radio"]:checked + .check:before {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ff5252;
    position: absolute;
    top: 3px;
    left: 3px;
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
            return accumulator === null && !option.disabled
                ? option.name
                : accumulator;
        }, null);
        useEffect(() => {
            props.onInputChange(current);
        });
    }
    const options = props.options.map((option, idx) => (
        <div className={'radio radio-' + props.label + (option.disabled === true ? ' disabled' : '')} key={idx}>
            <RadioItem>
                <input type="radio" name={props.label.toLowerCase()} value={option.name} onChange={handleChange}
                       checked={current === option.name}
                       disabled={(option.disabled === true) ? 'disabled' : ''}/>
                <span className="check">&nbsp;</span>
                <RadioLabel disabled={option.disabled}>{option.title}</RadioLabel>
            </RadioItem>
        </div>
    ));

    return (
        <Wrapper className="form-group">
            <RadioHeader><FormattedMessage id={props.label}/></RadioHeader>
            {options}
        </Wrapper>
    );
}
