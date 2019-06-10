(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{11:function(e,t){},15:function(e,t,a){a(16),e.exports=a(43)},32:function(e,t){},38:function(e,t){},43:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),o=a(10),l=a(1),r=a(13),s=a.n(r),c=a(14),u=a.n(c),m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e};var p=[{name:"nl",label:i.a.createElement(l.a,{id:"nl",defaultMessage:"Netherlands"})},{name:"us",label:i.a.createElement(l.a,{id:"us",defaultMessage:"USA"})}],d=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},f=function(e){var t="";return e?(e.packages.map(function(e){t+=e.name+" "+e.version+" + "}),t.replace(new RegExp("[\\s+]*$"),"")):null},g=i.a.createElement("div",{className:"alert alert-warning text-center"},i.a.createElement(l.a,{id:"select_locaction",defaultMessage:"Select location"})),h=i.a.createElement("div",{className:"alert alert-warning text-center"},i.a.createElement(l.a,{id:"no_configurations",defaultMessage:"No configurations found"})),b=i.a.createElement("h3",null,i.a.createElement(l.a,{id:"text.header"})),v=i.a.createElement("p",null,i.a.createElement(l.a,{id:"text.paragraph"})),E=i.a.createElement("label",{htmlFor:"label"},i.a.createElement(l.a,{id:"label",defaultMessage:"Label"})),y=function(e){function t(a){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,a));return n.state=Object.assign({},{actions:null,location:"usa",configId:null,label:"",osimage:null,administration:null,softpack:null,isOrderActive:!1,total:0,configOptions:[],imageOptions:[],administrationOptions:[],softpackOptions:[]},a.initialStates),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentDidUpdate=function(e,t,a){t.osimage!=this.state.osimage&&(this.buildAdministration(),this.buildSoftpacks())},t.prototype.componentDidMount=function(e,t,a){var n=this,i=Object.keys(this.props.osImages).map(function(e){var t=n.props.osImages[e];return{name:t.name,title:t.title,disabled:!1}});this.setState({configOptions:this.props.configs,imageOptions:i},function(){n.buildAdministration(),n.buildSoftpacks()})},t.prototype.getCurrentImage=function(){var e=this,t=null;return this.state.osimage&&Object.values(this.props.osImages).forEach(function(a){a.name===e.state.osimage&&(t=a)}),t},t.prototype.buildAdministration=function(){var e=this.getCurrentImage(),t=[{name:"managed",title:"Managed",disabled:null!==e&&(e.softpack&&"HiPanel"===e.softpack.panel)},{name:"unmanaged",title:"Unmanaged",disabled:null!==e&&(null===e.softpack||"HiPanel"!==e.softpack.panel)}];this.setState({administrationOptions:t})},t.prototype.buildSoftpacks=function(){var e=[];for(var t in this.props.osImages){var a=this.props.osImages.hasOwnProperty(t)?this.props.osImages[t]:null,n=this.getCurrentImage();a&&a.softpack?e.push({name:a.softpack.name,title:a.softpack.name.toUpperCase(),disabled:!(n&&n.softpack&&n.softpack.name===a.softpack.name)}):e.push({name:"clear",title:"No softpack",disabled:!1})}var i=e.filter(function(e,t,a){return t===a.findIndex(function(t){return t.place===e.place&&t.name===e.name})});this.setState({softpackOptions:Object.assign(i)})},t.prototype.handleLocationChange=function(e){this.setState({location:e,configId:null,label:"",osimage:null,administration:null,softpack:null,isOrderActive:!1})},t.prototype.handleSelectConfig=function(e){this.setState({configId:e,label:"",osimage:null,administration:null,softpack:null,isOrderActive:!1,total:this.state.configOptions[this.state.location].find(function(t){return parseInt(t.id)===parseInt(e)}).price})},t.prototype.handleImage=function(e){this.setState({osimage:e})},t.prototype.handleAdministration=function(e){var t=this.state.total,a=this.state.administration;"managed"!==e||"unmanaged"!==a&&null!=a?"unmanaged"===e&&"managed"===a&&(t-=100):t+=100,this.setState({administration:e,total:t})},t.prototype.handleSoftPack=function(e){this.setState({softpack:e})},t.prototype.handleLabelChange=function(e){this.setState({label:e.target.value})},t.prototype.render=function(){var e=this,t=g,a="",n=this.state.location,o=this.state.configId,l=this.state.isOrderActive;if(n&&(t=Object.keys(this.state.configOptions).length&&this.state.configOptions[n].length?this.state.configOptions[n].map(function(t,a){return i.a.createElement("div",{className:"col-md-4",key:a},i.a.createElement(_,m({config:t},e.state,{location:n,onSelectConfig:function(t){return e.handleSelectConfig(t)}})))}):h),this.state.osimage&&this.state.administration&&this.state.softpack&&(l=!0),n&&o){var r=this.state.configOptions[n].find(function(e){return parseInt(e.id)===parseInt(o)});t=i.a.createElement("fieldset",{className:"col-md-9"},b,v,i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-md-9"},i.a.createElement("div",{className:"form-group"},E,i.a.createElement("input",{type:"text",className:"form-control",name:"label",id:"label",value:this.state.value,onChange:function(t){return e.handleLabelChange(t)}})))),i.a.createElement("input",{type:"hidden",id:this.props.token.name,name:this.props.token.name,value:this.props.token.value}),i.a.createElement("input",{type:"hidden",id:"object_id",name:"object_id",value:o}),i.a.createElement(M,{label:"osimage",options:this.state.imageOptions,current:this.state.osimage,onInputChange:function(t){return e.handleImage(t)}}),i.a.createElement(M,{label:"administration",options:this.state.administrationOptions,current:this.state.administration,onInputChange:function(t){return e.handleAdministration(t)}}),i.a.createElement(M,{label:"softpack",options:this.state.softpackOptions,current:this.state.softpack,onInputChange:function(t){return e.handleSoftPack(t)}})),a=i.a.createElement(_,{config:r,imageOptions:this.state.imageOptions,administrationOptions:this.state.administrationOptions,softpackOptions:this.state.softpackOptions,isSideBar:!0,isOrderActive:l,currency:this.state.currency,language:this.state.language,label:this.state.label,osimage:this.state.osimage,administration:this.state.administration,softpack:this.state.softpack,location:n,total:this.state.total,currentImage:this.getCurrentImage()})}return i.a.createElement("form",{id:"hipanel-server-order",action:this.state.action,method:"POST"},i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-md-9"},i.a.createElement("div",{className:"row"},t)),i.a.createElement("div",{className:"col-md-3"},i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-md-12"},i.a.createElement(O,{locations:p,currentLocation:this.state.location,onLocationChange:function(t){return e.handleLocationChange(t)}})),i.a.createElement("div",{className:"col-md-12",style:{marginTop:"1em"}},a)))))},t}(n.Component);function O(e){var t=function(t){e.onLocationChange(t.currentTarget.dataset.location)};return i.a.createElement("div",{className:"btn-group btn-group-justified"},e.locations.map(function(a,n){return i.a.createElement("label",{className:"btn btn-default "+(a.name===e.currentLocation?"active":""),key:n,"data-location":a.name,onClick:t},a.label)}))}var k=i.a.createElement("br",null),w=i.a.createElement("br",null),S=i.a.createElement("b",null,i.a.createElement(l.a,{id:"label",defaultMessage:"Label"}),": "),N=i.a.createElement("hr",null),I=i.a.createElement(l.a,{id:"order",defaultMessage:"Order"}),C=i.a.createElement(l.a,{id:"select",defaultMessage:"Select"});function _(e){var t=!1,a=null,n=null;return e.isSideBar?(t=!0,a=e.total,n=e.label):a=e.config.price,i.a.createElement("div",{className:"panel panel-default"},i.a.createElement("div",{className:"panel-heading"},e.config.name),i.a.createElement("div",{className:"panel-body"},e.config.descr,k,w,i.a.createElement("input",{type:"hidden",id:"tariff_id",name:"tariff_id",value:e.config[e.location+"_tariff_id"]}),i.a.createElement("ul",{className:"list-unstyled"},n?i.a.createElement("li",null,S," ",i.a.createElement("span",null,n)):"",i.a.createElement(A,{options:e.imageOptions,input:e.osimage,label:"osimage"}),i.a.createElement(A,{options:e.administrationOptions,input:e.administration,label:"administration"}),i.a.createElement(A,{options:e.softpackOptions,input:e.softpack,label:"softpack"}),i.a.createElement(x,e)),N,i.a.createElement("div",{className:"text-center text-muted"},a.toLocaleString(e.language,{style:"currency",currency:e.config.currency}))),i.a.createElement("div",{className:"panel-footer"},t?i.a.createElement("button",{type:"submit",className:"btn btn-success btn-block",disabled:!e.isOrderActive},I):i.a.createElement("button",{type:"button",className:"btn btn-primary btn-block","data-config":e.config.id,onClick:function(t){e.onSelectConfig(t.currentTarget.dataset.config)}},C)))}var j=i.a.createElement("b",null,i.a.createElement(l.a,{id:"software",defaultMessage:"Software"}),":");function x(e){var t=e.softpack,a=e.currentImage;if(null===t||"clear"===t)return null;var n=f(a.softpack);return i.a.createElement("li",null,j," ",i.a.createElement("span",null,n))}function M(e){var t=e.current,a=function(e,t){var a={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(a[n]=e[n]);return a}(e,["current"]),o=function(e){a.onInputChange(e.target.value)};-1===a.options.map(function(e){return e.disabled?null:e.name}).indexOf(t)&&(t=null),null===t&&(t=a.options.reduce(function(e,t){return null!==e||t.disabled?e:t.name},null),Object(n.useEffect)(function(){a.onInputChange(t)}));var r=a.options.map(function(e,n){return i.a.createElement("div",{className:"radio radio-"+a.label+(!0===e.disabled?" disabled":""),key:n},i.a.createElement("label",null,i.a.createElement("input",{type:"radio",name:a.label.toLowerCase(),value:e.name,onChange:o,checked:t===e.name,disabled:!0===e.disabled?"disabled":""}),e.title))});return i.a.createElement("div",{className:"form-group"},i.a.createElement("label",null,i.a.createElement(l.a,{id:a.label,defaultMessage:d(a.label)})),r)}function A(e){var t=e.input,a=e.options,n=e.label;if(!t)return null;var o=a.find(function(e){return e.name===t});return i.a.createElement("li",null,i.a.createElement("b",null,i.a.createElement(l.a,{id:n,defaultMessage:d(n)}),": ")," ",i.a.createElement("span",null,o.title))}var L=y;Object(l.c)([].concat(u.a,s.a));Object(o.render)(i.a.createElement(l.b,{locale:window.hipanel_order_server.initialStates.language,messages:{en:{"text.header":"Make your server even more powerful","text.paragraph":"Select the technical details and the type of maintenance of your dedicated server. Immediately after placing the order, we will contact you to confirm it and connect your project to the service."},ru:{"text.header":"Сделайте ваш сервер еще мощнее","text.paragraph":"Выберите технические детали и тип обслуживания выделенного сервера. Сразу после размещения заказа мы свяжемся с вами для подтверждения и подключения вашего проекта к услуге.",nl:"Нидерланды",us:"США",label:"Заметка",administration:"Администрирование",softpack:"Софт",osimage:"Образ",order:"Заказать",select:"Выбрать",select_locaction:"Выбирите локацию",no_configurations:"Нет конфигураций",software:"Программное обеспечение"}}[window.hipanel_order_server.initialStates.language]},i.a.createElement(L,window.hipanel_order_server)),document.querySelector("#server-order-app"))}},[[15,2,1]]]);
//# sourceMappingURL=app.f8419195.js.map