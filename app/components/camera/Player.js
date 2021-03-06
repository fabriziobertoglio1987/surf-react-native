import React, { Component } from 'react';
import { Dimensions, StyleSheet, Button, View, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import UploadButton from './../buttons/UploadButton';
import CancelButton from './../buttons/CancelButton';
import Video from 'react-native-video';
import SafeArea from '../SafeArea';
import { uploadVideo } from '../../lib/api';
import Api from '../../lib/api';

export default class Player extends React.Component {
  constructor(props) {
    super(props)
    const { credentials } = this.props
    this.state = { processing: false, url: null, poster: null }
    this.api = new Api(credentials)
  }
  
  get data() {
    const { uri, codec = "mp4" } = this.props.video
    const type = `video/${codec}`
    const data = new FormData()
    data.append("file", { 
      name: 'my_video', 
      uri,
      type
    })
    data.append("upload_preset", "azmsaq1v")
    return data
  }
  
  get post() {
    const { latitude, longitude } = this.props
    const { url = "", poster = "" } = this.state
    return { 
      post: { 
        latitude, 
        longitude, 
        video: { url, poster }
      }
    }
  }
  
  _uploadVideo = async () => {
    this.setState({ processing: true })
    var response = await uploadVideo(this.data)
    var json = await response.json()
    const { secure_url, format } = json
    const url = secure_url.replace(format, "mp4")
    const poster = secure_url.replace(format, "png")
    this.setState({ processing: false, url, poster })
  }
  
  componentDidUpdate = async (prevProp, prevState) => {
    const { processing } = this.state
    const processing_finished = prevState.processing == true && !processing
    if (processing_finished) {
      this.api.createPost(this.post)
      this.setState({ url: null, poster: null, post: null })
      this.props.setVideo(true)
    }
  }

  render() {
    const { processing } = this.state
    const { setVideo, video } = this.props
    const { uri, codec = "mp4" } = video
    const height = Dimensions.get('window').height
    return (
      <React.Fragment>
        <Spinner
          visible={processing}
          textContent={'Processing...'}
          textStyle={styles.spinnerTextStyle}
        />
        <SafeArea> 
          <UploadButton 
            upload={this._uploadVideo} />
          <CancelButton 
            setVideo={setVideo} />
          <Video
            source={{uri: uri}}
            posterResizeMode="cover"
            resizeMode="cover"
            muted
            repeat
            controls={false}
            style={{height: height}}
          />
        </SafeArea>
      </React.Fragment>
    )
  }
}

export const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
});
