import React from 'react';
import {View, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard} from 'react-native';

import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const SkyscrapperBackground = props => {
    return (<TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <View style = {style.container}>
                <ImageBackground style={style.image} source={require('../assets/BrownSkyline.png')}>
                    {props.children}
                </ImageBackground>
             </View>
        </TouchableWithoutFeedback>
    );
}

const style = StyleSheet.create({
        container: {
            flex:1,
            minHeight: Platform.OS === 'android' ? hp("97%") : hp("100%"),
        },
        image:{
            flex: 1,
            resizeMode: 'cover',
        },
    })

;

export default SkyscrapperBackground;
