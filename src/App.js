'use strict';

import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl';

const locationOptions = [
    {
        name: 'nl',
        label: <FormattedMessage id='nl' defaultMessage='Netherlands'/>
    },
    {
        name: 'us',
        label: <FormattedMessage id='us' defaultMessage='USA'/>
    },
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, {
            actions: null,
            location: 'usa',
            configId: null,
            label: '',
            osimage: null,
            administration: null,
            softpack: null,
            isOrderActive: false,
            total: 0
        }, props.initialStates);
    }

    handleLocationChange(location) {
        this.setState({
            location: location,
            configId: null,
            label: '',
            osimage: null,
            administration: null,
            softpack: null,
            isOrderActive: false,
        });
    }

    handleSelectConfig(configId) {
        this.setState({
            configId: configId,
            label: '',
            osimage: null,
            administration: null,
            softpack: null,
            isOrderActive: false,
            total: this.props.configOptions[this.state.location].find(conf => parseInt(conf.id) === parseInt(configId)).price,
        });
    }

    handleImage(value) {
        this.setState({osimage: value});
    }

    handleAdministration(value) {
        let total = this.state.total;
        const currentState = this.state.administration;
        if (value === 'managed' && (currentState === 'unmanaged' || currentState == null)) {
            total += 100;
        } else if (value === 'unmanaged' && currentState === 'managed') {
            total -= 100;
        }
        this.setState({
            administration: value,
            total: total
        });
    }

    handleSoftPack(value) {
        this.setState({softpack: value});
    }

    handleLabelChange(evt) {
        this.setState({label: evt.target.value});
    }

    render() {
        let main = (<div className="alert alert-warning text-center"><FormattedMessage id='select_locaction'
                                                                                       defaultMessage='Select location'/>
            </div>), orderPanel = '',
            location = this.state.location, configId = this.state.configId,
            sideMargin = {marginTop: '1em'}, isOrderActive = this.state.isOrderActive;

        if (location) {
            if (this.props.configOptions[location].length > 0) {
                main = (this.props.configOptions[location].map((config, idx) => (
                    <div className="col-md-4" key={idx}>
                        <ConfigCard config={config} {...this.state} location={location}
                                    onSelectConfig={evt => this.handleSelectConfig(evt)}/>
                    </div>
                )));
            } else {
                main = (<div className="alert alert-warning text-center">
                    <FormattedMessage id='no_configurations' defaultMessage='No configurations'/>
                </div>);
            }
        }

        if (this.state.osimage && this.state.administration && this.state.softpack) {
            isOrderActive = true;
        }

        if (location && configId) {
            const fullConfig = this.props.configOptions[location].find(item => parseInt(item.id) === parseInt(configId));
            main = <fieldset className="col-md-9">

                <h3>
                    <FormattedMessage id='text.header'/>
                </h3>
                <p>
                    <FormattedMessage id='text.paragraph'/>
                </p>

                <div
                    className="row">
                    <div
                        className="col-md-9">
                        <div
                            className="form-group">
                            <label
                                htmlFor="label"><FormattedMessage id='label'
                                                                               defaultMessage='Label'/></label>
                            <input type="text" className="form-control" name='label' id="label"
                                   value={this.state.value}
                                   onChange={evt => this.handleLabelChange(evt)}/>
                        </div>
                    </div>
                </div>

                <input type="hidden" id="object_id" name="object_id" value={configId}/>

                <RadioList label="osimage" options={this.props.imageOptions}
                           onInputChange={evt => this.handleImage(evt)}/>

                <RadioList label="administration" options={this.props.administrationOptions}
                           onInputChange={evt => this.handleAdministration(evt)}/>

                <RadioList label="softpack" options={this.props.softpackOptions}
                           onInputChange={evt => this.handleSoftPack(evt)}/>

            </fieldset>;
            orderPanel = <ConfigCard config={fullConfig} isSideBar={true}
                                     isOrderActive={isOrderActive} currency={this.state.currency}
                                     language={this.state.language} {...this.props}
                                     label={this.state.label}
                                     osimage={this.state.osimage}
                                     administration={this.state.administration}
                                     softpack={this.state.softpack}
                                     location={location}
                                     total={this.state.total}/>;
        }

        return (
            <form action={this.state.action} method="POST">
                <div className="row">
                    <div className="col-md-9">
                        <div className="row">
                            {main}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-md-12">
                                <LocationSwitcher locations={locationOptions} currentLocation={this.state.location}
                                                  onLocationChange={loc => this.handleLocationChange(loc)}/>
                            </div>
                            <div className="col-md-12" style={sideMargin}>
                                {orderPanel}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

function LocationSwitcher(props) {
    const handleChange = evt => {
        props.onLocationChange(evt.currentTarget.dataset.location);
    };

    return (
        <div className="btn-group btn-group-justified">
            {props.locations.map((location, idx) => (
                <label className={"btn btn-default " + (location.name === props.currentLocation ? 'active' : '')}
                       key={idx} data-location={location.name} onClick={handleChange}>
                    {location.label}
                </label>
            ))}
        </div>
    );
}

function ConfigCard(props) {
    const handleSelect = evt => {
        props.onSelectConfig(evt.currentTarget.dataset.config);
    };
    let isSideBar = false, price = null, label = null;
    if (props.isSideBar) {
        isSideBar = true;
        price = props.total;
        label = props.label;
    } else {
        price = props.config.price;
    }

    return (
        <div className="panel panel-default">
            <div className="panel-heading">{props.config.name}</div>

            <div className="panel-body">
                {props.config.descr}
                <br/>
                <br/>
                <input type="hidden" id="tariff_id" name="tariff_id" value={props.config[`${props.location}_tariff_id`]}/>
                <ul className="list-unstyled">
                    {(label) ? (<li><b><FormattedMessage id='label' defaultMessage="Label"/>: </b> <span>{label}</span>
                    </li>) : ''}
                    <SelectedOption options={props.imageOptions} input={props.osimage} label='osimage'/>
                    <SelectedOption options={props.administrationOptions} input={props.administration}
                                    label='administration'/>
                    <SelectedOption options={props.softpackOptions} input={props.softpack} label='softpack'/>
                </ul>
                <hr/>
                <div className="text-center text-muted">{price.toLocaleString(props.language, {
                    style: 'currency',
                    currency: props.config.currency
                })}</div>
            </div>
            <div className="panel-footer">
                {isSideBar ? (
                    <button type="submit" className="btn btn-success btn-block"
                            disabled={!props.isOrderActive}><FormattedMessage id='order' defaultMessage='Order'/>
                    </button>
                ) : (
                    <button type="button" className="btn btn-primary btn-block"
                            data-config={props.config.id}
                            onClick={handleSelect}><FormattedMessage id='select' defaultMessage='Select'/></button>
                )}
            </div>
        </div>
    );
}

function RadioList(props) {
    const handleChange = evt => {
        props.onInputChange(evt.target.value)
    };

    const options = props.options.map((option, idx) => (
        <div className="radio" key={idx}>
            <label><input type="radio" name={props.label.toLowerCase()} value={option.name}
                          onChange={handleChange}/>{option.label}</label>
        </div>
    ));

    return (
        <div className="form-group">
            <label><FormattedMessage id={props.label} defaultMessage={props.label.toUpperCase()}/></label>
            {options}
        </div>
    );
}

/**
 * @return {null}
 */
function SelectedOption({input, options, label}) {
    if (!input) {
        return null;
    }
    const item = options.find(item => item.name === input);

    return (
        <li>
            <b><FormattedMessage id={label} defaultMessage={label.toUpperCase()}/>: </b> <span>{item.label}</span>
        </li>
    );
}

export default App
