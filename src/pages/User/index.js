import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
    Container,
    Header,
    Bio,
    Name,
    Avatar,
    Stars,
    Starred,
    Info,
    OwnerAvatar,
    Title,
    Author,
    Loading
} from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name
    });

    constructor(props) {
        super(props);

        this.loadItems = this.loadItems.bind(this);

        this.state = {
            stars: [],
            loading: true,
            isRefreshing: false,
            page: 1
        };
    }

    async componentDidMount() {
        const { page } = this.state;

        this.loadItems(page);
    }

    async loadItems(page) {
        const { navigation } = this.props;
        const { stars, isRefreshing } = this.state;
        const user = navigation.getParam('user');

        const response = await api.get(
            `/users/${user.login}/starred?page=${page}`
        );

        const newStars = isRefreshing
            ? response.data
            : [...stars, ...response.data];

        this.setState({
            stars: newStars,
            page,
            loading: false,
            isRefreshing: false
        });
    }

    refreshList() {
        this.setState(
            {
                isRefreshing: true
            },
            () => {
                this.loadItems(1);
            }
        );
    }

    openWebView(uri) {
        const { navigation } = this.props;

        navigation.navigate('WebView', { uri });
    }

    render() {
        const { navigation } = this.props;
        const { stars, loading, page, isRefreshing } = this.state;

        const user = navigation.getParam('user');

        if (loading) {
            return <Loading />;
        }

        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>

                <Stars
                    data={stars}
                    onRefresh={() => {
                        this.refreshList();
                    }}
                    refreshing={isRefreshing}
                    onEndReachedThreshold={0.2}
                    onEndReached={() => {
                        this.loadItems(page + 1);
                    }}
                    keyExtractor={star => String(star.id)}
                    renderItem={({ item }) => (
                        <Starred
                            onPress={() => {
                                this.openWebView(item.html_url);
                            }}
                        >
                            <OwnerAvatar
                                source={{ uri: item.owner.avatar_url }}
                            />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.login}</Author>
                            </Info>
                        </Starred>
                    )}
                />
            </Container>
        );
    }
}

User.propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func,
        navigate: PropTypes.func
    }).isRequired
};
