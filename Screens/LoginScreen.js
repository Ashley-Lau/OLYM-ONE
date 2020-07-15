import React,{useState} from 'react';
import {StyleSheet, View, Image, Text, Alert, } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {Sae} from 'react-native-textinput-effects';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {AppLoading} from 'expo';
import {Asset} from "expo-asset";

import Styles from "../styling/Styles";
import GradientButton from "../Components/GradientButton";
import firebaseDb from "../firebaseDb";
import SkyscrapperBackground from "../views/SkyscrapperBackground";
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
                <SkyscrapperBackground>
                    <View style={{justifyContent:"center", alignItems:'center', flex :1}}>
                        <Image style={{...Styles.logo, }} source={logo}/>
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
                            <View style={{width: '100%', marginTop: 20}}>
                                <GradientButton onPress={signInUser}
                                                style={style.button}
                                                colors={['#ff8400','#e56d02']}>
                                    LOGIN
                                </GradientButton>
                                <GradientButton onPress={() => navigation.navigate('SignupScreen')}
                                                style={style.button}
                                                colors={['#e52d27', '#b31217']}>
                                    SIGN UP
                                </GradientButton>

                            </View>

                        </View>
                        <View style={{position: "absolute", bottom: 3}}>
                            <Text style = {{fontSize: 14, fontWeight: 'bold',}}> Forgot password?
                                <Text style = {{color: 'maroon'}} onPress = {()=> navigation.navigate('ResetPasswordScreen')}> Reset here.</Text>
                            </Text>
                        </View>
                    </View>
                </SkyscrapperBackground>
        );
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
        width: 300,
        height: 320,
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
        width: 250,
        height: 50,
        marginTop: 20
    }
})

export default LoginScreen;
