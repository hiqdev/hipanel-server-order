'use strict';

import React, {Component, useEffect} from 'react'
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

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const describeSoftpack = pack => {
    let title = '';
    if (!pack) {
        return null;
    }

    pack.packages.map(item => {
        title += `${item.name} ${item.version} + `;
    });

    return title.replace(new RegExp("[\\s+]*$"), '');
};

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
            total: 0,
            configOptions: [],
            imageOptions: [],
            administrationOptions: [],
            softpackOptions: [],
        }, props.initialStates);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.osimage != this.state.osimage) {
            this.buildAdministration();
            this.buildSoftpacks();
        }
    }

    componentDidMount(prevProps, prevState, snapshot) {
        let images = Object.keys(this.props.osImages).map(key => {
            const image = this.props.osImages[key];

            return {
                name: image.name,
                title: image.title,
                disabled: false
            };
        });
        this.setState({
            configOptions: this.props.configs,
            imageOptions: images,
        }, () => {
            this.buildAdministration();
            this.buildSoftpacks();
        });
    }

    getCurrentImage() {
        let image = null;
        if (this.state.osimage) {
            Object.values(this.props.osImages).forEach(item => {
                if (item.name === this.state.osimage) {
                    image = item;
                }
            });
        }

        return image;
    }

    buildAdministration() {
        const image = this.getCurrentImage();
        let administrations = [
            {
                name: 'managed',
                title: 'Managed',
                disabled: image === null ? false : image.softpack && image.softpack.panel === 'HiPanel'
            },
            {
                name: 'unmanaged',
                title: 'Unmanaged',
                disabled: image === null ? false : image.softpack === null || image.softpack.panel !== 'HiPanel'
            },
        ];
        this.setState({
            administrationOptions: administrations,
        });
    }

    buildSoftpacks() {
        let rawSoftpacks = [];
        for (let imageName in this.props.osImages) {
            const image = this.props.osImages.hasOwnProperty(imageName) ? this.props.osImages[imageName] : null,
                currentImage = this.getCurrentImage();
            if (image && image.softpack) {
                rawSoftpacks.push({
                    name: image.softpack.name,
                    title: image.softpack.name.toUpperCase(),
                    disabled: !(currentImage && currentImage.softpack && currentImage.softpack.name === image.softpack.name),
                })
            } else {
                rawSoftpacks.push({
                    name: 'clear',
                    title: 'No softpack',
                    disabled: false,
                })
            }
        }
        const unionPacks = rawSoftpacks.filter((item, index, self) => index === self.findIndex((t) => (
                t.place === item.place && t.name === item.name
            ))
        );

        this.setState({
            softpackOptions: Object.assign(unionPacks),
        });
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
            total: this.state.configOptions[this.state.location].find(conf => parseInt(conf.id) === parseInt(configId)).price,
        });
    }

    handleImage(osimage) {
        this.setState({osimage});
    }

    handleAdministration(administration) {
        let total = this.state.total;
        const currentState = this.state.administration;
        if (administration === 'managed' && (currentState === 'unmanaged' || currentState == null)) {
            total += 100;
        } else if (administration === 'unmanaged' && currentState === 'managed') {
            total -= 100;
        }
        this.setState({administration, total});
    }

    handleSoftPack(softpack) {
        this.setState({softpack});
    }

    handleLabelChange(evt) {
        this.setState({label: evt.target.value});
    }

    render() {
        const sideMargin = {marginTop: '1em'};
        let main = (<div className="alert alert-warning text-center"><FormattedMessage id='select_locaction'
                                                                                       defaultMessage='Select location'/>
            </div>),
            orderPanel = '',
            location = this.state.location, configId = this.state.configId, isOrderActive = this.state.isOrderActive;

        if (location) {
            if (Object.keys(this.state.configOptions).length && this.state.configOptions[location].length) {
                main = (this.state.configOptions[location].map((config, idx) => (
                    <div className="col-md-4" key={idx}>
                        <ConfigCard config={config} {...this.state} location={location}
                                    onSelectConfig={evt => this.handleSelectConfig(evt)}/>
                    </div>
                )));
            } else {
                main = (<div className="alert alert-warning text-center">
                    <FormattedMessage id='no_configurations' defaultMessage='No configurations found'/>
                </div>);
            }
        }

        if (this.state.osimage && this.state.administration && this.state.softpack) {
            isOrderActive = true;
        }

        if (location && configId) {
            const fullConfig = this.state.configOptions[location].find(item => parseInt(item.id) === parseInt(configId));
            main = <fieldset className="col-md-9">

                <h3>
                    <FormattedMessage id='text.header'/>
                </h3>
                <p>
                    <FormattedMessage id='text.paragraph'/>
                </p>

                <div className="row">
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

                <input type="hidden" id={this.props.token.name} name={this.props.token.name} value={this.props.token.value}/>

                <input type="hidden" id="object_id" name="object_id" value={configId}/>

                <RadioList label="osimage" options={this.state.imageOptions}
                           current={this.state.osimage}
                           onInputChange={value => this.handleImage(value)}/>

                <RadioList label="administration" options={this.state.administrationOptions}
                           current={this.state.administration}
                           onInputChange={value => this.handleAdministration(value)}/>

                <RadioList label="softpack" options={this.state.softpackOptions}
                           current={this.state.softpack}
                           onInputChange={value => this.handleSoftPack(value)}/>

            </fieldset>;
            orderPanel = <ConfigCard config={fullConfig}
                                     imageOptions={this.state.imageOptions}
                                     administrationOptions={this.state.administrationOptions}
                                     softpackOptions={this.state.softpackOptions}
                                     isSideBar={true}
                                     isOrderActive={isOrderActive}
                                     currency={this.state.currency}
                                     language={this.state.language}
                                     label={this.state.label}
                                     osimage={this.state.osimage}
                                     administration={this.state.administration}
                                     softpack={this.state.softpack}
                                     location={location}
                                     total={this.state.total}
                                     currentImage={this.getCurrentImage()}/>;
        }

        return (
            <form id="hipanel-server-order" action={this.state.action} method="POST">
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
                <input type="hidden" id="tariff_id" name="tariff_id"
                       value={props.config[`${props.location}_tariff_id`]}/>
                <ul className="list-unstyled">
                    {(label) ? (<li><b><FormattedMessage id='label' defaultMessage="Label"/>: </b> <span>{label}</span>
                    </li>) : ''}
                    <SelectedOption options={props.imageOptions} input={props.osimage} label='osimage'/>
                    <SelectedOption options={props.administrationOptions} input={props.administration}
                                    label='administration'/>
                    <SelectedOption options={props.softpackOptions} input={props.softpack} label='softpack'/>
                    <Software {...props}/>
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

function Software({softpack, currentImage}) {
    if (softpack === null || softpack === 'clear') {
        return null;
    }
    const software = describeSoftpack(currentImage.softpack);

    return (
        <li>
            <b><FormattedMessage id='software' defaultMessage="Software"/>:</b> <span>{software}</span>
        </li>
    );
}

function RadioList({current, ...props}) {
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
            <label>
                <input type="radio" name={props.label.toLowerCase()} value={option.name} onChange={handleChange}
                       checked={current === option.name}
                       disabled={(option.disabled === true) ? 'disabled' : ''}/>
                {option.title}
            </label>
        </div>
    ));

    return (
        <div className="form-group">
            <label><FormattedMessage id={props.label} defaultMessage={capitalize(props.label)}/></label>
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
            <b><FormattedMessage id={label} defaultMessage={capitalize(label)}/>: </b> <span>{item.title}</span>
        </li>
    );
}

export default App
