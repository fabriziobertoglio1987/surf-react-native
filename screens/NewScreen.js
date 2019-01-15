import React, { Component } from 'react';
import { TouchableOpacity, Text, View, ScrollView, AsyncStorage } from 'react-native';
import { styles } from './NewStyles';
import { RNCamera } from 'react-native-camera';
import { Icon } from 'react-native-elements';
import { host } from '../redux/constants'

export default class NewScreen extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}> 
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
              <TouchableOpacity
                onPress={this.takePicture.bind(this)}
                style = {styles.capture}>
                <Icon
                  containerStyle={styles.buttonAbsolute}
                  name='camera' 
                  color="#4d79ff"
                  reverse={true}
                  size={35}
                  backgroundColor="transparent"
                />                  
              </TouchableOpacity>
            </View>
        </RNCamera>
      </View>
    );
  }


  takePicture = async function() {
    /*
    AsyncStorage.clear()
    this.props.navigation.navigate('Auth')
    */
    const options = { quality: 0.5, base64: false };
    const picture = await this.camera.takePictureAsync(options);
    Uri = picture.uri;
    console.log('picture', picture);
    this.storePicture()
  };

  storePicture = async function(){
    const userToken = await AsyncStorage.getItem('userToken');
    const userEmail = await AsyncStorage.getItem('userEmail'); 
    const formdata = new FormData();
    formdata.append({ post: {path: Uri, name: 'test.jpg', type: 'image/jpg' }})
    // var data = { post: { uri: PicturePath, name: 'selfie.jpg', type: 'image/jpg'}};
    const headers = { Accept: 'application/json', 'Content-Type': 'multipart/form-data;', 'X-User-Email': userEmail, 'X-User-Token': userToken }    
    const config = { method: 'POST', headers: headers, body: formdata }; 
    console.log('config', config)
    const response = await fetch(host + "/posts.json", config)  ``
    console.log(response)
  }
}