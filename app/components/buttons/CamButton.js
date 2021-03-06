import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function CamButton({ action, index, selected }) {
  const is_selected = index == selected
  const color = is_selected ? styles.highlight : styles.normal
  return (
    <React.Fragment>
      <TouchableOpacity 
        style={[
          styles.button,
          color
        ]}
        onPress={() => action(index)}
      >
        <Text
          style={styles.text}>
          CAM { index + 1 } 
        </Text>
      </TouchableOpacity>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 70,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 2,
  }, 
  highlight: {
    borderColor: '#e6e6e6',
    backgroundColor: '#66ff66',
    borderWidth: 1,
  },
  normal: {
    borderColor: 'white',
    borderWidth: 2,
  },
  text: {
    color: 'white',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1,
    // zIndex:2,
  }
})
