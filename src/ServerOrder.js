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
    const cpu = config.cpu ? (<li><b>CPU:</b> <span>{config.cpu}</span></li>) : '',
        ram = config.ram ? (<li><b>RAM:</b> <span>{config.ram}</span></li>) : '',
        hdd = config.hdd ? (<li><b>HDD:</b> <span>{config.hdd}</span></li>) : '';
    return (
        <Fragment>
            {cpu}
            {ram}
            {hdd}
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
            configObj: {},
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
            administration: 'managed',
            possibleOsImages: this.props.osImages,
        }, this.setPossibleOsImages);
    }

    setOsImage() {
        this.setState(state => {
            if (state.possibleOsImages.length && state.softpack) {
                let osImage = null;
                const images = state.possibleOsImages.filter(image => getOs(image) === state.os);
                for (let i = 0; i < images.length; i++) {
                    const image = images[i];
                    if (image.softpack === null) {
                        osImage = image;
                        break;
                    }
                    if (state.softpack === image.softpack.name) {
                        osImage = image;
                        break;
                    }
                }

                return {
                    osImage: osImage,
                }
            }
        });
    }

    setPossibleOsImages() {
        let osImages = this.props.osImages;
        if (this.state.administration) {
            osImages = osImages.filter(image => {
                if (this.state.administration === 'managed') {
                    return image.softpack && typeof image.softpack.panel === 'string';
                } else {
                    return image.softpack === null || image.softpack.panel === null;
                }
            })
        }

        this.setState({
            possibleOsImages: osImages,
        }, this.setOsImage);
    }

    getOsOptions() {
        let osOptions = Object.keys(this.props.osImages).map(key => {
            const image = this.props.osImages[key];

            return {
                name: getOs(image),
                title: getOs(image),
                disabled: false
            };
        });

        osOptions = osOptions.filter((item, index, self) => index === self.findIndex((t) => t.title === item.title));

        osOptions.map(os => {
            os.disabled = !this.state.possibleOsImages.some(image => getOs(image) === os.name);
        });

        return osOptions;
    }

    getAdministrationOptions() {
        return [
            {
                name: 'managed',
                title: <FormattedMessage id='managed' defaultMessage='Managed'/>,
                disabled: !this.props.osImages.some(image => (image.softpack !== null && typeof image.softpack.panel === 'string'))
            },
            {
                name: 'unmanaged',
                title: <FormattedMessage id='unmanaged' defaultMessage='Unmanaged'/>,
                disabled: !this.props.osImages.some(image => (image.softpack === null || image.softpack.panel === null))
            },
        ];
    }

    getSoftpackOptions() {
        let rawSoftpacks = [];
        for (let osImageName in this.props.osImages) {
            const image = this.props.osImages.hasOwnProperty(osImageName) ? this.props.osImages[osImageName] : null;
            if (image && image.softpack) {
                rawSoftpacks.push({
                    name: image.softpack.name,
                    title: image.softpack.name.toUpperCase(),
                    disabled: false,
                })
            }
        }
        rawSoftpacks.unshift({
            name: 'clear',
            title: <FormattedMessage id='no_softpack' defaultMessage='No softpack'/>,
            disabled: false,
        });
        let unionPacks = rawSoftpacks.filter((item, index, self) => index === self.findIndex((t) => (
                t.place === item.place && t.name === item.name
            ))
        );

        unionPacks = Object.assign(unionPacks);

        unionPacks.map(pack => {
            let canOption = false;
            const images = this.state.possibleOsImages.filter(image => getOs(image) === this.state.os);

            for (let i = 0; i < images.length; i++) {
                const img = images[i];

                if (img.softpack && img.softpack.name === pack.name) {
                    canOption = true;
                    break;
                }
                if (pack.name === 'clear' && img.softpack === null) {
                    canOption = true;
                    break;
                }
            }

            pack.disabled = !canOption;
        });

        return unionPacks;
    }

    handleLocationChange(location) {
        this.setState({
            location: location,
            configId: null,
            label: '',
            osImage: null,
            administration: null,
            softpack: null,
            isOrderActive: false,
        });
    }

    handleSelectConfig(configId) {
        const config = this.state.configOptions[this.state.location].find(conf => parseInt(conf.id) === parseInt(configId));
        this.setState({
            configId: configId,
            configObj: config,
            label: '',
            administration: null,
            softpack: null,
            isOrderActive: false,
            total: config.price,
        });
    }

    handleOSChange(os) {
        this.setState({os}, this.setPossibleOsImages);
    }

    handleAdministrationChange(administration) {
        let total = this.state.total;
        const currentState = this.state.administration;
        if (administration === 'managed' && (currentState === 'unmanaged' || currentState == null)) {
            total += parseFloat(this.state.configObj.support_price);
        } else if (administration === 'unmanaged' && currentState === 'managed') {
            total -= parseFloat(this.state.configObj.support_price);
        }
        this.setState({administration, total}, this.setPossibleOsImages);
    }

    handleSoftpackChange(softpack) {
        this.setState({softpack}, this.setPossibleOsImages);
    }

    handleLabelChange(evt) {
        this.setState({label: evt.target.value});
    }

    render() {
        let mainSection = <Alert msgId='select_location'/>, sidebarCard = '';
        const {
            location, configId, os, administration, softpack, action, configOptions, label, osImage
        } = this.state;
        const {token} = this.props;

        if (location && configId) {
            const administrationOptions = this.getAdministrationOptions();
            const osOptions = this.getOsOptions();
            const softpackOptions = this.getSoftpackOptions();
            const fullConfig = configOptions[location].find(item => parseInt(item.id) === parseInt(configId));
            sidebarCard = (location && configId) ?
                <ConfigCard config={fullConfig} isSideBar={true} {...this.state} osOptions={osOptions}
                            administrationOptions={administrationOptions} softpackOptions={softpackOptions}/> : '';
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

                <input type="hidden" id="tariff_id" name="tariff_id" value={fullConfig[location + '_tariff_id']}/>

                <input type="hidden" id={token.name} name={token.name} value={token.value}/>

                <input type="hidden" id="object_id" name="object_id" value={configId}/>

                <input type="hidden" id="location" name="location" value={location}/>

                <input type="hidden" id="osimage" name="osimage" value={(osImage ? osImage.name : '')}/>

                <RadioList label="administration" options={administrationOptions} current={administration}
                           onInputChange={value => this.handleAdministrationChange(value)}/>

                <RadioList label="os" options={osOptions} current={os}
                           onInputChange={value => this.handleOSChange(value)}/>

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
                    <Software osImage={props.osImage}/>
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

function Software({osImage}) {
    if (osImage === null) {
        return null;
    }
    if (osImage.softpack === null) {
        return null;
    }
    const software = describeSoftpack(osImage.softpack);

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
        if (!item) {
            return null
        }

        return (
            <li>
                <b><FormattedMessage id={label} defaultMessage={capitalize(label)}/>: </b> <span>{item.title}</span>
            </li>
        );
    }

    return null;
}

export default ServerOrder
