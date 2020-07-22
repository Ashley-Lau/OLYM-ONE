import React,{useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Alert} from 'react-native';
import * as firebase from 'firebase';

import { useNavigation } from '@react-navigation/native';
import firebaseDb from "../firebaseDb"
import ViewPlayerItem from "../Components/ViewPlayerItem"
import GameItemBackGround from "../views/GameItemBackGround";
import GameDetailsModal from "./GameDetailsModal";
import {keywordsMaker} from '../Components/SearchBarFunctions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GameItem = props => {
    const navigation = useNavigation()

    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.gameDetails.date
    if(props.gameDetails.date){
        gameDate = gameDate.toDate().toString().slice(4,15);
    }

    // LIST OF PLAYERS AND REFEREE ================================================================================================
    const [playerUser, setPlayerUser] = useState([]);
    const [refereeUser, setRefereeUser] = useState([]);

    const username = () => {
        setPlayerUser([]);
        let playerList = [];
        props.gameDetails.players.map(uid => {
            firebaseDb.firestore().collection('users')
                .doc(uid)
                .onSnapshot(doc => {
                    playerList.push(doc.data());
                }, error => {
                    console.log(error.message);
                })
        })
        setPlayerUser(playerList);
    }

    const getRef = () => {
        setRefereeUser([]);
        let refList = [];
        props.gameDetails.refereeList.map(uid => {
            firebaseDb.firestore().collection('users')
                .doc(uid)
                .onSnapshot(doc => {
                    refList.push(doc.data());
                }, error => {
                    console.log(error.message);
                })
        })
        setRefereeUser(refList);
    }

    useEffect(() => {
        const unsubscribe = username();
        const unsubscribe2 = getRef();

        return () => {
            unsubscribe;
            unsubscribe2;
        }

    }, [])




    //MODAL STATES ================================================================================================================
    const [playerDetails, openPlayerDetails] = useState(false);
    const [refereeDetails, openRefereeDetails] = useState(false);
    const [gameDetails, openGameDetails] = useState(false);


    //SPORT BG and colour================================================================================================================================
    let playerBG = require("../assets/BballApp.png");
    let refereeBG = require("../assets/BballRefereeApp.png");
    let sportColor = "rgba(0,0,0,1)"
    let lightColor = "rgb(255,255,255)"
    if(props.gameDetails.sport.toLowerCase() === "basketball" ){
        refereeBG = require("../assets/BballRefereeApp.png");
        playerBG = require("../assets/BballApp.png");
        sportColor = "rgba(200,98,57,1)";
        lightColor = "rgb(252,238,184)"

    } else if(props.gameDetails.sport.toLowerCase() === "soccer" ){
        refereeBG = require("../assets/SoccerRefereeApp.png");
        playerBG = require("../assets/SoccerApp.png");
        sportColor = "rgba(134,119,198,1)";
        lightColor = "rgb(195,185,206)"

    } else if(props.gameDetails.sport.toLowerCase() === "floorball" ){
        refereeBG = require("../assets/floorballRefereeApp.png");
        playerBG = require("../assets/floorballApp.png");
        sportColor = "rgba(58,204,255,1)";
        lightColor = "rgb(228,235,255)"

    } else if(props.gameDetails.sport.toLowerCase() === "tennis" ){
        refereeBG = require("../assets/TennisRefereeApp.png");
        playerBG = require("../assets/TennisApp.png");
        sportColor = "rgba(212,242,102,1)";
        lightColor = "rgb(196,172,19)";

    } else if(props.gameDetails.sport.toLowerCase() === "badminton" ){
        refereeBG = require("../assets/BadmintonRefereeApp.png");
        playerBG = require("../assets/BadmintonApp.png");
        sportColor = "rgba(211,55,64,1)";
        lightColor = "rgb(218,138,158)"
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
                                            navigation.navigate('ChatScreen', {
                                                    chat: data,
                                                    userId: currentUserId
                                            })
                                        })
                                        .catch(error => console.log(error))
                                })
                                .catch(error => console.log(error))
                        })
                        .catch(error => console.log(error))
                } else {
                    openGameDetails(false)
                    navigation.navigate('ChatScreen', {
                            chat: doc.data(),
                            userId: currentUserId
                    })
                }
            })
            .catch(error => console.log(error))
    }


    return (
        <View>
            <ViewPlayerItem visible={playerDetails}
                              playerDetails={playerUser}
                              closePlayer ={() => {openPlayerDetails(false)}}
                              backGround = {playerBG}
                              sportColor = {sportColor}
                              lightColor = {lightColor}
                              typeCheck = {"Player"}
        />

            <ViewPlayerItem visible={refereeDetails}
                            playerDetails={refereeUser}
                            closePlayer ={() => {openRefereeDetails(false)}}
                            backGround = {refereeBG}
                            sportColor = {sportColor}
                            lightColor = {lightColor}
                            typeCheck = {"Referee"}
            />

            <GameDetailsModal visible={gameDetails}
                              gameDetails={props.gameDetails}
                              closeGame={() => {openGameDetails(false)}}
                              openPlayer ={() => {openPlayerDetails(true)}}
                              openReferee = {() => {openRefereeDetails(true)}}
                              itemType = {props.itemType}
                              chatFunction ={chatWithHost}
                              gameId ={props.gameId}
                              user = {props.user}
            />

            <TouchableOpacity style={{...styles.games}}
                              onPress={() => {openGameDetails(true);}}>

                <View style={{flexDirection:"column", justifyContent:"flex-start", alignItems:"flex-start"}}>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <Text style={{fontWeight:"bold", fontSize:18, color: "black"}}>{props.gameDetails.sport}</Text>
                    </View>

                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="map-marker" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.location}</Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="calendar-range" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {gameDate} </Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="account-group" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.availability}</Text>
                    </View>
                    {/*<Text style={{fontSize:18, color:"black"}}>Date: {gameDate} </Text>*/}
                    {/*<Text style={{fontSize:18, color:"black"}}>Slots Left: {props.gameDetails.availability} </Text>*/}
                </View>

                <GameItemBackGround iconName={sportIcon} style={{height:90, flexDirection:"row", justifyContent: "flex-end", alignItems:"flex-end"}}>

                    {props.gameDetails.hostId === props.user.id
                        ?
                        <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                            <MaterialCommunityIcons name="crown" size={22} style={{color:'black'}}/>
                            <Text>Hosting</Text>
                        </View>

                        :
                        <View></View>
                    }

                </GameItemBackGround>
            </TouchableOpacity>
        </View>


    )
}

const styles = StyleSheet.create({
    games:{
        flexDirection:"row",
        borderBottomWidth:0.7,
        borderColor:"black",
        borderRadius:10,
        width:"100%",
        height:100,
        padding:5,
        justifyContent:"center",
        alignItems:"center",


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


export default GameItem;
