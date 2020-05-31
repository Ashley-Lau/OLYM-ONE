import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientButton = props => (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress} activeOpacity={.9}>
        <LinearGradient style = {styles.container} colors ={props.colors}>
            <Text style={styles.text}>{props.children}</Text>
        </LinearGradient>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        elevation: 5,
    },
    text: {
        fontSize: 20,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: 'white',
        textAlign: 'center'
    }
})

export default GradientButton
