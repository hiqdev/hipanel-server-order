import React from 'react'
import styled from 'styled-components'
import {FormattedMessage} from 'react-intl'
import classnames from 'classnames'

const BreadcrumbsWrapper = styled.div`
  background: #37474f;
  height: 45px;
  width: 100%;
  line-height: 45px;
  
  a:hover, a:active, a:focus {
    text-decoration: none;
  }
  
  & > .container {
    position: relative;
    overflow: hidden;
  }
  
  span a, span.active {
    font-weight: 400 !important;
  }
  
  & span:first-child {
    z-index: 10 !important;
  }
  
  & span:first-child.active a {
    padding-left: 0;
  }
  
  & span:first-child a:hover {
    cursor: pointer;
  }
  
  span {
    z-index: 12;
    padding: 0;
    height: 45px;
    display: inline-block;
    position: relative;
  }
  
  span a, span.active {
    color: white;
    z-index: 1;
    line-height: 44px;
    display: inline-block;
    position: relative;
    padding: 0 18px;
    font-size: 16px;
  }
  
  & span.active:before {
    content: "";
    position: absolute;
    height: 45px;
    width: 1170px;
    right: 0;
    top: 0;
    background: #ff5252;
    z-index: -1;
  }
  
  & span.active.active:after {
    content: "";
    display: inline-block;
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    right: -10px;
    border-width: 23px 0 23px 10px;
    border-color: transparent transparent transparent #ff5252;
    top: 0;
  }
`;

const Breadcrumbs = props => {
    const handleChange = evt => {
        evt.preventDefault();
        props.onBack(props.currentLocation);
    };

    return (
        <BreadcrumbsWrapper className="breadcrumbs">
            <div className="container">
                <span className={classnames({active: props.configId === null})}><a onClick={handleChange}>1. <FormattedMessage id='dedicated_server'/></a></span>
                <span className={classnames({active: props.configId !== null})}><a>2. <FormattedMessage id='server_configuration'/></a></span>
                <span><a>3. <FormattedMessage id='checkout'/></a></span>
            </div>
        </BreadcrumbsWrapper>
    );
};

export default Breadcrumbs;
