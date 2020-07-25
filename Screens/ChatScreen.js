import React, {useEffect, useReducer, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Button,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    SafeAreaView,
    Image, ImageBackground
} from 'react-native';

import { GiftedChat, Day, Bubble } from 'react-native-gifted-chat'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from "@react-navigation/native";

import Styles from "../styling/Styles";
import firebaseDb from "../firebaseDb";



const ChatScreen = props => {
    const navigation = useNavigation()
    const chatInformation = props.route.params.chat
    const userId = props.route.params.userId
    const chatRef = firebaseDb.firestore().collection('messages').doc(chatInformation.id)
    const userInformation = chatInformation.smallerId[0] === userId ? chatInformation.smallerId : chatInformation.largerId
    const otherUserInformation = chatInformation.smallerId[0] === userId ? chatInformation.largerId : chatInformation.smallerId
    const [data, setData]  = useState({
        messages: chatInformation.message,
        lastMessageFrom: chatInformation.lastMessageFrom,
        messageCount: chatInformation.messageCount,
        notificationStack: 0,
    })

    useEffect(() => {
        const unsubscribe = chatRef.onSnapshot(
                        querySnapshot => {
                            const newData = querySnapshot.data()
                            let newNotificationStack = newData.notificationStack
                            if(userId !== newData.lastMessageFrom && newNotificationStack !== 0){
                                newNotificationStack = 0
                                chatRef.update({notificationStack: 0}).catch(error => console.log(error))
                            }
                            setData({
                                messages: newData.message,
                                lastMessageFrom: newData.lastMessageFrom,
                                notificationStack: newNotificationStack
                            })
                        },
                        error => {
                            console.log(error)
                        }
                    )
        return () => unsubscribe()
    }, [])

    //function to calculate current date of singapore but apparently our systems updates the timings according to our phones timezone
    // function calcTime() {
    //     const date = new Date()
    //     const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
    //     const sgTime = new Date(utc + (3600000*8))
    //     return sgTime
    //     return date
    // }


    // firebase update when send messages
    const onSend = messages => {
        const messageTime = new Date()
        const updatedMessage = [{...messages[0], createdAt: messageTime.toString()}]
        const newMessageArray = GiftedChat.append(data.messages,updatedMessage)
        chatRef.update({
            message: newMessageArray,
            lastMessage: messages[0].text,
            lastMessageFrom: userId,
            lastMessageTime: messageTime,
            notificationStack: data.lastMessageFrom === userId ? data.notificationStack + 1 : 1,
            messageCount: 1,
        }).catch(error => console.log(error))
    }

    // changing the color of the date
    const renderDay = (props) => {
        return <Day {...props} textStyle={{color: 'black', fontWeight: 'bold'}}/>
    }

    const renderBubble  = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#ff6600'
                    },
                    left: {
                        backgroundColor: 'white'
                    }
                }}
            />
        )
    }

    return <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
                <ImageBackground source={require("../assets/BrownSkylineChat.png")} style = {{width: '100%', height: '100%',}}>

                            <View style = {{width: '100%', height: Styles.statusBarHeight.height + 45, backgroundColor: 'rgb(226,147,73)', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', paddingTop: Platform.OS === 'ios' ? Styles.statusBarHeight.height : 0}}>
                                {/*==================================================back button==========================================*/}
                                <TouchableOpacity style = {{alignItems: 'center', height: '100%', flexDirection: 'row', marginLeft: 10}}
                                                  onPress = {() => navigation.goBack()}
                                                  activeOpacity= {0.8}>
                                    <Ionicons name="ios-arrow-back" color={'white'} size={30} />
                                    <Text style = {{fontSize: 20, marginLeft: 6, color: 'white'}}>Back</Text>
                                </TouchableOpacity>
                                {/*============================ username of the other person you are talking to==============================*/}
                                <Text style = {{...style.text}}> {otherUserInformation[1]} </Text>
                                {/*=============================================profile picture of other user====================================================*/}
                                <TouchableOpacity style = {{marginRight: 8,}} activeOpacity={0.9}>
                                    <Image source = {{uri: chatInformation.smallerId[0] === userId ? chatInformation.largerId[2] : chatInformation.smallerId[2]}}
                                           style = {style.image}/>
                                </TouchableOpacity>
                            </View>
                        {/*==================================================gifted chat===============================================================*/}
                            <GiftedChat messages = {data.messages}
                                            onSend = {messages => onSend(messages)}
                                            user={{_id: userInformation[0], name: userInformation[1], avatar: null}}
                                            renderDay={renderDay}
                                            renderBubble={renderBubble}
                                            renderAvatar={() => {return null}}
                            />
                </ImageBackground>
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
        fontSize: 21,
        fontWeight: "bold",
        alignSelf: 'center',
        marginRight: 2
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 120,
    }
})

export default ChatScreen;
