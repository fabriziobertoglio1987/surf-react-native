import React, { Component } from 'react';
import { FlatList, View, Text, Alert, TouchableOpacity, Image } from 'react-native';
import { Card } from 'native-base';
import Post from './Post';
import Forecast from './Forecast';
import ProfileButton from './ProfileButton';
import MapButton from './MapButton';
import CameraButton from './CameraButton';
import { getGps } from '../lib/support';
import api from '../lib/api';

export default class Posts extends Component {
  constructor(props){
    super(props);
    this.state = { posts: [], page: 0, refreshing: false, latitude: '', longitude: '', locations: [] };
    this.count = 0
    this.timer_on = 0;
  }

  get params() {
    const { latitude, longitude, page } = this.state
    return { 
      latitude, 
      longitude, 
      page, 
    }
  }

  _setGps = ({ latitude, longitude }) => {
    this.setState({ latitude, longitude })
  }

  _setLocations = async () => {
    const { post, page } = this.state
    var response = await api.getLocations()
    var json = await response.json()
    this.setState({ locations: json })
  }

  _setPosts = async () => {
    const { posts, page } = this.state
    const { loaded } = this.props
    const new_page = page + 1
    await this.setState({ page: new_page, refreshing: true })
    api.page = new_page
    const response = await api.getPosts()
    const json = await response.json()
    await this.setState({ posts: [...posts, ...json], refreshing: false })
    loaded()
  }

  componentDidMount() {
    const { posts } = this.state
    const missing_posts = posts.length == 0
    getGps(this._setGps)
  }

  componentDidUpdate = async (prevProp, prevState) => {
    const { locations, latitude, longitude, page } = this.state
    const repeat_request = locations.length == 0 && this.count < 4
    const latitude_change = prevState.latitude != latitude
    const longitude_change = prevState.longitude != longitude
    const gps_updated = latitude_change && longitude_change
    const find_locations = gps_updated && !this.timer_on
    const page_updated = prevState.page != page
    api.params = this.params
    if(find_locations) { 
      this.timer_on = 1
      this.timedRequest()
    }
    if(gps_updated || page == 0) {
      this._setPosts()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer_on = 0;
  }

  timedRequest = async () => {
    const { locations, latitude, longitude } = this.state
    const locations_missing = locations.length == 0
    const repeat_request = this.count < 4 && locations_missing
    if(repeat_request) { 
      await this._setLocations({ latitude, longitude })
      this.timer = setTimeout(() => this.timedRequest(), 1000);
      this.count = this.count + 1;
    }
  }

  _handleRefresh = () => {
    this.setState({
      page: 0, posts: []
    });
  }

  _onEndReached = () => {
    const { refreshing } = this.state
    if(!refreshing) { this._setPosts() }
  };

  renderCard(item, index) {
    const { navigation } = this.props
    const { posts, locations } = this.state
    return (
      <Card trasparent style={{flex: 1}}>
        <TouchableOpacity onPress={() => navigation.navigate("Nearby", { locations: locations }) }>
          <Forecast locations={locations} index={index} />
        </TouchableOpacity>
        <Post key={index} post={item} index={index} navigation={navigation} />
      </Card>
    )
  }

  render() {
    const { navigation } = this.props;
    const { posts, latitude, longitude, refreshing, locations } = this.state;
    return (
      <React.Fragment>
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString() }
          refreshing={this.state.refreshing}
          onRefresh={this._handleRefresh}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.01}
          extraData={locations}
          renderItem={({ item, index }) => this.renderCard(item, index)}
        />
        <ProfileButton navigation={navigation} />
        <MapButton 
          navigation={navigation} 
          latitude={latitude} 
          longitude={longitude}
        />
        <CameraButton navigation={navigation} />
      </React.Fragment>
    );
  }
}
