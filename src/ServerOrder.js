import React from 'react'
import classnames from 'classnames'
import {FormattedMessage} from 'react-intl'
import styled from 'styled-components'
import LocationSwitcher from './components/LocationSwitcher'
import ConfigCard from './components/ConfigCard'
import RadioList from './components/RadioList'
import ServerOrderWrapper from './components/ServerOrderWrapper'
import Breadcrumbs from './components/Breadcrumbs'

const FontWrapper = styled.div`
  font-family: 'Open Sans', sans-serif;
`;

const FeaturedHeader = styled.h2`
  display: inline-block;
  line-height: 45px;
  padding: 0 0 13px 0;
  font-size: 36px;
  font-weight: 300;
  margin: 0;
`;

const GroupHeader = styled.h4`
  font-size: 22px;
  color: #4db6ac;
  padding-top: 77px;
  padding-bottom: 40px;
  line-height: 27px;
   font-weight: 600;
`;

const LabelWrapper = styled.div`
  margin-bottom: 30px;
  padding-top: 72px;
  padding-bottom: 43px;
  
  input:focus::-webkit-input-placeholder { color:transparent; }
  input:focus:-moz-placeholder { color:transparent; } /* FF 4-18 */
  input:focus::-moz-placeholder { color:transparent; } /* FF 19+ */
  input:focus:-ms-input-placeholder { color:transparent; } /* IE 10+ */
  .form-control:focus {
    border-color: transparent;
    outline: 0;
    box-shadow: none;
    border-bottom: 1px solid #bdbdbd;
  }
  input {
    display: block;
    height: 47px;
    margin: auto;
    background-color: transparent;
    color: #38474e;
    border: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid #bdbdbd;
    border-top: none;
    border-radius: 0;
    text-align: left;
    padding: 0 0;
    font: 300 18px/36px 'Open Sans',Arial,sans-serif;
    box-shadow: none;
  }
`;

const getOs = obj => `${obj.os} ${obj.version}`;

const AlertWrapper = styled.div`
  margin-top: 5em;
`;

const Alert = ({msgId}) => {
    return (
        <AlertWrapper className="alert alert-warning text-center">
            <FormattedMessage id={msgId}/>
        </AlertWrapper>
    );
};

class ServerOrder extends React.Component {
    constructor(props) {
        super(props);
        this.cmpRef = React.createRef();
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
            locationOptions: [
                {
                    name: 'nl',
                    label: <FormattedMessage id='nl' defaultMessage='Netherlands'/>
                },
                {
                    name: 'us',
                    label: <FormattedMessage id='us' defaultMessage='USA'/>
                },
            ],
        }, props.initialStates);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.configId !== this.state.configId) {
            this.cmpRef.current.scrollIntoView({behavior: 'smooth'});
        }
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
                    if (image.softpack === null && state.softpack === 'clear') {
                        osImage = image;
                        break;
                    }
                    if (image.softpack !== null && image.softpack.name === state.softpack) {
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
        let mainSection = <Alert msgId='select_location'/>, sidebarCard = '',
            headerTextId = 'featured_dedicated_servers';
        const {
            location, configId, os, administration, softpack, action, configOptions, label, osImage, locationOptions
        } = this.state;
        const {token} = this.props;
        const serverLabel = <FormattedMessage id='server_label'/>;

        if (location && configId) {
            const administrationOptions = this.getAdministrationOptions();
            const osOptions = this.getOsOptions();
            const softpackOptions = this.getSoftpackOptions();
            const fullConfig = configOptions[location].find(item => parseInt(item.id) === parseInt(configId));
            headerTextId = 'configuration_setting';
            sidebarCard = (location && configId) ?
                <ConfigCard config={fullConfig} isSideBar={true} {...this.state} osOptions={osOptions}
                            administrationOptions={administrationOptions} softpackOptions={softpackOptions}/> : '';
            mainSection = <fieldset>

                <LabelWrapper className="form-group">
                    <label htmlFor="label" className='sr-only'>{serverLabel}</label>
                    <input type="text" className="form-control" name='label' id="label" placeholder="Server Label"
                           autoComplete="off" value={label} onChange={evt => this.handleLabelChange(evt)}/>
                </LabelWrapper>

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
            if (Object.keys(this.state.configOptions).length && this.state.configOptions.hasOwnProperty(location)) {
                let groups = {};
                const groupByProfiles = (configs) => {
                    for (let i = 0; i < configs.length; i++) {
                        const config = configs[i];
                        for (let i = 0; i < config.profiles.length; i++) {
                            const profile = config.profiles[i];
                            if (!groups[profile]) {
                                groups[profile] = [];
                            }
                            groups[profile].push(config);
                        }
                    }
                };
                groupByProfiles(this.state.configOptions[location]);
                mainSection = Object.keys(groups).map((groupName, idx) => {
                    const configs = groups[groupName].map((config, idx) => (
                        <div className="col-md-4" key={idx}>
                            <ConfigCard config={config} {...this.state} location={location}
                                        onSelectConfig={evt => this.handleSelectConfig(evt)}/>
                            </div>
                    ));
                    return (<div className="row" key={idx}>
                        <GroupHeader className='col-xs-12'>{groupName}</GroupHeader>
                        {configs}
                    </div>);
                });
            } else {
                mainSection = <Alert msgId='no_configurations'/>;
            }
        }

        return (
            <FontWrapper ref={this.cmpRef}>
                <Breadcrumbs currentLocation={location} configId={configId} onBack={location => this.handleLocationChange(location)}/>
                <ServerOrderWrapper configId={configId}>
                    <div className="container">
                        <form id="hipanel-server-order" action={action} method="POST">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className={classnames({"col-md-8": configId === null,"col-md-12": configId !== null})}>
                                            <FeaturedHeader><FormattedMessage id={headerTextId}/></FeaturedHeader>
                                        </div>
                                        <div className={classnames({"col-md-4": configId === null,"hidden": configId !== null})}>
                                            <LocationSwitcher locations={locationOptions} currentLocation={location}
                                                              onLocationChange={loc => this.handleLocationChange(loc)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className={sidebarCard === '' ? "col-md-12" : "col-md-8"}>
                                    {mainSection}
                                </div>
                                <div className="col-md-4">
                                    {sidebarCard}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="clearfix"></div>
                </ServerOrderWrapper>
            </FontWrapper>
        );
    }
}

export default ServerOrder
