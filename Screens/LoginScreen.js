import React from 'react';
import {Keyboard, StyleSheet, View, Image, Button, TouchableWithoutFeedback, ImageBackground, Text} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {Sae} from 'react-native-textinput-effects';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import Styles from "../styling/Styles";
import GradientButton from "../Components/GradientButton";

const LoginScreen = (props) => {
    const navigation = useNavigation()
    return (
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <ImageBackground source = {require('../assets/sunset_running_newstyle.png')} style={Styles.container}>
                <Image style={Styles.logo} source={require("../assets/OLYMONE.png")}/>
                <View style = {style.inputContainer}>
                    <Sae label= {'Username:'}
                         iconClass = {FontAwesome5}
                         iconName = {'user'}
                         iconColor = {'black'}
                         autoCorrect = {false}
                         style = {style.textContainer}
                         labelHeight = {24}
                         inputWidth = {50}
                         inputPadding = {16}
                         labelStyle = {style.labelStyle}
                         inputStyle = {style.textStyle}

                    />
                    <Sae label= {'Password:'}
                         iconClass = {SimpleLineIcons}
                         iconName = {'lock'}
                         iconColor = {'black'}
                         // iconSize = {30}
                         autoCorrect = {false}
                         style = {style.textContainer}
                         labelHeight = {24}
                         inputWidth = {50}
                         inputPadding = {16}
                         labelStyle = {style.labelStyle}
                         inputStyle = {style.textStyle}
                         secureTextEntry={true}


                    />
                <View style={Styles.buttonContainer}>
                    <GradientButton onPress={() => navigation.push('BottomTabs')}
                                    style={style.button}
                                    colors={['rgba(32,151,83,0.85)', 'rgba(12,78,41,0.85)']}>
                        Login
                    </GradientButton>
                    <GradientButton onPress={() => navigation.navigate('SignupScreen')}
                                    style={style.button}
                                    colors={['rgba(32,151,83,0.85)', 'rgba(12,78,41,0.85)']}>
                        Sign Up
                    </GradientButton>
                </View>
            </View>
            </ImageBackground>
        </TouchableWithoutFeedback>)
};

const style = StyleSheet.create({
    inputContainer: {
        backgroundColor: '#ffffff99',
        marginTop: 20,
        width: 300,
        height: 300,
        borderRadius: 10,
        textAlign: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginTop: 10,
        width: 200,
    },
    labelStyle: {
        color: 'black',
        fontSize: 30,

    },
    textStyle: {
        fontSize: 30,
        color: 'black',
    },
    button: {
        width: 100,
    }
})

export default LoginScreen;
