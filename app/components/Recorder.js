import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Dimensions from 'Dimensions';
import RecordingButton from './RecordingButton';
import UploadButton from './UploadButton';
import Player from './Player';
import api from '../lib/api';
import { getGps } from '../lib/support';

export default class Recorder extends Component {
  constructor(props) {
    super(props)
    this.state = { latitude: null, longitude: null, recording: false, highlight: false, locations: [], video: "" }
  }

  get options() {
    return {
        quality: 0.5,
        fixOrientation: true,
        forceUpOrientation: true,
        videoOrientation: 1,
        deviceOrientation: 1,
        mute: true,
        mirrorVideo: false,
        maxDuration: 300,
      }
  }

  get message() {
    return `Looks like you are very far from any surf destination, 
            only videos that are taken at a surfspot present 
            in our database are accepted. Sorry!`
  }

  get params() {
    const { latitude, longitude } = this.state
    return {
      latitude,
      longitude,
    }
  }

  componentDidMount = async () => {
    const { latitude, longitude } = this.state
    getGps(this._setLocation)
  }

  componentDidUpdate = async (prevProp, prevState) => {
    const { recording, latitude, longitude } = this.state
    const is_recording = prevState.recording == false && recording
    const latitude_updated = prevState.latitude != latitude
    const longitude_updated = prevState.longitude != longitude
    const location_updated = latitude_updated && longitude_updated
    api.params = this.params
    if (is_recording) {
      this.interval = setInterval(() => this.setState({
        highlight: !this.state.highlight
      }), 900)
      const video  = await this.camera.recordAsync(this.options)
      this.setState({ video })
    }
    if (location_updated) {
      var response = await api.getLocations(latitude, longitude, 1, 1)
      var location = await response.json()[0]
      this.setState({ location })
    }
  }

  _setLocation = ({ latitude, longitude }) => {
    this.setState({ latitude, longitude })
  }

  _setVideo = () => {
    this.setState({ video: null })
  }

  _startRecording = async function() {
    const { recording } = this.state;
    this.setState({ recording: !recording });
  }

  _stopRecording = async () => {
    clearInterval(this.interval) 
    this.setState({ highlight: false, recording: false })
    this.camera.stopRecording()
  }

  _recording = () => {
    const { recording, location } = this.state
    if (!!location) { 
      alert(this.message) 
      return
    }
    recording ? this._stopRecording() : this._startRecording()
  }

  _renderCamera() {
    const { highlight } = this.state
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
          <RecordingButton 
            recording={this._recording}
            highlight={highlight}
          />
      </RNCamera>
    )
  }

  render() {
    const { video, longitude, latitude } = this.state
    return (
      <React.Fragment>
        { video ?  
          <Player 
            longitude={longitude} 
            latitude={latitude} 
            video={video} 
            api={api}
            deleteVideo={this._setVideo}
            /> 
          : this._renderCamera() 
        }
      </React.Fragment>
    )
  }
}

export const styles = StyleSheet.create({
  preview: {
    height: Dimensions.get('window').height,
    width: "100%",
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: 'transparent',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  },
});
