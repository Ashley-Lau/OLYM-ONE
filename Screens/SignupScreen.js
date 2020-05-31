import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    Alert,
    ImageBackground,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import Styles from "../styling/Styles";
import GradientButton from "../Components/GradientButton";

const SignupScreen = props => {
    const navigation = useNavigation()
    const registeredAlert = () => {
        Alert.alert(
            "Account Registered!",
            "Fuck You!"
        )
    }

    const registeredPress = () => {
        registeredAlert();
        navigation.goBack();
    }

    return (
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <ImageBackground source = {require('../assets/sunset_running_newstyle.png')} style={Styles.container}>
                <View style = {style.empty}/>
                {/*<View style = {style.popout}>*/}
                <Animatable.View style = {style.popout} animation = "fadeInUpBig">
                    <TextInput style={Styles.login}
                               placeholder="Name"
                        // onChangeText={}
                        // value = {}
                    />
                    <TextInput style={Styles.login}
                               placeholder="Password"
                        // onChangeText={}
                        // value = {}
                    />
                    <View style={Styles.buttonContainer}>
                        <GradientButton onPress={registeredPress}
                                        style={style.button}
                                        colors={['rgba(32,151,83,0.85)', 'rgba(12,78,41,0.85)']}>
                            Register
                        </GradientButton>
                        <GradientButton onPress={registeredPress}
                                        style={style.button}
                                        colors={['rgba(32,151,83,0.85)', 'rgba(12,78,41,0.85)']}>
                            Cancel
                        </GradientButton>
                    </View>
                </Animatable.View>
            {/*</View>*/}
            </ImageBackground>
        </TouchableWithoutFeedback>
    )
};

export default SignupScreen;

const style = StyleSheet.create({
    popout: {
        flex: 6,
        width: '100%',
        backgroundColor: '#FFFFFF80',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        alignItems: 'center',
        opacity: 0.6,
    },
    empty: {
        flex: 1,
    }
})