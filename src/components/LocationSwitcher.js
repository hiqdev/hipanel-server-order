import React from 'react'
import styled from 'styled-components'

const SwitchButtonWrapper = styled.div`
  margin-top: 14px;
  background-color: rgba(189, 189, 189, 0.3);
  border-radius: 50px !important;
  height: 45px;
  padding-bottom: 2px;
  padding-right: 2px;
  
  & label {
    font-size: 18px;
    font-weight: 400;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    border-radius: 50px !important;
    height: 45px;
  }
  
  & label.active {
    top: 1px;
    left: 1px;
    border: none;
    border-radius: 50px;
    background-color: white;
    opacity: 1;
    padding: 0 34px;
    line-height: 45px;
  }
  
  .btn {
    box-shadow: none !important;
  }
`;

export default function LocationSwitcher(props) {
    const handleChange = evt => {
        props.onLocationChange(evt.currentTarget.dataset.location);
    };

    return (
        <SwitchButtonWrapper className="btn-group btn-group-justified">
            {props.locations.map((location, idx) => (
                <label className={"btn " + (location.name === props.currentLocation ? 'active' : '')}
                       key={idx} data-location={location.name} onClick={handleChange}>
                    {location.label}
                </label>
            ))}
        </SwitchButtonWrapper>
    );
}
