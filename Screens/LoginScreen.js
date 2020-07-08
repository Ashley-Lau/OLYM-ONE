import React,{useState} from 'react';
import {Keyboard, StyleSheet, View, Image, TouchableWithoutFeedback, ImageBackground, Text, Alert} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {Sae} from 'react-native-textinput-effects';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {AppLoading} from 'expo';
import {Asset} from "expo-asset";

import Styles from "../styling/Styles";
import GradientButton from "../Components/GradientButton";
import firebaseDb from "../firebaseDb";
import {get} from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const LoginScreen = (props) => {
    const navigation = useNavigation()
    const [loaded, setLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const backSunset = require("../assets/sunset_running_newstyle.png");
    const logo = require("../assets/OLYMONE_login.png")

    const alertMessage = () => Alert.alert(
        "Invalid Email or Password",
        "Please enter a valid email address and password.",
        [
            {text:"Confirm", onPress: () => {},  style:'cancel'}
        ],
        {cancelable: false}
    )

    const getImages = () => {
        return Asset.loadAsync(backSunset);
    }

    const signInUser = () => {
        firebaseDb.auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef = firebaseDb.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                        if(password !== firestoreDocument.data().password) {
                            usersRef.doc(uid).update({password: password}).catch(error => console.log(error))
                        }
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alertMessage()
            })
    }



    if(loaded){
        return (
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
                <ImageBackground source={require("../assets/BrownSkyline.png")} style={Styles.container}>
                {/*<ImageBackground source = {backSunset} style={Styles.container}>*/}
                    <Image style={Styles.logo} source={logo}/>
                    <View style = {style.inputContainer}>
                        <Sae label= {'Email:'}
                             iconClass = {FontAwesome5}
                             iconName = {'user'}
                             iconColor = {'black'}
                             autoCorrect = {false}
                             style = {style.textContainer}
                             labelHeight = {24}
                             inputWidth = {40}
                             inputPadding = {16}
                             labelStyle = {style.labelStyle}
                             inputStyle = {style.textStyle}
                             onChangeText={email => setEmail(email)}
                             value = {email}

                        />
                        <Sae label= {'Password:'}
                             iconClass = {SimpleLineIcons}
                             iconName = {'lock'}
                             iconColor = {'black'}
                            // iconSize = {30}
                             autoCorrect = {false}
                             style = {style.textContainer}
                             labelHeight = {24}
                             inputWidth = {40}
                             inputPadding = {16}
                             labelStyle = {style.labelStyle}
                             inputStyle = {style.textStyle}
                             secureTextEntry={true}
                             onChangeText={pw => setPassword(pw)}
                             value = {password}
                        />
                        <View style={{...Styles.buttonContainer, flexDirection:"row"}}>
                            <GradientButton onPress={() => navigation.navigate('SignupScreen')}
                                            style={style.button}
                                            colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                                Sign up
                            </GradientButton>

                            <GradientButton onPress={signInUser}
                                            style={{...style.button, marginLeft:125}}
                                            colors={['rgba(32,151,83,0.85)', 'rgba(12,78,41,0.85)']}>
                                Sign in
                            </GradientButton>

                        </View>
                        <Text style = {{fontSize: 14, fontWeight: 'bold', top: 10}}> Forgot password?
                            <Text style = {{color: '#1F45FC'}} onPress = {()=> navigation.navigate('ResetPasswordScreen')}> Reset here.</Text>
                        </Text>
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
        backgroundColor: 'rgba(255,255,255,0.42)',
        marginTop: 20,
        width: 300,
        height: 320,
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
        fontSize: 16,
        color: 'black',
    },
    button: {
        width: 100,
        height: 45,
    }
})

export default LoginScreen;
