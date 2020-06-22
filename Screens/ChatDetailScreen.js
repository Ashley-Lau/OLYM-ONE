import React, {useState}from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    FlatList
} from 'react-native'

import {useNavigation} from "@react-navigation/native";

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import RefereeItem from "../Components/RefereeItem";
import firebaseDb from "../firebaseDb";


const ChatDetailScreen = (props) => {
    const navigation = useNavigation()
    const userId = props.route.params.user.id
    const filteredList =
        [   {key: '0', username: props.route.params.user.username, uri: props.route.params.user.uri},
            {key:'1', username: props.route.params.user.username, uri: props.route.params.user.uri},
            {key:'2', username: props.route.params.user.username, uri: props.route.params.user.uri},
            {key:'3', username: props.route.params.user.username, uri: props.route.params.user.uri},
            {key:'4', username: props.route.params.user.username, uri: props.route.params.user.uri},
            {key:'5', username: props.route.params.user.username, uri: props.route.params.user.uri},
            {key:'6', username: props.route.params.user.username, uri: props.route.params.user.uri},
            {key:'7', username: props.route.params.user.username, uri: props.route.params.user.uri},
            {key:'8', username: props.route.params.user.username, uri: props.route.params.user.uri},
            {key:'9', username: props.route.params.user.username, uri: props.route.params.user.uri},
            {key:'10', username: props.route.params.user.username, uri: props.route.params.user.uri}]
    // const donkey = firebaseDb.shared

    return <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <Background >
                <View style = {{alignItems: 'center', justifyContent: 'center',height: 60, width: '100%', backgroundColor: 'rgb(71,51,121)'}}>
                    <Text style = {style.text}> Chats</Text>
                </View>
                <View style={style.searchBar}>
                    <TextInput style={style.searchInput}
                               placeholder= "Username, Group"
                               placeholderTextColor="#414141"
                               onChangeText={() => {}}
                               // value={}
                    />
                    {/*<SearchButtons style={{flex: 1, elevation: 5}} searchMe={() => {filterList(); console.log(filteredList); Keyboard.dismiss();}}/>*/}
                    <SearchButtons style={{flex: 1, elevation: 5}} searchMe={() => {Keyboard.dismiss();}}/>
                </View>
                <FlatList
                    contentContainerStyle={{justifyContent: "space-between", width: '100%', borderTopWidth: 1, borderColor: 'black', }}
                    // keyExtractor={(item) => item.key.toString()}
                    data={filteredList}
                    renderItem={({item}) =>
                        <TouchableOpacity style = {{alignItems: 'center', width: '100%', height: 80, backgroundColor: 'rgb(241,240,240)', flexDirection: 'row', borderBottomWidth: 1, borderColor: 'black',}}
                                          activeOpacity = {0.85}
                                          onPress={() => navigation.navigate('ChatScreen')}>
                            <Image source = {{uri: item.uri}} style = {{width: 60, height: 60, borderRadius: 120, marginLeft: 25, borderWidth: 0.6, borderColor: 'black'}}/>
                            <Text style = {{fontSize: 20, marginLeft: 25, fontWeight: 'bold'}}>
                                {item.username}
                            </Text>
                        </TouchableOpacity>}
                />
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
    searchBar:{
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center",
        borderWidth:1,
        borderRadius:4,
        width:'96%',
        marginTop:10,
        marginBottom:10,
        alignSelf: 'center'
    },
    searchInput:{
        width:"85%",
        height:45,
        fontSize:20,
        marginLeft: 7,
    },
})

export default ChatDetailScreen;