import React, {Fragment} from 'react'
import styled from 'styled-components'
import {FormattedMessage} from 'react-intl'
import SoftwareDescriber from './SoftwareDesriber'
import SelectedOption from './SelectedOption'
import {ConfigLabel, ConfigItem, ConfigValue} from './ConfigViewer'
import SelectButton from "./SelectButton";
// import Icon from './Icon'

const ConfigSubname = styled(ConfigItem)`
  margin-top: -2px;
  color: #bdbdbd;
  font-weight: 300;
  padding: 7px 0 11px 0;
  font-size: 18px;
  line-height: 27px;
`;

const ConfigDescription = styled(ConfigItem)`
  margin-top: -2px;
  font-weight: 300;
  padding: 7px 0 11px 0;
  font-size: 18px;
  line-height: 27px;
`;

const PriceWrapper = styled.span`
  font-size: 68px;
  letter-spacing: -2px;
`;

const OldPriceWrapper = styled.span`
  text-decoration: line-through;
  color: #bdbdbd;
`;


const LineWithPriceWrapper = styled.div`
  text-align: center;
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 130%;
  padding: 3rem 0;
`;

const RowWithButton = styled(ConfigItem)`
  padding: 20px!important;
`;

const ConfigCardWrapper = styled.div`
  box-shadow: 0px 4px 10px rgba(39, 52, 67, 0.04);
`;

const NoPadding = styled.div`padding: 0 0 36px 0;`;

const PanelHeaderWrapper = styled.div.attrs(props => ({className: 'panel-heading'}))`
  height: 87px;
  text-align: center;
  background-color: #2F3945!important;
  color: white!important;
  border-radius: 4px!important;
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: calc(87px - 22px);
`;

const PanelFooterWrapper = styled(ConfigItem)`
`;

const ConfigViewer = styled.ul.attrs(props => ({className: 'list-group'}))`
    & > li:nth-of-type(odd) {
      background: #F9FAFC;
    }
`;

const stringifyConfiguration = config => {
    const cpu = config.cpu ? (
            <ConfigItem><ConfigValue>{config.cpu}</ConfigValue><ConfigLabel>CPU</ConfigLabel></ConfigItem>) : '',
        ram = config.ram ? (
            <ConfigItem><ConfigValue>{config.ram}</ConfigValue><ConfigLabel>RAM</ConfigLabel></ConfigItem>) : '',
        chassis = config.label ? (
            <ConfigItem><ConfigValue>{config.label}</ConfigValue><ConfigLabel>CHASSIS</ConfigLabel></ConfigItem>) : '',
        ethernet = config.ethernet ? (
            <ConfigItem><ConfigValue>{config.ethernet}</ConfigValue><ConfigLabel>Ethernet</ConfigLabel></ConfigItem>) : '',
        ssd = config.ssd ? (
            <Fragment><ConfigValue>{config.ssd}</ConfigValue><ConfigLabel>SSD</ConfigLabel></Fragment>) : null,
        hdd = config.hdd ? (
            <Fragment><ConfigValue>{config.hdd}</ConfigValue><ConfigLabel>HDD</ConfigLabel></Fragment>) : null,
        raid = config.raid ? (
                <ConfigItem><ConfigValue>{config.raid}</ConfigValue><ConfigLabel>RAID</ConfigLabel></ConfigItem>) :
            (<ConfigItem><ConfigValue><FormattedMessage id={'without_raid'}/></ConfigValue><ConfigLabel>RAID</ConfigLabel></ConfigItem>),
        traffic = config.traffic ? (
            <ConfigItem><ConfigValue>{config.traffic}</ConfigValue><ConfigLabel><FormattedMessage
                id='mbps'/></ConfigLabel></ConfigItem>) : '';
    let drive;
    if (hdd) {
        drive = <ConfigItem>{hdd}</ConfigItem>;
    }
    if (ssd && !hdd) {
        drive = <ConfigItem>{ssd}</ConfigItem>;
    } else if (hdd && ssd) {
        drive = <ConfigItem>{hdd} + {ssd}</ConfigItem>;
    }
    return (
        <Fragment>
            {chassis}
            {cpu}
            {ram}
            {drive}
            {raid}
            {ethernet}
            {traffic}
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
        price = props.total;
        label = props.label;
    } else {
        // price = props.config.price.toLocaleString(props.language, {style: 'currency', currency: props.config.currency, minimumFractionDigits: 0});
        price = props.config.price;
        if (props.config[props.location + '_old_price']) {
            oldPrice = parseFloat(props.config[props.location + '_old_price']);
        }
    }
    const currency = new Intl.NumberFormat(props.language, {
        style: 'currency',
        currency: props.config.currency,
        minimumIntegerDigits: 1,
        minimumSignificantDigits: 1,
        minimumFractionDigits: 0,
    }).format(0).replace(/[0-9]/g, '');
    const isOrderButtonActive = (props.os && props.administration && props.softpack && props.osImage);

    return (
        <ConfigCardWrapper className="panel panel-default">
            <PanelHeaderWrapper>
                {props.config.name}
            </PanelHeaderWrapper>
            <LineWithPriceWrapper>
                <FormattedMessage id='per_month' values={{currency, price: <PriceWrapper>{price}</PriceWrapper>}}/>
            </LineWithPriceWrapper>
            <ConfigViewer>
                {(isSideBar) ? (<ConfigDescription>{props.config.descr}</ConfigDescription>) : ''}
                {(label) ? (
                    <ConfigItem><ConfigValue>{label}</ConfigValue><ConfigLabel><FormattedMessage
                        id='label' defaultMessage="Server Label"/></ConfigLabel></ConfigItem>) : ''}
                {stringifyConfiguration(props.config)}
                <SelectedOption options={props.osOptions} input={props.os} label='os'/>
                <SelectedOption options={props.administrationOptions} input={props.administration}
                                label='administration'/>
                <SelectedOption options={props.softpackOptions} input={props.softpack} label='softpack'/>
                <SoftwareDescriber osImage={props.osImage}/>
                {!isSideBar ? (
                    <RowWithButton>
                        <SelectButton type="button" className="btn"
                                      data-config-id={props.config.id}
                                      onClick={handleSelect}><FormattedMessage id='select'/></SelectButton>
                    </RowWithButton>
                ) : ''}
            </ConfigViewer>
        </ConfigCardWrapper>
    );
}
