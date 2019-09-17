import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

class MyWebView extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('uri')
    });

    render() {
        const { navigation } = this.props;
        const uri = navigation.getParam('uri');

        return <WebView source={{ uri }} style={{ marginTop: 20 }} />;
    }
}

MyWebView.propTypes = {
    navigation: PropTypes.object.isRequired
};

export default MyWebView;
