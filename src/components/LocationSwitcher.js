import React from 'react'
import styled from 'styled-components'

const SwitchButtonWrapper = styled.div`
    & label {
        transition: background-position 0.2s ease-in;
        background: rgba(189, 189, 189, 0.3);
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        border-radius: 50px;
    }
    
    & label.active {
        top: 1px;
        left: 1px;
        transition: left 0.2s ease-out;
        border: none;
        border-radius: 50px;
        background-color: white;
        opacity: 1;
        padding: 0 34px;
        line-height: 45px;
        height: 45px;
    }
    
    & label:hover {
        background-color: white;
    }
`;

export default function LocationSwitcher(props) {
    const handleChange = evt => {
        props.onLocationChange(evt.currentTarget.dataset.location);
    };

    return (
        <SwitchButtonWrapper className="btn-group btn-group-justified">
            {props.locations.map((location, idx) => (
                <label className={"btn  " + (location.name === props.currentLocation ? 'active' : '')}
                       key={idx} data-location={location.name} onClick={handleChange}>
                    {location.label}
                </label>
            ))}
        </SwitchButtonWrapper>
    );
}
