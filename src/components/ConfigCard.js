import React, {Fragment} from 'react'
import styled from 'styled-components'
import {FormattedMessage} from 'react-intl'
import SoftwareDescriber from './SoftwareDesriber'
import SelectedOption from './SelectedOption'
import {ConfigLabel, ConfigItem, ConfigValue} from './ConfigViewer'
import Icon from './Icon'

const SelectButton = styled.button`
  height: 63px;
  font-size: 22px;
  line-height: 43px;
  color: white;
  background-color: #4db6ac;
  border-color: #4db6ac;
  
  &:hover, &:focus, &:active {
    outline: none;
    color: white;
    background-color: #61cbc1;
    border-color: #61cbc1;
  }
`;

const ConfigSubname = styled.div`
  margin-top: -2px;
  color: #bdbdbd;
  font-weight: 300;
  padding: 7px 0 11px 0;
  font-size: 18px;
  line-height: 27px;
`;

const ConfigDescription = styled.p`
  margin-top: -2px;
  font-weight: 300;
  padding: 7px 0 11px 0;
  font-size: 18px;
  line-height: 27px;
`;

const PriceWrapper = styled.span`
  color: #38474e;
  font-size: 22px;
`;

const OldPriceWrapper = styled(PriceWrapper)`
  text-decoration: line-through;
  color: #bdbdbd;
`;

const OrderButton = styled(SelectButton)`
  line-height: 28px;
  height: 63px;
  background-color: #ff5252;
  border-color: #ff5252;
  
  &:hover, &:focus, &:active {
    outline: none;
    color: white;
    background-color: #ff6e67;
    border-color: #ff6e67;
  }
`;

const ConfigCardWrapper = styled.div`
  padding: 14px 18px 18px;
  background: white;
  box-shadow: 0 1px 1.92px 1.08px rgba(0, 0, 0, 0.04), 0 4px 6px 0 rgba(0, 0, 0, 0.01), 0 2px 8px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 2px;
  box-sizing: border-box;
  vertical-align: top;
  margin-bottom: 18px;
  
  & > .panel-heading {
    font-size: 22px;
    line-height: 27px;
    font-weight: 400;
    border: none;
    background-color: white;
  }
  
  & > .panel-footer {
    border: none;
    background-color: white;
  }
`;

const stringifyConfiguration = config => {
    const cpu = config.cpu ? (<ConfigItem><Icon
            id='cpu'/><ConfigValue>{config.cpu}</ConfigValue><ConfigLabel>CPU</ConfigLabel></ConfigItem>) : '',
        ram = config.ram ? (<ConfigItem><Icon
            id='memory'/><ConfigValue>{config.ram}</ConfigValue><ConfigLabel>DDR4</ConfigLabel></ConfigItem>) : '',
        ssd = config.ssd ? (<ConfigItem><Icon
            id='memory'/><ConfigValue>{config.ssd}</ConfigValue><ConfigLabel>SSD</ConfigLabel></ConfigItem>) : '',
        hdd = config.hdd ? (<ConfigItem><Icon
            id='ssd'/><ConfigValue>{config.hdd}</ConfigValue><ConfigLabel>HDD</ConfigLabel></ConfigItem>) : '';
    return (
        <Fragment>
            {cpu}
            {ram}
            {ssd}
            {hdd}
        </Fragment>
    );
};

export default function ConfigCard(props) {
    const handleSelect = evt => {
        props.onSelectConfig(evt.currentTarget.dataset.configId);
    };
    let isSideBar = false, price = null, oldPrice = null, label = null;
    if (props.isSideBar) {
        isSideBar = true;
        price = props.total.toLocaleString(props.language, {style: 'currency', currency: props.config.currency});
        label = props.label;
    } else {
        price = props.config.price.toLocaleString(props.language, {style: 'currency', currency: props.config.currency});
        if (props.config[props.location + '_old_price']) {
            oldPrice = parseFloat(props.config[props.location + '_old_price']);
        }
    }
    const isOrderButtonActive = (props.os && props.administration && props.softpack && props.osImage);

    return (
        <ConfigCardWrapper className="panel panel-default">
            <div className="panel-heading">
                {props.config.name}
                <ConfigSubname>{props.config.label}</ConfigSubname>
                {(isSideBar) ? (<ConfigDescription>{props.config.descr}</ConfigDescription>) : ''}
            </div>
            <div className="panel-body">
                <ul className="list-unstyled">
                    {(label) ? (<ConfigItem><Icon id='info'/><ConfigValue>{label}</ConfigValue><ConfigLabel><FormattedMessage id='label' defaultMessage="Label"/></ConfigLabel></ConfigItem>) : ''}
                    {stringifyConfiguration(props.config)}
                    <SelectedOption options={props.osOptions} input={props.os} label='os'/>
                    <SelectedOption options={props.administrationOptions} input={props.administration}
                                    label='administration'/>
                    <SelectedOption options={props.softpackOptions} input={props.softpack} label='softpack'/>
                    <SoftwareDescriber osImage={props.osImage}/>
                </ul>
                <hr/>
                <div className="text-center">
                    {isSideBar ? (
                        <PriceWrapper>
                            <FormattedMessage id='per_month' defaultMessage="{price}/month" values={{price}}/>
                        </PriceWrapper>
                    ) : (
                        <PriceWrapper>
                            <FormattedMessage id='from_month' defaultMessage="From {oldPrice} {price}/month" values={{
                                oldPrice: <OldPriceWrapper>{oldPrice}</OldPriceWrapper>,
                                price
                            }}/>
                        </PriceWrapper>
                    )}
                </div>
            </div>
            <div className="panel-footer">
                {isSideBar ? (
                    <OrderButton type="submit" className="btn btn-block" disabled={!isOrderButtonActive}>
                        <FormattedMessage id='order'/>
                    </OrderButton>
                ) : (
                    <SelectButton type="button" className="btn btn-block"
                                  data-config-id={props.config.id}
                                  onClick={handleSelect}><FormattedMessage id='select'/></SelectButton>
                )}
            </div>
        </ConfigCardWrapper>
    );
}
