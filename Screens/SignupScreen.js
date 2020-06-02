import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Picker,
    Alert,
    ImageBackground,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import { useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import Styles from "../styling/Styles";
import GradientButton from "../Components/GradientButton";

const SignUpComponent = props => {
    return <View style = {{marginTop: 10, width: 300}}>
                <Text style = {{fontSize: 15, fontWeight: 'bold'}}>{props.title}</Text>
                <TextInput  style = {{marginTop: 0, fontSize:20, borderBottomWidth: 2, borderBottomColor: 'black' }}
                            placeholderTextColor = '#708090' {...props}/>
            </View>
}

const SignupScreen = props => {
    const navigation = useNavigation()
    const [gender, setGender] = useState('')
    const [date, setDate] = useState(new Date())

    let data = [{
        value: 'Male',
    }, {
        value: 'Female',
    }];
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
                    <Text style = {{fontSize: 30, borderBottomWidth: 2, borderBottomColor: 'black'}}>
                        Sign Up
                    </Text>
                    <SignUpComponent title = 'First Name:' placeholder = "First Name">
                    </SignUpComponent>
                    <SignUpComponent title = 'Last Name:' placeholder = "Last Name">
                    </SignUpComponent>
                    <SignUpComponent title = 'Username:' placeholder = "6 - 16 characters">
                    </SignUpComponent>
                    <SignUpComponent title = 'Password:' placeholder = "Password" secureTextEntry = {true}>
                    </SignUpComponent>
                    <SignUpComponent title = 'Confirm Passwords:' placeholder = "Re-Enter Password" secureTextEntry = {true}>
                    </SignUpComponent>
                    <View style = {{flexDirection: 'row', marginRight: 100,}}>
                        <Text style = {{fontSize: 20, fontWeight: 'bold',marginTop: 20}}>Gender: </Text>
                        <View style = {style.dropDown}>
                            <Picker
                                selectedValue={gender}
                                style={{ height: 50, width: 130, }}
                                onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                            >
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                            </Picker>
                        </View>
                    </View>
                    <View style={Styles.buttonContainer}>
                        <GradientButton onPress={registeredPress}
                                        style={style.button}
                                        colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                            Register
                        </GradientButton>
                        <GradientButton onPress={registeredPress}
                                        style={style.button}
                                        colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
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
    },
    dropDown: {
        marginTop: 18,
        justifyContent: 'center',
        backgroundColor: 'ghostwhite',
        height: 33,
        borderWidth: 1,
        width: 120,
    }
})
