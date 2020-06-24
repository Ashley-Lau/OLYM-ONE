import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Button, Keyboard, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from "@react-navigation/native";

import Background from "../views/Background";
import CustButton from "../Components/CustButton";
import firebaseDb from "../firebaseDb";
import moment from 'moment/min/moment-with-locales';


const ChatScreen = props => {
    const navigation = useNavigation()
    const [data, setData]  = useState({
        messages: [{
            _id: 'dasdsadas',
            text: 'Hello developer',
            createdAt: calcTime(),
            user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
            },
        }],
    })
    // console.log('XiQiMscVpnXd35kpeVjM0WIUT6q2' < 'bkhZgJFymHcqRRFr0b718c0h9y83')


    //function to calculate current date of singapore
    function calcTime() {
        const date = new Date();
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        const sgTime = new Date(utc + (3600000*8));
        return sgTime;
    }

    const onSend = messages => {
        const updatedMessage = [{...messages[0], createdAt: calcTime().toString()}]
        console.log(updatedMessage)
        setData(previousState => ({
            messages: GiftedChat.append(previousState.messages, updatedMessage),
        }))
    }

    const chat = <GiftedChat messages = {data.messages} onSend = {messages => onSend(messages)} user={{_id: 1,}} renderTime={calcTime}/>

    return  <Background>
                <View style = {{width: '100%', height: 60, backgroundColor: 'rgb(71,51,121)', flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style = {{alignItems: 'center', height: '100%', flexDirection: 'row', marginLeft: 10}}
                                      onPress = {() => navigation.goBack()}
                                      activeOpacity= {0.8}>
                        <Ionicons name="ios-arrow-back" color={'white'} size={40} />
                        <Text style = {{fontSize: 30, marginLeft: 10, color: 'white'}}>Back</Text>
                    </TouchableOpacity>
                    <Text style = {{...style.text, marginLeft: 50, }}> {props.route.params.chat.largerId[1]} </Text>
                </View>
                <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
                    <View style = {{flex: 10}}>
                        <GiftedChat messages = {data.messages} onSend = {messages => onSend(messages)} user={{_id: 1,}}/>
                    </View>
                </TouchableWithoutFeedback>
            </Background>
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