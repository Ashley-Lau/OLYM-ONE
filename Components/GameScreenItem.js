import React,{useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Alert,ImageBackground, Image} from 'react-native';
import * as firebase from 'firebase';

import { useNavigation } from '@react-navigation/native';
import firebaseDb from "../firebaseDb"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ViewPlayerItem from "../Components/ViewPlayerItem"
import GameItemBackGround from "../views/GameItemBackGround";
import GameDetailsModal from "./GameDetailsModal";
import {keywordsMaker} from '../Components/SearchBarFunctions'

const GameScreenItem = props => {
    const navigation = useNavigation()

    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.gameDetails.date
    if(props.gameDetails.date){
        gameDate = gameDate.toDate().toString().slice(4,15);
    }

    // LIST OF PLAYERS ================================================================================================
    const [playerUser, setPlayerUser] = useState([]);

    const username = () => {
        setPlayerUser([]);
        let playerList = [];
        props.gameDetails.players.map(uid => {
            firebaseDb.firestore().collection('users')
                .doc(uid)
                .onSnapshot(doc => {
                    playerList.push(doc.data().username);
                }, error => {
                    console.log(error.message);
                })
        })
        setPlayerUser(playerList);
    }

    useEffect(() => {
        const unsubscribe = username();

        return () => unsubscribe;
    }, [])




    //MODAL STATES ================================================================================================================
    const [playerDetails, openPlayerDetails] = useState(false);
    const [gameDetails, openGameDetails] = useState(false);


    //SPORT BG and colour================================================================================================================================
    let sportBG = require("../assets/BballBG.png");
    let sportColor = "rgba(0,0,0,1)"
    if(props.gameDetails.sport.toLowerCase() === "basketball"){
        sportBG = require("../assets/BballBG.png");
        sportColor = "rgba(200,98,57,1)";
    } else if(props.gameDetails.sport.toLowerCase() === "soccer"){
        sportBG = require("../assets/SoccerBG.png");
        sportColor = "rgba(134,119,198,1)";
    } else if(props.gameDetails.sport.toLowerCase() === "floorball"){
        sportBG = require("../assets/floorballBG.png");
        sportColor = "rgba(58,204,255,1)";
    } else if(props.gameDetails.sport.toLowerCase() === "tennis"){
        sportBG = require("../assets/TennisBG.png");
        sportColor = "rgba(212,242,102,1)";
    } else if(props.gameDetails.sport.toLowerCase() === "badminton") {
        sportBG = require("../assets/BadmintonBG.png");
        sportColor = "rgba(211,55,64,1)";
    }
    let sportIcon = props.gameDetails.sport.toLowerCase();


    //CHAT FUNCTION====================================================================================================

    const chatWithHost = () => {
        const hostId = props.gameDetails.hostId
        const currentUserId = props.user.id
        const smallerId = hostId < currentUserId ? hostId : currentUserId
        const largerId = hostId < currentUserId ? currentUserId : hostId
        const chatId = smallerId + '_' + largerId
        const chatRef = firebaseDb
            .firestore()
            .collection('messages')
        if (hostId === currentUserId) {
            Alert.alert('You are The host!', 'Cannot talk to yourself')
            return
        }
        chatRef
            .doc(chatId)
            .get()
            .then(doc => {
                if(!doc.exists) {
                    let smallerIdData = null
                    let largerIdData = null

                    firebaseDb.firestore().collection('users').doc(smallerId).get()
                        .then(doc => {
                            smallerIdData = doc.data()
                            firebaseDb.firestore().collection('users').doc(largerId).get()
                                .then(doc2 => {
                                    largerIdData = doc2.data()
                                    const keywords = keywordsMaker([smallerIdData.username, largerIdData.username])
                                    const data = {
                                        id: chatId,
                                        idArray: [smallerId, largerId],
                                        largerId: [largerId, largerIdData.username, largerIdData.uri],
                                        smallerId: [smallerId, smallerIdData.username, smallerIdData.uri],
                                        lastMessage: '',
                                        lastMessageFrom: null,
                                        lastMessageTime: '',
                                        message: [],
                                        notificationStack: 0,
                                        messageCount: 0,
                                        keywords: keywords,
                                        smallId: smallerId,
                                        largeId: largerId,
                                    }
                                    chatRef
                                        .doc(chatId)
                                        .set(data)
                                        .then(() => {
                                            openGameDetails(false)
                                            navigation.navigate('ChatStack', {
                                                screen: 'ChatScreen',
                                                params : {
                                                    chat: data,
                                                    userId: currentUserId
                                                }
                                            })
                                        })
                                        .catch(error => console.log(error))
                                })
                                .catch(error => console.log(error))
                        })
                        .catch(error => console.log(error))
                } else {
                    openGameDetails(false)
                    navigation.navigate('ChatStack', {
                        screen: 'ChatScreen',
                        params : {
                            chat: doc.data(),
                            userId: currentUserId
                        }
                    })
                }
            })
            .catch(error => console.log(error))
    }


    return (
        <View>
            <ViewPlayerItem visible={playerDetails}
                            username={playerUser}
                            closePlayer ={() => {openPlayerDetails(false)}}/>

            <GameDetailsModal visible={gameDetails}
                              gameDetails={props.gameDetails}
                              closeGame={() => {openGameDetails(false)}}
                              openPlayer ={() => {openPlayerDetails(true)}}
                              itemType = {props.itemType}
                              chatFunction ={chatWithHost}
                              gameId ={props.gameId}
                              user = {props.user}
            />

            <TouchableOpacity style={{...styles.games}}
                              onPress={() => {openGameDetails(true);}}>
                <ImageBackground source={sportBG}
                                 style={styles.gameBG}
                                 imageStyle={{borderRadius:40}}
                >
                    <View style={{flexDirection:"column"}}>
                        <Text style={{fontWeight:"bold", fontSize:35, color:sportColor}}>{props.gameDetails.sport}</Text>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <MaterialCommunityIcons name="map-marker" size={20}/>
                            <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.location}</Text>
                        </View>
                        <View style={{flexDirection:"row", alignItems:"center",marginTop:5}}>
                            <MaterialCommunityIcons name="calendar-range" size={20}/>
                            <Text style={{fontSize:15, color:"black"}}>  {gameDate} </Text>
                        </View>
                        <View style={{flexDirection:"row", alignItems:"center",marginTop:5}}>
                            <MaterialCommunityIcons name="account-group-outline" size={20}/>
                            <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.availability} </Text>
                        </View>

                    </View>
                </ImageBackground>


            </TouchableOpacity>
        </View>


    )
}

const styles = StyleSheet.create({
    gameBG:{
        height:400,
        width:350,
        borderRadius:50,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingTop:20,
        paddingHorizontal:20

    },
    games:{
        flexDirection:"row",
        borderRadius:40,
        width:350,
        height:400,
        justifyContent:"center",
        alignItems:"center",
        marginHorizontal:10,
        elevation:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 100,
            height: 100,
        },
        shadowOpacity: 0,
        shadowRadius: 6.27,

    },
    scrollBox:{
        flex:1,
        borderWidth: 1,
        borderBottomEndRadius:10,
        borderBottomStartRadius:10,
        backgroundColor: "rgba(200,200,200,0.2)",
        width:"100%"
    },
    playerButton:{

    },
    locationImage:{
        height:200,
        flexWrap:"wrap"
    }
})


export default GameScreenItem;
