import React, { Component } from 'react';
import { StyleSheet, Platform, StatusBar, Dimensions, View, Text } from 'react-native';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-community/async-storage';
import { Input, Button } from 'react-native-elements';
import { styles } from './styles';
import ErrorMessage from '../components/ErrorMessage'
import Message from '../lib/message'
import { createResource } from '../lib/api'
import { sessionSettings } from '../lib/support'
import SignInButton from '../components/buttons/SignInButton'
import GoogleButton from '../components/buttons/GoogleButton'
import { getAsset } from '../lib/support'
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from 'react-native-dotenv';

export default class AuthenticationScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const header = Platform.OS == "android" ? 10 : 0
    return {
      title: 'Authenticate',
      headerTintColor: 'white',
      headerTransparent: true,
      headerStyle: { marginTop: header }, 
    };
  }

  state = { email: '', password: '', errors: '' };

  constructor(props) {
    super(props)
  }

  saveCredentials = async (json) => {
    const { navigation } = this.props;
    await AsyncStorage.setItem('userToken', json.authentication_token);
    await AsyncStorage.setItem('userEmail', json.email);
    await AsyncStorage.setItem('imperial', 'true');
    navigation.navigate('App');
  }

  submitForm = async (settings) => {
    const { email, password } = this.state
    const body = JSON.stringify({ user: { email, password } })
    createResource(this.saveCredentials, this.setErrors, body, settings)
  }

  setErrors = (obj) => {
    const errors = new Message(obj).errors
    this.setState({ errors });
  }

  render() {
    const { email, password, errors } = this.state;
    const { navigation } = this.props;
    const height = Dimensions.get("window").height;
    return (
      <React.Fragment>
        <Video 
          source={getAsset("costline-max.mp4")}
          poster={getAsset("costline-poster-max.png")}
          posterResizeMode={"cover"}
          resizeMode={"cover"}
          style={{height: height}}
          repeat 
          muted />
          <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.container}>
          <Input
            inputContainerStyle={{borderBottomColor: "white"}}
            inputStyle={{color: 'black'}}
            placeholderTextColor="white"
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={text => this.setState({ email: text })}
            value={email} 
            textID='email'
          />
          <Input
            secureTextEntry
            inputContainerStyle={{borderBottomColor: "white"}}
            inputStyle={{color: 'black'}}
            placeholderTextColor="white"
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={text => this.setState({ password: text })}
            value={password} />
          { errors ? <ErrorMessage message={errors} /> : null }
          <SignInButton 
            submitForm={this.submitForm}
            setErrors={this.setErrors} />
            <GoogleButton 
              saveCredentials={this.saveCredentials} 
              setErrors={this.setErrors}
            />
          <Text style={style1.text}>Goodbye Sergey</Text>
        </View>
      </React.Fragment>
    );
  }
}

const style1 = StyleSheet.create({
  text: {
    fontSize: 4,
    position: 'absolute',
    bottom: 30,
    width: "100%",
    textAlign: 'center',
    color: 'white', 
  }
})
