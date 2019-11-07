import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Swell from '../forecast/Swell';
import Wind from '../forecast/Wind';
import Arrow from '../icons/Arrow';
import MenuButton from '../buttons/MenuButton';
import FlagButton from '../buttons/FlagButton';
import Menu from '../Menu';
import { header } from '../forecast/styles';

const Menu = require('react-native-side-menu');

class ContentView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+Control+Z for dev menu
        </Text>
      </View>
    );
  }
}

export default class Hourly extends Component {
  renderMenu() {
    console.warn('renderMenu');
  }

  onFlagPress = () => {
    const { navigation, post } = this.props
    navigation.navigate("Flag", { post: post })
  }

  renderHourly(hourly) {
    const { 
      waveHeight, swellHeight, swellPeriod, 
      optimal_swell, swellDirection, swellDirectionInWord, 
      windSpeed, windDirection, optimal_wind, windDirectionInWord,
    } = hourly
    return (
      <React.Fragment>
        <Swell
          period={swellPeriod} 
          swellHeight={swellHeight} 
          styles={[
            header.text,
            header.shadowHeader,
          ]}
        />
        <Wind 
          windSpeed={windSpeed}
          styles={[
            header.text,
            header.shadowHeader, 
          ]}
        />
      </React.Fragment>
    )
  }

  render() {
    const { location, post } = this.props
    const { reported } = post
    const iconColor = reported ? "red" : "white"
    const { name, forecast_info: { hourly, tide_data }} = location
    const { swellHeight } = hourly
    const menu = <Menu navigator={navigator}/>;
    return (
      <React.Fragment>
        <Menu menu={menu}>
        <View style={styles.container}>
          <MenuButton 
            action={this.renderMenu}
          />
          <FlagButton 
            action={this.onFlagPress} 
            style={iconColor}
          />
          <Text style={[
            header.shadowHeader,
            header.text,
          ]}>
            { name }
          </Text>
          { !!swellHeight && this.renderHourly(hourly) }
        </View>
        </Menu>
      </React.Fragment>
    )
  }
}

const has_notch = DeviceInfo.hasNotch()
export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: has_notch ? 0 : 30,
    width: "100%",
    zIndex: 4,
    height: 90,
  }, 
})
