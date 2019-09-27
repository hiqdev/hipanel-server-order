import React from 'react'
import classnames from 'classnames'
import {FormattedMessage} from 'react-intl'
import styled from 'styled-components'
import LocationSwitcher from './components/LocationSwitcher'
import ConfigCard from './components/ConfigCard'
import RadioList from './components/RadioList'
import ServerOrderWrapper from './components/ServerOrderWrapper'
import SelectButton from "./components/SelectButton";
import BackToSelectButton from "./components/BackToSelectButton";

const FontWrapper = styled.div`
  font-family: 'Open Sans', sans-serif;
`;

const OrderButtonWrapper = styled.div`

`;

const OrderButton = styled(SelectButton)`
  width: 270px;
`;

const ConfigurationHeaderWrapper = styled.h2`
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 130%;
  color: #2F3945;
  margin-bottom: 25px;
`;

const ConfigurationDescWrapper = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 170%;
  color: #8492A5;
`;

const MainHeaderWrapper = styled.div.attrs(props => ({className: 'col-xs-12 text-center'}))`
  padding: 0px 0 20px;
`;

const LocationSwitcherWrapper = styled.div`
  height: 80px;
  border-bottom: 1px solid #E0E6ED;
  border-top: 1px solid #E0E6ED;
  padding-bottom: 11px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const FeaturedHeader = styled.div`
  font-weight: normal;
  font-size: 22px;
  padding-right: 40px;
`;

const GroupHeader = styled.h4.attrs(props => ({className: 'col-xs-12 text-center'}))`
  font-weight: bold;
  font-size: 32px;
  color: #2F3945;
  margin: 2em 0 1em;
`;

const LabelWrapper = styled.div`
  margin-bottom: 30px;
  padding-top: 72px;
  padding-bottom: 10px;
  
  input:focus::-webkit-input-placeholder { color:transparent; }
  input:focus:-moz-placeholder { color:transparent; } /* FF 4-18 */
  input:focus::-moz-placeholder { color:transparent; } /* FF 19+ */
  input:focus:-ms-input-placeholder { color:transparent; } /* IE 10+ */
  .form-control:focus {
    border-color: transparent;
    outline: 0;
    box-shadow: none;
    border-bottom: 1px solid #E0E6ED;
  }
  input {
    display: block;
    height: 39px;
    margin: auto;
    background-color: transparent;
    color: #38474e;
    border: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid #E0E6ED;
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
                name: 'unmanaged',
                title: <FormattedMessage id='unmanaged'/>,
                disabled: !this.props.osImages.some(image => (image.softpack === null || image.softpack.panel === null))
            },
            {
                name: 'managed',
                title: <FormattedMessage id='managed'/>,
                disabled: !this.props.osImages.some(image => (image.softpack !== null && typeof image.softpack.panel === 'string'))
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
            total += parseFloat(this.state.configObj.monthly_support_time);
        } else if (administration === 'unmanaged' && currentState === 'managed') {
            total -= parseFloat(this.state.configObj.monthly_support_time);
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
                        <div className="col-md-3" key={idx}>
                            <ConfigCard config={config} {...this.state} location={location}
                                        onSelectConfig={evt => this.handleSelectConfig(evt)}/>
                        </div>
                    ));
                    return (<div className="row" key={idx}>
                        <GroupHeader>{groupName}</GroupHeader>
                        {configs}
                    </div>);
                });
            } else {
                mainSection = <Alert msgId='no_configurations'/>;
            }
        }

        return (
            <FontWrapper ref={this.cmpRef}>
                <ServerOrderWrapper configId={configId}>
                    <div className="container">
                        <form id="hipanel-server-order" action={action} method="POST">
                            <div className={classnames({"hidden": configId !== null, 'row': true})}>
                                <MainHeaderWrapper>
                                    <h2><FormattedMessage id='main_header'/></h2>
                                </MainHeaderWrapper>
                                <LocationSwitcherWrapper className="col-md-12">
                                    <FeaturedHeader><FormattedMessage id='featured_dedicated_servers'/></FeaturedHeader>
                                    <div className={classnames({"hidden": configId !== null})}>
                                        <LocationSwitcher locations={locationOptions} currentLocation={location}
                                                          onLocationChange={loc => this.handleLocationChange(loc)}/>
                                    </div>
                                </LocationSwitcherWrapper>
                            </div>
                            <div className="row">
                                <div className={sidebarCard === '' ? "col-md-12" : "col-md-8"}>
                                    <div className={classnames({"hidden": configId === null})}>
                                        <FeaturedHeader>
                                            <ConfigurationHeaderWrapper><FormattedMessage id='configuration_setting'/></ConfigurationHeaderWrapper>
                                            <ConfigurationDescWrapper><FormattedMessage id='configuration_desc'/></ConfigurationDescWrapper>
                                        </FeaturedHeader>
                                    </div>
                                    {mainSection}
                                    <OrderButtonWrapper className={classnames({"hidden": configId === null})}>
                                        <OrderButton type="submit" className='btn'>
                                            <FormattedMessage id='order'/>
                                        </OrderButton>
                                        <BackToSelectButton currentLocation={location} onBack={location => this.handleLocationChange(location)}/>
                                    </OrderButtonWrapper>
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
