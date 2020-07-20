import React,{useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Alert,ImageBackground, Image, Animated, Dimensions} from 'react-native';
import * as firebase from 'firebase';

import { useNavigation } from '@react-navigation/native';
import firebaseDb from "../firebaseDb"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ViewPlayerItem from "../Components/ViewPlayerItem"
import GameItemBackGround from "../views/GameItemBackGround";
import GameDetailsModal from "./GameDetailsModal";
import {keywordsMaker} from '../Components/SearchBarFunctions'

const FullGameItem = props => {
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
                    console.log("players Loaded")
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
    const [refereeDetails, openRefereeDetails] = useState([]);
    const [gameDetails, openGameDetails] = useState(false);


    //SPORT BG and colour================================================================================================================================
    let sportBG = require("../assets/BballBG.png");
    let playerBG = require("../assets/BballApp.png");
    let refereeBG = require("../assets/BballRefereeApp.png");
    let sportColor = "rgba(0,0,0,1)"
    let lightColor = "rgb(255,255,255)"
    if(props.gameDetails.sport.toLowerCase() === "basketball" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/BballRefereeBG.png");
        } else {
            sportBG = require("../assets/BballBG.png");
        }
        refereeBG = require("../assets/BballRefereeApp.png");
        playerBG = require("../assets/BballApp.png");
        sportColor = "rgba(200,98,57,1)";
        lightColor = "rgb(252,238,184)"

    } else if(props.gameDetails.sport.toLowerCase() === "soccer" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/SoccerRefereeBG.png");
        } else {
            sportBG = require("../assets/SoccerBG.png");
        }
        refereeBG = require("../assets/SoccerRefereeApp.png");
        playerBG = require("../assets/SoccerApp.png");
        sportColor = "rgba(134,119,198,1)";
        lightColor = "rgb(195,185,206)"

    } else if(props.gameDetails.sport.toLowerCase() === "floorball" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/floorballRefereeBG.png");
        } else {
            sportBG = require("../assets/floorballBG.png");
        }
        refereeBG = require("../assets/floorballRefereeApp.png");
        playerBG = require("../assets/floorballApp.png");
        sportColor = "rgba(58,204,255,1)";
        lightColor = "rgb(228,235,255)"

    } else if(props.gameDetails.sport.toLowerCase() === "tennis" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/TennisRefereeBG.png");
        } else {
            sportBG = require("../assets/TennisBG.png");
        }
        refereeBG = require("../assets/TennisRefereeApp.png");
        playerBG = require("../assets/TennisApp.png");
        sportColor = "rgba(212,242,102,1)";
        lightColor = "rgb(196,172,19)";

    } else if(props.gameDetails.sport.toLowerCase() === "badminton" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/BadmintonRefereeBG.png");
        } else {
            sportBG = require("../assets/BadmintonBG.png");
        }
        playerBG = require("../assets/BadmintonApp.png");
        refereeBG = require("../assets/BadmintonRefereeApp.png");
        sportColor = "rgba(211,55,64,1)";
        lightColor = "rgb(218,138,158)"
    }


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

    //ANIMATION PROPERTIES===========================================================================================
    const x = props.translateX;
    let index = props.index;
    const someNum = 350;
    const width = Dimensions.get('window').width;

    const position = Animated.subtract(index * someNum, x);
    const isDisappearing =  -someNum;
    const isLeft = 0;
    const isRight = width - someNum;
    const isAppearing = width;

    const translateX =Animated.add(Animated.add(x, x.interpolate({
        inputRange: [0,  0.0001 + index * someNum],
        outputRange: [0, -index * someNum],
        extrapolateRight:"clamp"
    })),
        position.interpolate({
            inputRange:[isRight, isAppearing],
            outputRange:[0, -someNum/4.3],
            // extrapolateRight:"extend"

        })
    )

    const scale = position.interpolate({
        inputRange: [isDisappearing, isLeft, isRight, isAppearing],
        outputRange: [0.5 ,1 , 1, 0.5],
        extrapolate:"clamp"

    });
    const opacity = position.interpolate({
        inputRange: [isDisappearing, isLeft, isRight, isAppearing],
        outputRange: [0.5 ,1, 1, 0.5],
    })



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

            <Animated.View style={[styles.games, {opacity, transform: [{ translateX }, { scale }] }]} key={props.index}>
                <TouchableOpacity style={styles.games}
                                  onPress={() => {openGameDetails(true);}}>
                    <ImageBackground source={sportBG}
                                     style={styles.gameBG}
                                     imageStyle={{borderRadius:40}}
                    >
                        <View style={{flexDirection:"column"}}>
                            <Text style={{fontWeight:"bold", fontSize:35, color:sportColor}}>{props.gameDetails.sport}</Text>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialCommunityIcons name="account" size={20}/>
                                <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.host}</Text>
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialCommunityIcons name="map-marker" size={20}/>
                                <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.location}</Text>
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center",marginTop:5}}>
                                <MaterialCommunityIcons name="calendar-range" size={20}/>
                                <Text style={{fontSize:15, color:"black"}}>  {gameDate} </Text>
                            </View>
                            {props.itemType === "Join"
                                ?
                                <View style={{flexDirection:"row", alignItems:"center",marginTop:5}}>
                                    <MaterialCommunityIcons name="account-group" size={20}/>
                                    <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.players.length} </Text>
                                </View>
                                :
                                <View style={{flexDirection:"row", alignItems:"center",marginTop:5}}>
                                    <MaterialCommunityIcons name="whistle" size={20}/>
                                    <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.refereeList.length} </Text>
                                </View>
                            }
                        </View>
                    </ImageBackground>

                </TouchableOpacity>
            </Animated.View>


        </View>


    )
}

const styles = StyleSheet.create({
    gameBG:{
        height:"100%",
        width:"100%",
        // flex:1,
        borderRadius:50,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingTop:20,
        paddingHorizontal:20,
        // elevation:1


    },
    games:{
        flexDirection:"row",
        borderRadius:40,
        width:350,
        height:"100%",
        overflow:"hidden",
        // flex:1,
        justifyContent:"center",
        alignItems:"center",
        // marginHorizontal:10,
        // elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0,
        shadowRadius: 2,
        backgroundColor:"transparent"

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


export default FullGameItem;
