import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    TouchableOpacity,
    ImageBackground,
    Image,
    Alert
} from 'react-native';
import * as firebase from 'firebase';

import GradientButton from "../Components/GradientButton";
import firebaseDb from "../firebaseDb";
import GameItemBackGround from "../views/GameItemBackGround";
import Styles from "../styling/Styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {keywordsMaker} from "./SearchBarFunctions";
import {useNavigation} from "@react-navigation/native";


const RefereeApplicationItem = props => {

    const navigation = useNavigation()

    //GETTING CURRENT GAME INFO ========================================================================================
    const gameRef = firebaseDb.firestore().collection("game_details").doc(props.refDetails.gameId);
    const [details, setDetails] = useState({});

    useEffect(() => {
            const unsubscribe = gameRef
                .onSnapshot(doc => {
                        setDetails(doc.data())
                    },
                    error => {
                        console.log("Game Screen " + error.message)
                    })

            return () => unsubscribe();
        }
        , [])

    //ACCEPT AND DECLINE FUNCTION ========================================================================================
    const applRef = firebaseDb.firestore().collection("application_details").doc(props.appId)


    const deleteReq = () => {
        applRef.delete().then(()=>{
            gameRef.update({applicants: firebase.firestore.FieldValue.arrayRemove(props.refDetails.refereeId)})
                .then(() => {});
        })
    }

    const acceptReq = () => {
        const slots = parseInt(details.refereeSlots) - 1
        gameRef.update({refereeSlots:slots.toString(),
                              refereeList: firebase.firestore.FieldValue.arrayUnion(props.refDetails.refereeId),
                              applicants: firebase.firestore.FieldValue.arrayRemove(props.refDetails.refereeId)})
            .then(()=>{deleteReq()});
        firebaseDb.firestore().collection('notifications')
            .add({
                playerId: props.refDetails.refereeId,
                hostName: details.host,
                timeStamp: new Date(),
                unread: true,
                isPlayer: false,
                gameId: props.refDetails.gameId
            })
            .then(() => {})
            .catch(error => console.log(error))
    }

    const confirmDecline = () => {
        Alert.alert("Confirmation",
            "Are you sure you want to decline this request?",
            [
                {
                    text:'Cancel',
                    onPress:() => {},
                },
                {
                    text:'Confirm',
                    onPress:() => {
                        deleteReq();
                        setOpen(false);
                    },
                }
            ])
    }

    const confirmAccept = () => {
        Alert.alert("Confirmation",
            "Do you want to accept this request?",
            [
                {
                    text:'Cancel',
                    onPress:() => {},
                },
                {
                    text:'Confirm',
                    onPress:() => {
                        acceptReq();
                        setOpen(false);
                    },
                }
            ]
            )
    }

    // CHAT WITH PLAYER =====================================================================================================
    const chatWithPerson = () => {
        const hostId = props.refDetails.hostId
        const otherUserId = props.refDetails.refereeId
        const smallerId = hostId < otherUserId ? hostId : otherUserId
        const largerId = hostId < otherUserId ? otherUserId : hostId
        const chatId = smallerId + '_' + largerId
        const chatRef = firebaseDb
            .firestore()
            .collection('messages')
        if (hostId === otherUserId) {
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

                                            navigation.navigate('ChatScreen', {
                                                chat: data,
                                                userId: hostId
                                            })
                                        })
                                        .catch(error => console.log(error))
                                })
                                .catch(error => console.log(error))
                        })
                        .catch(error => console.log(error))
                } else {

                    navigation.navigate('ChatScreen', {
                        chat: doc.data(),
                        userId: hostId
                    })
                }
            })
            .catch(error => console.log(error))
    }

    // PROFILE CARD BACKGROUND ===========================================================================================
    let profileBack = require("../assets/tennis_coloured.png");
    let refBack = require("../assets/OthersApp.png");
    let sportColor = "rgba(47,49,53,1)";

    if(props.refDetails.sport.toLowerCase() === "tennis"){
        profileBack = require("../assets/tennis_coloured.png");
        refBack = require("../assets/TennisRefereeApp.png");
        sportColor = "#a5bb3e";
    } else if(props.refDetails.sport.toLowerCase() === "floorball"){
        profileBack = require("../assets/floorball_coloured.png");
        refBack = require("../assets/floorballRefereeApp.png");
        sportColor = "rgba(58,204,255,1)";
    } else if(props.refDetails.sport.toLowerCase() === "basketball"){
        profileBack = require("../assets/basketball_coloured.png");
        refBack = require("../assets/BballRefereeApp.png");
        sportColor = "rgba(200,98,57,1)";
    } else if(props.refDetails.sport.toLowerCase() === "soccer"){
        profileBack = require("../assets/soccer_coloured.png");
        refBack = require("../assets/SoccerRefereeApp.png");
        sportColor = "rgba(134,119,198,1)";
    } else if(props.refDetails.sport.toLowerCase() === "badminton"){
        profileBack = require("../assets/badminton_coloured.png");
        refBack = require("../assets/BadmintonRefereeApp.png");
        sportColor = "rgba(211,55,64,1)";
    }

    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.refDetails.date
    let gameTime = props.refDetails.date
    if(props.refDetails.date){
        gameDate = props.refDetails.date.toDate().toString().slice(4,15);
        gameTime = props.refDetails.date.toDate().toString().slice(16,21);
    }

    //MODAL STATE =====================================================================================================================
    const [openDetails, setOpen] = useState(false);

    const refItem = <Modal visible={openDetails}>
        <ImageBackground source={refBack} opacity={0.8} style ={{height:"100%", width:"100%"}}>
            <View style = {{...Styles.innerHeaderStyle, backgroundColor: sportColor}}>
                <TouchableOpacity activeOpacity={0.8} style={{flexDirection:"row",justifyContent:"center", alignItems:"center",position: 'absolute', left: 10,bottom: 5}}
                                  onPress={() => setOpen(false)}
                >
                    <Ionicons name="ios-arrow-back" size={27} style={{color: 'white'}}/>
                    <Text style = {{fontSize: 20, marginLeft: 6, color: 'white'}}>Back</Text>
                </TouchableOpacity>
                <Text style = {{...styles.titleStyle, color: 'white', bottom: 5}}>Referee Details</Text>
                <TouchableOpacity activeOpacity={0.8} style={{position: 'absolute', right: 10, bottom: 5}}
                                  onPress={() => {
                                      props.closeRB()
                                      chatWithPerson()
                                      setOpen(false)
                                  }}>
                    <MaterialCommunityIcons name="chat" size={27} style={{color: 'white'}}/>
                </TouchableOpacity>

            </View>
            <View style = {{flexDirection: 'column', justifyContent: 'space-around',alignItems:"center", paddingTop: 5,}}>
                <View style = {{...styles.elevatedComponent, height: 225, alignItems: 'center'}}>
                    <View style = {styles.photoFrame}>
                        <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {{
                            uri: props.refDetails.refereeUri
                        }}/>
                    </View>

                    <View style = {{marginTop: 10}}>
                        <Text style = {{fontSize: 20}}> Name: {props.refDetails.refereeName}</Text>
                        <Text style = {{fontSize: 20}}> Username: {props.refDetails.refereeUserName} </Text>
                        <Text style = {{fontSize: 20}}> Email: {props.refDetails.refereeEmail}</Text>

                    </View>
                </View>

                <View style = {{...styles.elevatedComponent, height: 145}}>
                    <View style={styles.requestTitle}>
                        <Text style={{fontSize:25}}>Requests to referee</Text>
                    </View>

                    <View style={{...styles.games}}
                          onPress={() => {
                              setOpen(true);
                          }}>

                        <View style={{flexDirection:"column"}}>
                            <Text style={{fontWeight:"bold", fontSize:25, color: "black"}}>{props.refDetails.sport.toUpperCase()} </Text>
                            <View style={{flexDirection:"row", alignItems:"center",}}>
                                <MaterialCommunityIcons name="calendar-range" size={20}/>
                                <Text style={{fontSize:20, color:"black",}}>  {gameDate} </Text>
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialCommunityIcons name="clock-outline" size={20}/>
                                <Text style={{fontSize:20, color:"black"}}>  {gameTime}</Text>
                            </View>

                        </View>

                        <GameItemBackGround iconName={props.refDetails.sport.toLowerCase()} style={{height:108, zIndex: -10}}/>

                    </View>

                </View>

                <View style ={{flexDirection: 'row', width: '100%', top: 50, justifyContent: "space-evenly"}}>
                    <GradientButton style={{width: 120, height:45,}}
                                    colors = {['#e52d27', '#b31217']}
                                    onPress = {confirmDecline}
                                    textStyle = {{fontSize: 20}}>
                        Decline
                    </GradientButton>



                    <GradientButton style={{width: 120, height:45,}}
                                    colors = {['#ff8400','#e56d02']}
                                    textStyle = {{fontSize: 20}}
                                    onPress = {confirmAccept}
                    >
                        Accept
                    </GradientButton>
                </View>
            </View>
    </ImageBackground>
    </Modal>



    return (
        <View>
            {refItem}
            <TouchableOpacity style={{...styles.games,borderBottomWidth:0.7,}}
                              onPress={() => {
                                  setOpen(true);
                              }}>


                <View style={{flexDirection:"column", justifyContent:"flex-start"}}>
                    <Text style={{fontWeight:"bold", fontSize:25, color: "black"}}>{props.refDetails.sport.toUpperCase()} </Text>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="account-outline" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {props.refDetails.refereeName} </Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="calendar-range" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {gameDate} </Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="clock-outline" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {gameTime}</Text>
                    </View>

                </View>

                <GameItemBackGround iconName={props.refDetails.sport.toLowerCase()} style={{height:108}}/>


            </TouchableOpacity>
        </View>


    )
}


const styles = StyleSheet.create({
    photoFrame: {
        height: 85,
        width: 85,
        borderRadius: 170,
        elevation: 10,
        justifyContent: 'center',
        alignItems:'center',
        borderWidth: 2,
        backgroundColor: 'white',
    },
    games:{
        flexDirection:"row",

        borderColor:"grey",
        width:"100%",
        height:110,
        padding:5,
        justifyContent:"space-around",
        alignItems:"center",
        backgroundColor:"transparent",
    },
    elevatedComponent: {
        width: '90%',
        height: 200,
        elevation: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        marginTop: 25,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    requestTitle :{
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(66,231,147,0.49)",
        height:35
    },
    titleStyle: {
        color: 'white',
        justifyContent: 'center',
        fontSize: 21,
        fontWeight: "bold",
    },
})

export default RefereeApplicationItem;
