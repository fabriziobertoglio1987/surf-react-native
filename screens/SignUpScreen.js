import React from 'react';
import { Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { styles } from './styles';
import { host, headers } from '../redux/constants.js';
import { ErrorMessage } form './StatelessComponents'

export default class SignUpScreen extends React.Component {
  static navigationOptions = { title: 'Sign Up', };
  state = { email: '', password: '', errors: '' };

  createUserRegistration = async () => {
    const { navigation } = this.props;
    const { email, password } = this.state;
    try {
      // const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', }
      const body = JSON.stringify({ user: { email: email, password: password, }})
      const options = { method: 'POST', headers: headers, body: body,}
      let response = await fetch(host + '/users', options );
      
      // ({user: { email: 'ezio@email.com', password: 'fabrizio', }}),});
      const responseJson = await response.json();
      console.log(response);
      if (response.status == "200") { 
        await AsyncStorage.setItem('userToken', responseJson.authentication_token); 
        console.log(response);
        navigation.navigate('App');
      }
      if (response.status == "422") {
        const messages = "";
        for (var element in responseJson) { errors += `the field ${element} ${responseJson[element]}, ` }
        this.setState({ errors: messages });
        console.log(this.state.errors);
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { email, password, errors } = this.state;
    const { navigation } = this.props;
    return (
      <React.Fragment>    
        { errors ? <ErrorMessage message={errors} /> : null }
        <View style={styles.container}>
          <Text>Sign Up</Text>
          <Input
            placeholder="Email"
            autocapitalize="none"
            style={styles.textInput}
            onChangeText={text => this.setState({ email: text })}
            value={email}
          />
          <Input
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={text => this.setState({ password: text })}
            value={password}
          />
          <Button
            title="Sign Up"
            onPress={this.createUserRegistration}
            buttonStyle={styles.button}
          />
          <Button
            title="Already have an account? Login"
            onPress={() => navigation.navigate('SignIn')}
            buttonStyle={styles.button}
          />
        </View>      
      </React.Fragment>
    );
  }
}
