import React, {useState}from 'react';
import {StyleSheet, Text, View, Button} from 'react-native'

import {useNavigation} from "@react-navigation/native";

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";

const ChatDetailScreen = (props) => {
    const navigation = useNavigation()

    return <Background>
                <View style = {{alignItems: 'center', justifyContent: 'center',flex: 1, backgroundColor: 'rgb(71,51,121)'}}>
                    <Text style = {style.text}> Chats</Text>
                </View>

                <View style = {{flex: 10, alignItems: 'center'}}>
                    <GradientButton onPress={() => navigation.navigate('ChatScreen')}
                                    style={{width: '100%', height: '10%'}}
                                    colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                        Sex Chat
                    </GradientButton>
                </View>

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

export default ChatDetailScreen;