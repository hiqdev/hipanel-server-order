import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import {FormattedMessage, injectIntl} from 'react-intl'
import styled from 'styled-components'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from 'react-responsive-carousel'
import {isEmpty, sortBy, each} from 'underscore';
// import LocationSwitcher from './components/LocationSwitcher'
import ConfigCard from './components/ConfigCard'
import RadioList from './components/RadioList'
import ServerOrderWrapper from './components/ServerOrderWrapper'
import SelectButton from "./components/SelectButton"
import BackToSelectButton from "./components/BackToSelectButton"

const FontWrapper = styled.div`
  font-family: 'Open Sans', sans-serif;
`;

const OrderButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledCarousel = styled(Carousel)`
  .carousel.carousel-slider {
    overflow: visible;
  }
  
  .carousel .slide {
    background-color: white;
  }
  
  .carousel.carousel-slider .control-arrow {
    opacity: 1;
  }
  
  .carousel.carousel-slider .control-arrow:hover {
    background-color: transparent;
  }
  
  .carousel .control-arrow:before, .carousel.carousel-slider .control-arrow:before {
    width: 52px;
    height: 52px;
    border: 1px solid #E0E6ED;
    border-radius: 100px;
    content: " ";
    position: absolute;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 14px 14px;
  }
  
  /*
  .carousel .control-disabled.control-arrow {
    opacity: 1;
    display: initial;
    
    &:before {
      opacity: .4;
    }
  }
  */

  .carousel .control-prev.control-arrow:before {
    background-image: ${props => props.pathToIcons ? `url('${props.pathToIcons}carousel-arrow-left.svg')` : "url('carousel-arrow-left.svg')"};
    left: -87px;
  }

  .carousel .control-next.control-arrow:before {
    background-image: ${props => props.pathToIcons ? `url('${props.pathToIcons}carousel-arrow-right.svg')` : "url('carousel-arrow-right.svg')"};
    right: -87px;
  }
  
  .carousel .control-dots {
    position: absolute;
    bottom: -25px;
    list-style: none;
    display: block;
    text-align: center;
    padding: 0;
    margin: 0;
    width: 100%; 
  }
  .carousel .control-dots li.dot {
    background-color: #8492a5;
    box-shadow: none;
    margin: 0 12px;
  }
  .carousel .control-dots li.dot.selected {
    background-color: #fc6d22;
  }
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

const MainHeaderWrapper = styled.div.attrs(props => ({className: 'col-12 text-center'}))`
  padding: 0px 0 20px;
`;

const LocationSwitcherWrapper = styled.div`
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Separator = styled.div.attrs(props => ({className: 'w-100'}))`
  height: 1px;
  border-top: 1px solid #E0E6ED;
`;

const FeaturedHeader = styled.div`
  font-weight: normal;
  font-size: 22px;
  padding-right: 40px;
`;

const GroupHeader = styled.h4.attrs(props => ({className: 'text-center'}))`
  font-weight: bold;
  font-size: 32px;
  color: #2F3945;
  padding: 2em 0 1em;
`;

const LabelWrapper = styled.div`
  margin-bottom: 30px;
  padding-top: 40px;
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

const chunkArray = (myArray, chunk_size) => {
    let results = [];

    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }

    return results;
};

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
        this.props.registerServerOrderComponent(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.state = Object.assign({}, {
            screenWidth: window.innerWidth,
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
            panel: null,
            softpackOptions: [],
            isOrderActive: false,
            total: 0,
            possibleOsImages: [],
            locationOptions: [
                {
                    name: 'nl',
                    title: <FormattedMessage id='nl' defaultMessage='Netherlands'/>
                },
                {
                    name: 'us',
                    title: <FormattedMessage id='us' defaultMessage='USA'/>
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
        window.addEventListener("resize", this.updateWindowDimensions);
        this.setState({
            configOptions: this.props.configs,
            osImages: this.props.osImages,
            administration: 'managed',
            possibleOsImages: this.props.osImages,
        }, this.setPossibleOsImages);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions)
    }

    updateWindowDimensions() {
        this.setState({screenWidth: window.innerWidth});
    }

    setOsImage() {
        const panel = this.state.panel === 'no_panel' ? null : this.state.panel;
        this.setState(state => {
            if (state.possibleOsImages.length && state.softpack) {
                let osImage = null;
                const images = state.possibleOsImages.filter(image => getOs(image) === state.os);
                for (let i = 0; i < images.length; i++) {
                    const image = images[i];
                    if (image.softpack === null && state.softpack === 'clear' && panel === null) {
                        osImage = image;
                        break;
                    }
                    if (image.softpack !== null && image.softpack.name === state.softpack && image.softpack.panel === panel) {
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
        let panel = this.state.panel === 'no_panel' ? null : this.state.panel;
        if (this.state.administration) {
            osImages = osImages.filter(image => {
                if (this.state.administration === 'managed' && this.state.panel !== null) {
                    return image.softpack && typeof image.softpack.panel === 'string' && image.softpack.panel === panel;
                } else {
                    return image.softpack === null || image.softpack.panel === null;
                }
            })
        }

        this.setState({
            possibleOsImages: osImages,
        }, this.setOsImage);
    }

    getPanelOptions() {
        const administration = this.state.administration;
        const no_panel = {
            name: 'no_panel',
            title: 'no_panel',
            disabled: administration === 'managed',
        };
        let panels = Object.keys(this.props.osImages).map(key => {
            const image = this.props.osImages[key];
            if (image.softpack && typeof image.softpack.panel === 'string') {
                return {
                    name: image.softpack.panel,
                    title: image.softpack.panel,
                    disabled: administration === 'unmanaged',
                };
            }
        });
        panels = panels.filter(el => el != null);
        panels = panels.filter((item, index, self) => index === self.findIndex((t) => (typeof t !== 'undefined' && t.name === item.name)));

        // panels.unshift(no_panel);
        panels = [no_panel];

        return panels;
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
            // {
            //     name: 'managed',
            //     title: <FormattedMessage id='managed'/>,
            //     disabled: !this.props.osImages.some(image => (image.softpack !== null && typeof image.softpack.panel === 'string'))
            // },
        ];
    }

    getSoftpackOptions() {
        let rawSoftpacks = [];
        const no_softpack = {
            name: 'clear',
            title: <FormattedMessage id='no_softpack' defaultMessage='No softpack'/>,
            disabled: false,
        };
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
        // rawSoftpacks.unshift(no_softpack);
        rawSoftpacks = [no_softpack];
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

    setLocation(location) {
        const locations = ['nl', 'us'];
        if (locations.includes(location)) {
            this.handleLocationChange(location);
        }
    }

    handleLocationChange(location) {
        this.setState({
            location: location,
            configId: null,
            label: '',
            osImage: null,
            administration: null,
            softpack: null,
            panel: null,
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
            panel: null,
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

    handlePanelChange(panel) {
        this.setState({panel}, this.setPossibleOsImages);
    }

    handleLabelChange(evt) {
        this.setState({label: evt.target.value});
    }

    render() {
        let mainSection = <Alert msgId='select_location'/>, sidebarCard = '';
        const {
            location, configId, os, administration, softpack, panel, action, configOptions, label, osImage, locationOptions, language
        } = this.state;
        const pathToIcons = this.props.pathToIcons;
        if (!isEmpty(configOptions)) {
            each(configOptions, (configs, location) => {
                configOptions[location] = sortBy(configs, 'sort_order');
            })
        }

        if (location && configId) {
            const {intl} = this.props;
            const administrationOptions = this.getAdministrationOptions();
            const osOptions = this.getOsOptions();
            const softpackOptions = this.getSoftpackOptions();
            const panelOptions = this.getPanelOptions();
            const fullConfig = configOptions[location].find(item => parseInt(item.id) === parseInt(configId));
            sidebarCard = (location && configId) ?
                <ConfigCard config={fullConfig} isSideBar={true} {...this.state} osOptions={osOptions}
                            administrationOptions={administrationOptions} softpackOptions={softpackOptions}
                            panelOptions={panelOptions} locationOptions={locationOptions}
                            pathToIcons={pathToIcons}/> : '';
            mainSection = <fieldset>

                <LabelWrapper className="form-group">
                    <label htmlFor="label" className='sr-only'><FormattedMessage id={'server_label'}/></label>
                    <input type="text" className="form-control" name='label' id="label"
                           placeholder={intl.formatMessage({id: 'server_label'})}
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

                <RadioList label="panel" options={panelOptions} current={panel}
                           onInputChange={value => this.handlePanelChange(value)}/>
            </fieldset>;
        } else if (location) {
            if (Object.keys(this.state.configOptions).length && this.state.configOptions.hasOwnProperty(location)) {
                let groups = {};
                const screenWidth = this.state.screenWidth;
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
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12" key={idx}>
                            <ConfigCard config={config} {...this.state} location={location}
                                        onSelectConfig={evt => this.handleSelectConfig(evt)} pathToIcons={pathToIcons}/>
                        </div>
                    ));
                    let chunks = 4, showIndicators = false, showArrows = true;
                    if (screenWidth <= 768) {
                        chunks = 1;
                        showIndicators = true;
                        showArrows = false;
                    } else if (screenWidth <= 992) {
                        chunks = 2;
                        showIndicators = true;
                        showArrows = false;
                    } else if (screenWidth <= 1200) {
                        chunks = 3;
                    }
                    const chunked = chunkArray(configs, chunks).map((rows, ridx) => <div className={'row'}
                                                                                         key={ridx}>{rows}</div>);

                    return (<div className="row" key={idx}>
                        <div className="col-12" style={{marginBottom: '3em'}}>
                            <StyledCarousel showThumbs={false} showStatus={false} showArrows={showArrows}
                                            showIndicators={showIndicators}
                                            pathToIcons={pathToIcons}>{chunked}</StyledCarousel>
                        </div>
                    </div>);
                });
            } else {
                mainSection = ''; //<Alert msgId='no_configurations'/>;
            }
        }

        return (
            <FontWrapper ref={this.cmpRef}>
                <ServerOrderWrapper configId={configId}>
                    <div className="container">
                        <form id="hipanel-server-order" action={`${action}?language=${language}`} method="POST">
                            {/*<div className={classnames({"d-none": configId !== null, 'row': true})}>*/}
                            {/*    <MainHeaderWrapper>*/}
                            {/*        <h2><FormattedMessage id='main_header'/></h2>*/}
                            {/*    </MainHeaderWrapper>*/}
                            {/*    <div className="col-12"><Separator/></div>*/}
                            {/*    <LocationSwitcherWrapper className="col-12">*/}
                            {/*        <FeaturedHeader><FormattedMessage id='featured_dedicated_servers'/></FeaturedHeader>*/}
                            {/*        <div className={classnames({"d-none": configId !== null})}>*/}
                            {/*            <LocationSwitcher locations={locationOptions} currentLocation={location}*/}
                            {/*                              onLocationChange={loc => this.handleLocationChange(loc)}/>*/}
                            {/*        </div>*/}
                            {/*    </LocationSwitcherWrapper>*/}
                            {/*    <div className="col-12"><Separator/></div>*/}
                            {/*</div>*/}
                            <div className="row">
                                <div className={sidebarCard === '' ? "col-12" : "col-sm-12 col-md-8 col-lg-7 col-xl-7"}>
                                    <div className={classnames({"d-none": configId === null})}>
                                        <FeaturedHeader>
                                            <ConfigurationHeaderWrapper><FormattedMessage
                                                id='configuration_setting'/></ConfigurationHeaderWrapper>
                                            <ConfigurationDescWrapper><FormattedMessage
                                                id='configuration_desc'/></ConfigurationDescWrapper>
                                        </FeaturedHeader>
                                    </div>
                                    <div className={classnames({'row': true, "d-none": configId !== null})}>
                                        <div className="col-md-12">
                                            <GroupHeader>
                                                <FormattedMessage id='one_click_install_header'/>
                                            </GroupHeader>
                                            <p className='text-center' style={{width: '65%', margin: '0 auto 4em', color: '#8492A5'}}>
                                                <FormattedMessage id='one_click_install_message'/>
                                            </p>
                                        </div>
                                    </div>
                                    {mainSection}
                                    <OrderButtonWrapper className={classnames({"d-none": configId === null})}>
                                        <OrderButton type="submit" className='btn'>
                                            <FormattedMessage id='order'/>
                                        </OrderButton>
                                        <BackToSelectButton currentLocation={location}
                                                            onBack={location => this.handleLocationChange(location)}/>
                                    </OrderButtonWrapper>
                                </div>
                                <div className="col-sm-12 col-md-4 offset-lg-1 offset-xl-1">
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

ServerOrder.propTypes = {
    registerServerOrderComponent: PropTypes.func
};

export default injectIntl(ServerOrder);
