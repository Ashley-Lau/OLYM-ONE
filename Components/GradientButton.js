import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientButton = props => (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress} activeOpacity={.9}>
        <LinearGradient style = {{borderRadius: 22.5, flex: 1, justifyContent: 'center', alignItems: 'center'}} colors ={props.colors}>
            <Text style={{...styles.text,...props.textStyle}}>{props.children}</Text>
        </LinearGradient>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: {
        borderRadius: 100,
        elevation: 5,
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.27,
    },
    text: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default GradientButton
