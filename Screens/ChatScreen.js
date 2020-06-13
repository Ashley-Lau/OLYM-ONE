import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Button, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from "@react-navigation/native";

import Background from "../views/Background";
import CustButton from "../Components/CustButton";


const ChatScreen = props => {
    const navigation = useNavigation()
    const [data, setData]  = useState({
        messages: [{
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
            },
        }],
    })

    const onSend = messages => {
        setData(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    const chat = <GiftedChat messages = {data.messages} onSend = {messages => onSend(messages)} user={{_id: 1,}}/>

    return <TouchableWithoutFeedback onPress = {Keyboard.dismiss()} accessible = {false}>
                <Background>
                    <View style = {{flex: 1, backgroundColor: 'rgb(71,51,121)', justifyContent: 'space-around', flexDirection: 'row'}}>
                        <CustButton style = {{backgroundColor: 'rgb(71,51,121)', justifyContent: 'center',}} onPress = {() => navigation.goBack()}>
                            <Ionicons name="ios-arrow-back" color={'white'} size={50} />
                            <Text style = {{fontSize: 40}}> back</Text>
                        </CustButton>
                        <Text style = {style.text}> Name </Text>
                    </View>
                    <View style = {{flex: 10}}>
                        <GiftedChat messages = {data.messages} onSend = {messages => onSend(messages)} user={{_id: 1,}}/>
                    </View>
                </Background>
            </TouchableWithoutFeedback>
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection:"column"
    },
    text: {
        color: 'white',
        justifyContent: 'center',
        fontSize: 30,
        fontWeight: "bold",
    },
})

export default ChatScreen;