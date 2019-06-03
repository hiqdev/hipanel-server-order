'use strict';

import React, {Component} from 'react'

const defaultLocation = 'usa';

const action = 'http://hipanel.advancedhosters.com.local/server/order/add-to-cart-dedicated';

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
        name: 'manged',
        label: 'Managed'
    },
    {
        name: 'unmanged',
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
        label: 'Netherlands'
    },
    {
        name: 'usa',
        label: 'USA'
    },
];

const configurations = {
    netherlands: [
        {
            id: 1,
            label: 'Single Start',
            content: '1 х W-2123 CPU / 16 GB DDR4 / 2 х 2 TB HDD'
        },
    ],
    usa: [
        {
            id: 2,
            label: 'Single Business',
            content: '1 х W-2125 CPU / 32 GB DDR4 / 2 х 2 TB HDD'
        },
        {
            id: 3,
            label: 'Single Advanced',
            content: '1 х W-2133 CPU / 64 GB DDR4 / 2 х 2 TB HDD'
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
            softPack: null,
            isOrderActive: false,
        };
    }

    handleLocationChange(locationName) {
        this.setState({
            location: locationName,
            configurationId: null,
            label: '',
            os: null,
            administration: null,
            softPack: null,
            isOrderActive: false
        });
    }

    handleSelectConfiguration(configurationId) {
        this.setState({
            configurationId: configurationId,
            label: '',
            os: null,
            administration: null,
            softPack: null,
            isOrderActive: false
        });
    }

    handleOs(value) {
        this.setState({os: value});
    }

    handleAdministration(value) {
        this.setState({administration: value});
    }

    handleSoftPack(value) {
        this.setState({softPack: value});
    }

    render() {
        let main = (<div className="alert alert-warning text-center">Select location</div>), orderPanel = '',
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

        if (this.state.os && this.state.administration && this.state.softPack) {
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

                <div className="row">
                    <div className="col-md-9">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Label</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" placeholder="label"/>
                        </div>
                    </div>
                </div>

                <RadioList label="OS" options={os} onInputChange={evt => this.handleOs(evt)}/>

                <RadioList label="Administration" options={administration}
                           onInputChange={evt => this.handleAdministration(evt)}/>

                <RadioList label="Softpack" options={softpack} onInputChange={evt => this.handleSoftPack(evt)}/>

            </fieldset>;
            orderPanel =
                <ConfigurationCard configuration={fullConfiguration} isSideBar={true} isOrderActive={isOrderActive}/>;
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
                                                  onLocationChange={evt => this.handleLocationChange(evt)}/>
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
        props.onLocationChange(evt.target.dataset.location);
    };

    return (
        <div className="btn-group btn-group-justified" data-toggle="buttons">
            {props.locations.map(location => (
                <label className={"btn btn-default " + (location.name === defaultLocation ? 'active' : '')}
                       key={location.name} data-location={location.name}
                       onClick={handleChange}>
                    <input type="radio" autoComplete="off"/>{location.label}
                </label>
            ))}
        </div>
    );
}

function ConfigurationCard(props) {
    const handleSelect = evt => {
        props.onSelectConfiguration(evt.target.dataset.configuration);
    };
    let isSideBar = false;
    if (props.isSideBar) {
        isSideBar = true;
    }

    return (
        <div className="panel panel-default">
            <div className="panel-heading">{props.configuration.label}</div>
            <div className="panel-body">
                {props.configuration.content}
                <hr/>
                <div className="text-center text-muted">$ 100.00</div>
            </div>
            <div className="panel-footer">
                {isSideBar ? (
                    <button type="submit" className="btn btn-success btn-block"
                            disabled={!props.isOrderActive}>Order</button>
                ) : (
                    <button type="button" className="btn btn-primary btn-block"
                            data-configuration={props.configuration.id}
                            onClick={handleSelect}>Select</button>
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
            <label>{props.label}</label>
            {options}
        </div>
    );
}

export default App
