import React,{useState} from 'react';
import {Keyboard, StyleSheet, View, Image, TouchableWithoutFeedback, ImageBackground, Text} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {Sae} from 'react-native-textinput-effects';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {AppLoading} from 'expo';
import {Asset} from "expo-asset";

import Styles from "../styling/Styles";
import GradientButton from "../Components/GradientButton";

const LoginScreen = (props) => {
    const navigation = useNavigation()
    const [loaded, setLoaded] = useState(false);


    const backSunset = require("../assets/sunset_running_newstyle.png");
    const logo = require("../assets/OLYMONE.png")

    // images dont load until the animation is being loaded
    // animation takes longer to load
    const getImages = () => {
        return Asset.loadAsync(backSunset);
        // setTimeout(()=>{}, 1000);
    }


    if(loaded){
        return (
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
                <ImageBackground source = {backSunset} style={Styles.container}>
                    <Image style={Styles.logo} source={logo}/>
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
                            <GradientButton onPress={() => navigation.navigate('ProfileStack')}
                                            style={style.button}
                                            colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                                Sign Up
                            </GradientButton>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableWithoutFeedback>);
    } else {
        return (
        <AppLoading
            startAsync={getImages}
            onFinish={() => setLoaded(true)}
        />


        )
    }



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
        height: 45,
    }
})

export default LoginScreen;
