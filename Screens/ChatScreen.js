import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Button} from 'react-native';

import Background from "../views/Background";
import CustButton from "../Components/CustButton";


const ChatScreen = props => {
    return <Background style = {styles.container}>
                <CustButton style={{backgroundColor: '#dda0dd', marginHorizontal: 60}}>
                    <Text >ChatScreen</Text>
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

export default ChatScreen;