'use strict';

import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl';

const defaultLocation = 'usa';

const currency = 'EUR';

const action = 'http://local.hipanel-demo.hipanel.com/server/order/add-to-cart-dedicated';

const os = [
    {
        name: 'centos',
        label: 'Centos zz.zz'
    },
    {
        name: 'ubuntu',
        label: 'Ubuntu vv.vv'
    },
];

const administration = [
    {
        name: 'managed',
        label: 'Managed'
    },
    {
        name: 'unmanaged',
        label: 'Unmanaged'
    },
];

const softpack = [
    {
        name: 'hipanel',
        label: 'HiPanel (fully free)'
    },
    {
        name: 'fresh',
        label: 'Fresh (root)'
    },
    {
        name: 'lamp',
        label: 'LAMP (root)'
    },
    {
        name: 'branini',
        label: 'Braini CP (Fully free)'
    },
    {
        name: 'cpanel',
        label: 'cPanel (Trial)'
    },
    {
        name: 'sipmanager',
        label: ' ISPManager (Trial)'
    },
];

const locations = [
    {
        name: 'netherlands',
        label: <FormattedMessage id='netherlands' defaultMessage='Netherlands'/>
    },
    {
        name: 'usa',
        label: <FormattedMessage id='usa' defaultMessage='USA'/>
    },
];

const configurations = {
    netherlands: [
        {
            id: 1,
            label: 'Single Start',
            content: '1 х W-2123 CPU / 16 GB DDR4 / 2 х 2 TB HDD',
            price: 127
        },
    ],
    usa: [
        {
            id: 2,
            label: 'Single Business',
            content: '1 х W-2125 CPU / 32 GB DDR4 / 2 х 2 TB HDD',
            price: 175
        },
        {
            id: 3,
            label: 'Single Advanced',
            content: '1 х W-2133 CPU / 64 GB DDR4 / 2 х 2 TB HDD',
            price: 202
        },
    ],
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: defaultLocation,
            configurationId: null,
            label: '',
            os: null,
            administration: null,
            softpack: null,
            isOrderActive: false,
            total: 0
        };
    }

    handleLocationChange(location) {
        this.setState({
            location: location,
            configurationId: null,
            label: '',
            os: null,
            administration: null,
            softpack: null,
            isOrderActive: false,
        });
    }

    handleSelectConfiguration(configurationId) {
        this.setState({
            configurationId: configurationId,
            label: '',
            os: null,
            administration: null,
            softpack: null,
            isOrderActive: false,
            total: configurations[this.state.location].find(conf => parseInt(conf.id) === parseInt(configurationId)).price,
        });
    }

    handleOs(value) {
        this.setState({os: value});
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
            location = this.state.location, configurationId = this.state.configurationId,
            sideMargin = {marginTop: '1em'}, isOrderActive = this.state.isOrderActive;

        if (location) {
            main = (configurations[location].map((configuration, idx) => (
                <div className="col-md-4" key={idx}>
                    <ConfigurationCard configuration={configuration}
                                       onSelectConfiguration={evt => this.handleSelectConfiguration(evt)}/>
                </div>
            )));
        }

        if (this.state.os && this.state.administration && this.state.softpack) {
            isOrderActive = true;
        }

        if (location && configurationId) {
            const fullConfiguration = configurations[location].find(item => parseInt(item.id) === parseInt(configurationId));
            main = <fieldset className="col-md-9">

                <h3>
                    Make your server even more powerful
                </h3>
                <p>
                    Select the technical details and the type of maintenance of your dedicated server. Immediately after
                    placing the order, we will contact you to confirm it and connect your project to the service.
                </p>

                <div
                    className="row">
                    <div
                        className="col-md-9">
                        <div
                            className="form-group">
                            <label
                                htmlFor="exampleInputEmail1"> Label </label>
                            <input type="email" className="form-control" id="exampleInputEmail1"
                                   value={this.state.value}
                                   placeholder="label" onChange={evt => this.handleLabelChange(evt)}/>
                        </div>
                    </div>
                </div>

                <input type="hidden" id="configuration_id" name="configuration_id" value={configurationId}/>

                <RadioList label="os" options={os} onInputChange={evt => this.handleOs(evt)}/>

                <RadioList label="administration" options={administration}
                           onInputChange={evt => this.handleAdministration(evt)}/>

                <RadioList label="softpack" options={softpack} onInputChange={evt => this.handleSoftPack(evt)}/>

            </fieldset>;
            orderPanel = <ConfigurationCard
                configuration={fullConfiguration}
                isSideBar={true}
                isOrderActive={isOrderActive}
                total={this.state.total}
                label={this.state.label}
                os={this.state.os}
                administration={this.state.administration}
                softpack={this.state.softpack}
            />;
        }

        return (
            <form action={action} method="POST">
                <div className="row">
                    <div className="col-md-9">
                        <div className="row">
                            {main}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-md-12">
                                <LocationSwitcher locations={locations}
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
                <label className={"btn btn-default " + (location.name === defaultLocation ? 'active' : '')}
                       key={idx} data-location={location.name} onClick={handleChange}>
                    {location.label}
                </label>
            ))}
        </div>
    );
}

function ConfigurationCard(props) {
    const handleSelect = evt => {
        props.onSelectConfiguration(evt.currentTarget.dataset.configuration);
    };
    let isSideBar = false, price = null, label = null;
    if (props.isSideBar) {
        isSideBar = true;
        price = props.total;
        label = props.label;
    } else {
        price = props.configuration.price;
    }

    return (
        <div className="panel panel-default">
            <div className="panel-heading">{props.configuration.label}</div>

            <div className="panel-body">
                {props.configuration.content}
                <br/>
                <br/>
                <ul className="list-unstyled">
                    {(label) ? (<li><b><FormattedMessage id='label' defaultMessage="Label"/>: </b> <span>{label}</span>
                    </li>) : ''}
                    <SelectedOption options={os} input={props.os} label='os'/>
                    <SelectedOption options={administration} input={props.administration} label='administration'/>
                    <SelectedOption options={softpack} input={props.softpack} label='softpack'/>
                </ul>
                <hr/>
                <div className="text-center text-muted">{price.toLocaleString('ru', {
                    style: 'currency',
                    currency: currency
                })}</div>
            </div>
            <div className="panel-footer">
                {isSideBar ? (
                    <button type="submit" className="btn btn-success btn-block"
                            disabled={!props.isOrderActive}><FormattedMessage id='order' defaultMessate='Order'/>
                    </button>
                ) : (
                    <button type="button" className="btn btn-primary btn-block"
                            data-configuration={props.configuration.id}
                            onClick={handleSelect}><FormattedMessage id='select' defaultMessate='Select'/></button>
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
            <label><FormattedMessage id={props.label} defaultMessage={props.label}/></label>
            {options}
        </div>
    );
}

function SelectedOption(props) {
    if (!props.input) {
        return null;
    }
    const item = props.options.find(item => item.name === props.input), label = props.label;

    return (
        <li><b><FormattedMessage id={props.label} defaultMessage={label}/>: </b> <span>{item.label}</span></li>
    );
}

export default App
