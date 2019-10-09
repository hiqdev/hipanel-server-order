module.exports = {
    type: 'react-app',
    babel: {
        plugins: ["@quickbaseoss/babel-plugin-styled-components-css-namespace", 'react-html-attrs']
    },
    webpack: {
        publicPath: '',
    }
};
