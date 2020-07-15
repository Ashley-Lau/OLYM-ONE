import React, {useState} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Alert
} from 'react-native';

import { useNavigation} from '@react-navigation/native';

import firebaseDb from "../firebaseDb";
import GradientButton from "../Components/GradientButton";
import SkyscrapperBackground from "../views/SkyscrapperBackground";

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

    return <SkyscrapperBackground>
                <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                    <View style = {style.inputContainer}>
                        <Text style = {{fontSize: 30, fontWeight: 'bold',}}>Reset Password</Text>
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
                                            colors={['#e52d27', '#b31217']}>
                                Cancel
                            </GradientButton>
                            <GradientButton onPress={forgotPassword}
                                            style={style.button}
                                            colors={['#ff8400','#e56d02']}>
                                Reset
                            </GradientButton>
                        </View>
                    </View>
                </View>
            </SkyscrapperBackground>

}

const style = StyleSheet.create({
    inputContainer: {
        backgroundColor: '#FFFFFF80',
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
