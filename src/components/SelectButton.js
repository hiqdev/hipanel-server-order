import styled from "styled-components";

const buttonColor = '#FC6D22';

const SelectButton = styled.button`
  height: 54px;
  line-height: 120%;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  color: white;
  border-color: ${buttonColor};
  background-color: ${buttonColor};
  border-radius: 4px;
  
  &:hover, &:focus, &:active {
    outline: none;
    color: white;
    background-color: ${buttonColor};
    border-color: ${buttonColor};
  }
`;

export default SelectButton;
