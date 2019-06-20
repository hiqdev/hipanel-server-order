import React, {Component, Fragment, useEffect} from 'react'
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

const sideMargin = {marginTop: '1em'};

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const stringifyConfiguration = config => {
    return (
        <Fragment>
            <li>
                <b>CPU:</b> <span>{config.cpu}</span>
            </li>
            <li>
                <b>RAM:</b> <span>{config.ram}</span>
            </li>
            <li>
                <b>HDD:</b> <span>{config.hdd}</span>
            </li>
        </Fragment>
    );
};

const getOs = obj => `${obj.os} ${obj.version}`;

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

class ServerOrder extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, {
            actions: null,
            location: 'usa',
            configId: null,
            configOptions: [],
            label: '',
            os: null,
            osOptions: [],
            osImage: null,
            osImageOptions: [],
            administration: null,
            administrationOptions: [],
            softpack: null,
            softpackOptions: [],
            isOrderActive: false,
            total: 0,
            possibleOsImages: [],
        }, props.initialStates);
    }

    componentDidMount(prevProps, prevState, snapshot) {
        this.setState({
            configOptions: this.props.configs,
            osImages: this.props.osImages,
            osOptions: this.getOsOptions(),
            administrationOptions: this.getAdministrationOptions(),
            softpackOptions: this.getSoftpackOptions(),
        }, () => {
            this.setPossibleOsImages();
        });
    }

    setOsImage() {
        this.setState((state, props) => {
            if (state.possibleOsImages.length) {
                let osImage = state.possibleOsImages.find(image => {
                    let osValid = getOs(image) === this.state.os, softpackValid = false, administrationValid = true;
                    if (state.softpack) {
                        const softpack = state.softpack === 'clear' ? null : state.softpack;
                        if (image.softpack === null && softpack === null) {
                            softpackValid = true;
                        } else if (image.softpack && image.softpack.name === softpack) {
                            softpackValid = true;
                        }
                    }

                    return osValid && softpackValid;
                });
                return {
                    osImage: osImage ? osImage.name : state.osImage,
                }
            }
        });
    }

    setPossibleOsImages() {
        let osImages = [];
        Object.values(this.props.osImages).map(osImage => {
            if (this.checkOs(osImage)) {
                osImages.push(osImage);
            }
        });

        this.setState({
            possibleOsImages: osImages,
        }, () => {
            this.setOsImage();
        });
    }

    getOsOptions() {
        const osImages = Object.keys(this.props.osImages).map(key => {
            const image = this.props.osImages[key];

            return {
                name: getOs(image),
                title: getOs(image),
                disabled: false
            };
        });

        return osImages.filter((item, index, self) => index === self.findIndex((t) => t.title === item.title));
    }

    checkOs(osImage) {
        return getOs(osImage) === this.state.os;
    }

    checkAdministration(administration) {
        let check = false;
        if (this.state.possibleOsImages.length) {
            Object.values(this.state.possibleOsImages).forEach(osImage => {
                if (administration === 'managed') {
                    check = !!(osImage.softpack && typeof osImage.softpack.panel === 'string');
                }
                if (check === false && administration === 'unmanaged') {
                    check = !!(osImage.softpack === null || osImage.softpack.panel === null);
                }
            });
        }

        return check;
    }

    getAdministrationOptions() {
        let administrations = [
            {
                name: 'managed',
                title: <FormattedMessage id='managed' defaultMessage='Managed'/>,
                disabled: !this.checkAdministration('managed'),
            },
            {
                name: 'unmanaged',
                title: <FormattedMessage id='unmanaged' defaultMessage='Unmanaged'/>,
                disabled: !this.checkAdministration('unmanaged')
            },
        ];

        return administrations;
    }

    checkSoftpack(softpack) {
        let check = false;
        if (this.state.possibleOsImages.length && softpack) {
            Object.values(this.state.possibleOsImages).forEach(osImage => {
                if (osImage.softpack === null && softpack.name === 'clear') {
                    check = true;
                } else if (osImage.softpack && osImage.softpack.name === softpack.name) {
                    check = true;
                }
            });
        }

        return check;
    }

    getSoftpackOptions() {
        let rawSoftpacks = [];
        for (let osImageName in this.props.osImages) {
            const image = this.props.osImages.hasOwnProperty(osImageName) ? this.props.osImages[osImageName] : null;
            if (image && image.softpack) {
                rawSoftpacks.push({
                    name: image.softpack.name,
                    title: image.softpack.name.toUpperCase(),
                    disabled: !this.checkSoftpack(image.softpack),
                })
            }
        }
        rawSoftpacks.unshift({
            name: 'clear',
            title: <FormattedMessage id='no_softpack' defaultMessage='No softpack'/>,
            disabled: !this.checkSoftpack({name: 'clear'}),
        });
        const unionPacks = rawSoftpacks.filter((item, index, self) => index === self.findIndex((t) => (
                t.place === item.place && t.name === item.name
            ))
        );

        return Object.assign(unionPacks);
    }

    handleLocationChange(location) {
        this.setState({
            location: location,
            configId: null,
            label: '',
            os: null,
            osImage: null,
            administration: null,
            softpack: null,
            isOrderActive: false,
        });
    }

    handleSelectConfig(configId) {
        this.setState({
            configId: configId,
            label: '',
            administration: null,
            softpack: null,
            isOrderActive: false,
            total: this.state.configOptions[this.state.location].find(conf => parseInt(conf.id) === parseInt(configId)).price,
        });
    }

    handleOSChange(os) {
        this.setState({os}, () => {
            this.setPossibleOsImages();
        });
    }

    handleAdministrationChange(administration) {
        let total = this.state.total;
        const currentState = this.state.administration;
        if (administration === 'managed' && (currentState === 'unmanaged' || currentState == null)) {
            total += 100;
        } else if (administration === 'unmanaged' && currentState === 'managed') {
            total -= 100;
        }
        this.setState({administration, total}, this.setOsImage);
    }

    handleSoftpackChange(softpack) {
        this.setState({softpack}, this.setOsImage);
    }

    handleLabelChange(evt) {
        this.setState({label: evt.target.value});
    }

    render() {
        let mainSection = <Alert msgId='select_location'/>, sidebarCard = '';
        const {
            location, configId, os, osOptions, administration, softpack, // softpackOptions, administrationOptions,
            action, configOptions, label, osImage
        } = this.state;
        const administrationOptions = this.getAdministrationOptions();
        const softpackOptions = this.getSoftpackOptions();
        const {token} = this.props;

        if (location && configId) {
            const fullConfig = configOptions[location].find(item => parseInt(item.id) === parseInt(configId));
            sidebarCard = (location && configId) ?
                <ConfigCard config={fullConfig} isSideBar={true} {...this.state}/> : '';
            mainSection = <fieldset className="col-md-9">
                <h3>
                    <FormattedMessage id='text.header'/>
                </h3>
                <p>
                    <FormattedMessage id='text.paragraph'/>
                </p>

                <div className="row">
                    <div className="col-md-9">
                        <div className="form-group">
                            <label htmlFor="label"><FormattedMessage id='label' defaultMessage='Label'/></label>
                            <input type="text" className="form-control" name='label' id="label"
                                   value={label} onChange={evt => this.handleLabelChange(evt)}/>
                        </div>
                    </div>
                </div>

                <input type="hidden" id="tariff_id" name="tariff_id" value={fullConfig[`${location}_tariff_id`]}/>

                <input type="hidden" id={token.name} name={token.name} value={token.value}/>

                <input type="hidden" id="object_id" name="object_id" value={configId}/>

                <input type="hidden" id="location" name="location" value={location}/>

                <input type="hidden" id="osimage" name="osimage" value={(osImage ? osImage : '')}/>

                <RadioList label="os" options={osOptions} current={os}
                           onInputChange={value => this.handleOSChange(value)}/>

                <RadioList label="administration" options={administrationOptions} current={administration}
                           onInputChange={value => this.handleAdministrationChange(value)}/>

                <RadioList label="softpack" options={softpackOptions} current={softpack}
                           onInputChange={value => this.handleSoftpackChange(value)}/>
            </fieldset>;
        } else if (location) {
            if (Object.keys(this.state.configOptions).length && this.state.configOptions[location].length) {
                mainSection = (this.state.configOptions[location].map((config, idx) => (
                    <div className="col-md-4" key={idx}>
                        <ConfigCard config={config} {...this.state} location={location}
                                    onSelectConfig={evt => this.handleSelectConfig(evt)}/>
                    </div>
                )));
            } else {
                mainSection = <Alert msgId='no_configurations'/>;
            }
        }

        return (
            <form id="hipanel-server-order" action={action} method="POST">
                <div className="row">
                    <div className="col-md-9">
                        <div className="row">
                            {mainSection}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-md-12">
                                <LocationSwitcher locations={locationOptions} currentLocation={location}
                                                  onLocationChange={loc => this.handleLocationChange(loc)}/>
                            </div>
                            <div className="col-md-12" style={sideMargin}>
                                {sidebarCard}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

function Alert({msgId}) {
    return (
        <div className="alert alert-warning text-center">
            <FormattedMessage id={msgId}/>
        </div>
    );
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
        props.onSelectConfig(evt.currentTarget.dataset.configId);
    };
    let isSideBar = false, price = null, label = null;
    if (props.isSideBar) {
        isSideBar = true;
        price = props.total;
        label = props.label;
    } else {
        price = props.config.price;
    }
    const isOrderButtonActive = (props.os && props.administration && props.softpack && props.osImage);

    return (
        <div className="panel panel-default">
            <div className="panel-heading">{props.config.name}</div>

            <div className="panel-body">
                {props.config.descr}
                <br/>
                <br/>
                <ul className="list-unstyled">
                    {(label) ? (<li><b><FormattedMessage id='label' defaultMessage="Label"/>: </b> <span>{label}</span>
                    </li>) : ''}
                    {stringifyConfiguration(props.config)}
                    <SelectedOption options={props.osOptions} input={props.os} label='os'/>
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
                            disabled={!isOrderButtonActive}><FormattedMessage id='order'/>
                    </button>
                ) : (
                    <button type="button" className="btn btn-primary btn-block"
                            data-config-id={props.config.id}
                            onClick={handleSelect}><FormattedMessage id='select'/></button>
                )}
            </div>
        </div>
    );
}

function Software({softpack, osImage, osImages}) {
    if (softpack === null || softpack === 'clear') {
        return null;
    }
    const software = describeSoftpack(osImages.find(image => image.name === osImage).softpack);

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
            <label><FormattedMessage id={props.label}/></label>
            {options}
        </div>
    );
}

/**
 * @return {null}
 */
function SelectedOption({input, options, label}) {
    if (input && options && label) {
        const item = options.find(item => item.name === input);

        return (
            <li>
                <b><FormattedMessage id={label} defaultMessage={capitalize(label)}/>: </b> <span>{item.title}</span>
            </li>
        );
    }

    return null;
}

export default ServerOrder
