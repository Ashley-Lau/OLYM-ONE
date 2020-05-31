import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustButton = props => (
  <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress} activeOpacity={.9}>
    <Text style={styles.text}>{props.children}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E9D3E9',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white',
    textAlign: 'center'
  }
})

export default CustButton;
