import React, {useState} from 'react'
import {
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    View,
    Text,
    TextInput,
    Alert
} from 'react-native';

import { useNavigation} from '@react-navigation/native';

import firebaseDb from "../firebaseDb";
import Styles from "../styling/Styles";
import GradientButton from "../Components/GradientButton";

const ResetPasswordScreen = () => {

    const navigation = useNavigation();

    const [email, setEmail] = useState('')

    const forgotPassword = () => {
        firebaseDb.auth().sendPasswordResetEmail(email)
            .then( (user) => {
                Alert.alert(
                    "Reset email has been sent to " + email + '.',
                    "Please follow the instructions in the email.",
                    [{text:"Confirm", onPress: () => navigation.goBack(),  style:'cancel'}
                            ],
                    {cancelable: false}
                )
            }).catch( (error) =>  {
                if (error.code.toString() === 'auth/invalid-email'){
                    Alert.alert(
                        "Invalid email!",
                        "Please enter a valid email!"
                    )
                }
                if (error.code.toString() === 'auth/user-not-found'){
                    Alert.alert(
                        "Email not registered!",
                        "Please enter a registered email!"
                    )
                }
        })
    }

    const handlePasswordReset = async (values, actions) => {
        const { email } = values

        try {
            await firebaseDb.auth()
            console.log('Password reset email sent successfully')
            this.props.navigation.navigate('Login')
        } catch (error) {
            actions.setFieldError('general', error.message)
        }
    }

    return  <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
                <ImageBackground source = {require('../assets/BrownSkyline.png')} style={Styles.container}>
                    <View style = {style.inputContainer}>
                        <Text style = {{fontSize: 30, fontWeight: 'bold', borderBottomWidth: 4, borderBottomColor: 'black'}}>Reset Password</Text>
                        <View style = {{marginHorizontal: 10, marginVertical: 20, width: '85%'}}>
                            <Text style = {{fontSize: 20, fontWeight: 'bold'}}>Email:</Text>
                            <TextInput  style = {{marginTop: 0, fontSize:20, borderBottomWidth: 2, borderBottomColor: 'black' }}
                                        placeholderTextColor = '#708090'
                                        placeholder = "Please type your email here..."
                                        onChangeText = {(value) => setEmail(value)}
                                        value = {email}/>
                        </View>
                        <View style={{flexDirection: 'row',}}>
                            <GradientButton onPress={() => navigation.goBack()}
                                            style={style.button}
                                            colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
                                Cancel
                            </GradientButton>
                            <GradientButton onPress={forgotPassword}
                                            style={style.button}
                                            colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                                Reset
                            </GradientButton>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableWithoutFeedback>
}

const style = StyleSheet.create({
    inputContainer: {
        backgroundColor: '#ffffff99',
        width: 300,
        height: 230,
        borderRadius: 10,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: 100,
        height: 45,
        marginHorizontal: 18
    }
})

export default ResetPasswordScreen
