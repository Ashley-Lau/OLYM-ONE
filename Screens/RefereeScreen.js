import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Button, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';


import Background from "../views/Background";
import CustButton from "../Components/CustButton";


const RefereeScreen = props => {
    const navigation = useNavigation();

    const confirmLogOut = () => {
        Alert.alert("Confirm Log Out",
            "Do you want to log out?",
            [{
                text: "Yes",
                onPress: () => navigation.navigate('LoginScreen'),
                style: 'cancel'
            },
                {text:"Cancel", onPress: () => {},  style:'cancel'}
                ],
            {cancelable: false}
        )

    }

    return<Background style = {styles.container}>
                <CustButton style={{backgroundColor: '#dda0dd', marginHorizontal: 60}}>
                    <Text>RefereeScreen</Text>
                </CustButton>
            </Background>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection:"column"

    },
    text: {
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: "bold",
    },
})

export default RefereeScreen;
