import React, {useEffect, useState} from 'react';
import {
    Text,
    StyleSheet,
    Modal,
    View,
    ScrollView,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native';
import * as firebase from 'firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from "@react-navigation/native";


import JoinItem from "./JoinItem";
import UpcomingRefereeItem from "./UpcomingRefereeItem";
import RefereeItem from "./RefereeItem";
import UpcomingGameItem from "./UpcomingGameItem";
import firebaseDb from "../firebaseDb";
import {keywordsMaker} from "./SearchBarFunctions";
import ViewPlayerItem from "./ViewPlayerItem";


const GameDetailsModal = props => {

    const navigation = useNavigation();

    // DEVICE WIDTH AND HEIGHT===========================================================================================
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;

    //CHAT FUNCTION====================================================================================================

    const chatWithHost = () => {
        const hostId = props.route.params.gameDetails.hostId
        const currentUserId = props.route.params.user.id
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

    //SPORT BG and colour================================================================================================================================
    let sportBG = require("../assets/OthersBG.png");
    let playerBG = require("../assets/OthersApp.png");
    let refereeBG = require("../assets/OthersApp.png");
    let sportColor = "rgba(47,49,53,1)"
    let lightColor = "rgb(107,107,107)"
    if(props.route.params.gameDetails.sport.toLowerCase() === "basketball" ){
        if(props.route.params.itemType === "Referee" || props.route.params.itemType === "Resign"){
            sportBG = require("../assets/BballRefereeBG.png");
        } else {
            sportBG = require("../assets/BballBG.png");
        }
        refereeBG = require("../assets/BballRefereeApp.png");
        playerBG = require("../assets/BballApp.png");
        sportColor = "rgba(200,98,57,1)";
        lightColor = "rgb(252,238,184)"

    } else if(props.route.params.gameDetails.sport.toLowerCase() === "soccer" ){
        if(props.route.params.itemType === "Referee" || props.route.params.itemType === "Resign"){
            sportBG = require("../assets/SoccerRefereeBG.png");
        } else {
            sportBG = require("../assets/SoccerBG.png");
        }
        refereeBG = require("../assets/SoccerRefereeApp.png");
        playerBG = require("../assets/SoccerApp.png");
        sportColor = "rgba(134,119,198,1)";
        lightColor = "rgb(195,185,206)"

    } else if(props.route.params.gameDetails.sport.toLowerCase() === "floorball" ){
        if(props.route.params.itemType === "Referee" || props.route.params.itemType === "Resign"){
            sportBG = require("../assets/floorballRefereeBG.png");
        } else {
            sportBG = require("../assets/floorballBG.png");
        }
        refereeBG = require("../assets/floorballRefereeApp.png");
        playerBG = require("../assets/floorballApp.png");
        sportColor = "rgba(58,204,255,1)";
        lightColor = "rgb(228,235,255)"

    } else if(props.route.params.gameDetails.sport.toLowerCase() === "tennis" ){
        if(props.route.params.itemType === "Referee" || props.route.params.itemType === "Resign"){
            sportBG = require("../assets/TennisRefereeBG.png");
        } else {
            sportBG = require("../assets/TennisBG.png");
        }
        refereeBG = require("../assets/TennisRefereeApp.png");
        playerBG = require("../assets/TennisApp.png");
        sportColor = "rgba(212,242,102,1)";
        lightColor = "rgb(196,172,19)";

    } else if(props.route.params.gameDetails.sport.toLowerCase() === "badminton" ){
        if(props.route.params.itemType === "Referee" || props.route.params.itemType === "Resign"){
            sportBG = require("../assets/BadmintonRefereeBG.png");
        } else {
            sportBG = require("../assets/BadmintonBG.png");
        }
        playerBG = require("../assets/BadmintonApp.png");
        refereeBG = require("../assets/BadmintonRefereeApp.png");
        sportColor = "rgba(211,55,64,1)";
        lightColor = "rgb(218,138,158)"
    }

    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.route.params.gameDetails.date
    let gameTime = props.route.params.gameDetails.date
    if(props.route.params.gameDetails.date){
        gameDate = gameDate.toDate().toString().slice(4,15);
        gameTime = gameTime.toDate().toString().slice(16,21);
    }

    // LIST OF PLAYERS AND REFEREE ================================================================================================
    const [playerUser, setPlayerUser] = useState([]);
    const [refereeUser, setRefereeUser] = useState([]);

    const username = () => {
        setPlayerUser([]);
        let playerList = [];
        props.route.params.gameDetails.players.map(uid => {
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
        props.route.params.gameDetails.refereeList.map(uid => {
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


    return (
        <View style={{flex:1}}>

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

            {/*<Modal visible = {props.route.params.visible} animationType="slide">*/}
                <View style={{...styles.header, backgroundColor:sportColor, width:width}}>
                    <TouchableOpacity activeOpacity={0.6} style={{flexDirection:"row",justifyContent:"center", alignItems:"center", marginLeft:5}}
                                      onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="ios-arrow-back" size={40} style={{color:lightColor}}/>
                        <Text style = {{fontSize: 30, marginLeft: 6, color: lightColor}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} style={{marginRight:5}} onPress={() => chatWithHost()}>
                        <MaterialCommunityIcons name="chat" size={40} style={{color:lightColor}}/>
                    </TouchableOpacity>

                </View>

                <View style={{flexDirection:"column", flex:1, backgroundColor:lightColor}}>

                    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>

                        <View style={styles.scrollBox}>

                            <ScrollView contentContainerStyle={{marginLeft:5, marginBottom:20}}>

                                    <View>
                                        <Text style={{fontWeight:"bold", fontSize:35}}>{props.route.params.gameDetails.sport.toUpperCase()}</Text>

                                        {/*Game Details*/}

                                        <View style = {{flexDirection:"column", alignItems:"center", paddingHorizontal:5, paddingVertical:10}}>

                                            <Text style={{fontWeight:"bold", fontSize:20, marginBottom:5, alignSelf:"flex-start"}}>GAME DETAILS</Text>

                                            <View style = {{ width:0.95 * width, ...styles.gameDetails}}>
                                                <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                    <View style={{flexDirection:"row", alignItems:"center"}}>
                                                        <MaterialCommunityIcons name="account" size={25} color={"black"}/>
                                                        <Text style={{fontSize:20, color:"black"}}>  Hosted By:</Text>
                                                    </View>
                                                    <Text style={{fontSize:20, color:"grey", marginLeft:25}}>  {props.route.params.gameDetails.host}</Text>
                                                </View>

                                                <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                    <View style={{flexDirection:"row", alignItems:"center"}}>
                                                        <MaterialCommunityIcons name="map-marker" size={25} color={"black"}/>
                                                        <Text style={{fontSize:20, color:"black"}}>  Location:</Text>
                                                    </View>
                                                    <Text style={{fontSize:20, color:"grey", marginLeft:25}}>  {props.route.params.gameDetails.specificLocation} @ {props.route.params.gameDetails.location}</Text>
                                                </View>

                                                <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                    <View style={{flexDirection:"row", alignItems:"center"}}>
                                                        <MaterialCommunityIcons name="clock" size={25} color={"black"}/>
                                                        <Text style={{fontSize:20, color:"black"}}>  Date:</Text>
                                                    </View>
                                                    <Text style={{fontSize:20, color:"grey",marginLeft:25}}>  {gameDate} @ {gameTime}</Text>
                                                </View>

                                            </View>

                                        </View>

                                        {/*Attendees*/}

                                        <View style = {{flexDirection:"column", alignItems:"center", paddingHorizontal:5, paddingVertical:10}}>
                                            <Text style={{fontWeight:"bold", fontSize:20, marginBottom:5, alignSelf:"flex-start"}}>ATTENDEES</Text>

                                            <View style = {{...styles.playerReferee, width:0.95 * width, paddingVertical:10}}>
                                                <TouchableOpacity style={{...styles.viewPlayer, borderBottomWidth:0.5}}
                                                                  onPress={() => {
                                                                      openPlayerDetails(true);}}
                                                >
                                                    <Text style={{fontSize:20}}>{props.route.params.gameDetails.players.length} Players</Text>

                                                    <Ionicons name="ios-arrow-forward" size={20}/>

                                                </TouchableOpacity>


                                                <TouchableOpacity style={styles.viewPlayer}
                                                                  onPress={() => {
                                                                      openRefereeDetails(true)}}
                                                >
                                                    <Text style={{fontSize:20}}>{props.route.params.gameDetails.refereeList.length} Referees</Text>

                                                    <Ionicons name="ios-arrow-forward" size={20}/>

                                                </TouchableOpacity>
                                            </View>

                                        </View>

                                        {/*NOTES*/}


                                        {props.route.params.gameDetails.notes !== ''
                                        ?
                                            <View style = {{flexDirection:"column", alignItems:"center", paddingHorizontal:5, marginBottom:10}}>
                                                <Text style={{fontWeight:"bold", fontSize:20, marginBottom:5, alignSelf:"flex-start"}}>TO TAKE NOTE:</Text>

                                                <View style = {{...styles.playerReferee, width:0.95 * width, paddingVertical:15}}
                                                            nestedScrollEnabled={true}
                                                >
                                                    <Text style={{fontSize:20, color:"grey"}}>{props.route.params.gameDetails.notes}</Text>
                                                </View>
                                            </View>
                                        :
                                            <View/>
                                        }

                                    </View>


                            </ScrollView>
                        </View>


                    </View>
                </View>


                <View style={{...styles.bottomOptions, backgroundColor: sportColor}}>

                    {props.route.params.itemType === "Join" || "Quit"
                    ?
                        <View>
                            <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                <Text style={{fontSize:25, marginLeft:15, color:lightColor}}>${parseFloat(props.route.params.gameDetails.price).toFixed(2)}</Text>
                                <Text style={{fontSize:15, color:lightColor, marginLeft:15}}> {props.route.params.gameDetails.availability} Slots Left!</Text>
                            </View>

                        </View>

                    :
                        <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                            <Text style={{fontSize:25, color:lightColor, marginLeft:15}}> {props.route.params.gameDetails.refereeSlots} Slots Left!</Text>
                        </View>

                    }



                    {props.route.params.itemType === "Join"
                        ?
                        <JoinItem gameDetails ={props.route.params.gameDetails}
                                  gameId ={props.route.params.gameId}
                                  user = {props.route.params.user}
                                  closeGame = {props.route.params.closeGame}
                                  textColor = {sportColor}
                                  style = {{...styles.bottomButtons, borderColor:lightColor, backgroundColor:lightColor}}
                        />
                        : props.route.params.itemType === "Referee"
                            ?
                            <RefereeItem gameDetails ={props.route.params.gameDetails}
                                         gameId ={props.route.params.gameId}
                                         user = {props.route.params.user}
                                         closeGame = {props.route.params.closeGame}
                                         textColor = {sportColor}
                                         style = {{...styles.bottomButtons, borderColor:lightColor, backgroundColor:lightColor}}

                            />
                            :  props.route.params.itemType === "Quit"
                                ?
                                <UpcomingGameItem gameDetails ={props.route.params.gameDetails}
                                                  gameId ={props.route.params.gameId}
                                                  user = {props.route.params.user}
                                                  closeGame = {props.route.params.closeGame}
                                                  textColor = {sportColor}
                                                  style = {{...styles.bottomButtons, borderColor:lightColor, backgroundColor:lightColor}}

                                />
                                :
                                <UpcomingRefereeItem gameDetails ={props.route.params.gameDetails}
                                                     gameId ={props.route.params.gameId}
                                                     user = {props.route.params.user}
                                                     closeGame = {props.route.params.closeGame}
                                                     textColor = {sportColor}
                                                     style = {{...styles.bottomButtons, borderColor:lightColor, backgroundColor:lightColor}}

                                />
                    }


                </View>



            {/*</Modal>*/}

        </View>

    )
}


const styles = StyleSheet.create({
    header:{
        flexDirection:"row",
        height:50,
        elevation:10,
        justifyContent:"space-between",
        alignItems:"center"
    },
    scrollBox:{
        flex:1,
        // borderWidth: 1,
        borderBottomEndRadius:10,
        borderBottomStartRadius:10,
        backgroundColor: "rgba(200,200,200,0.2)",
        width:"100%"
    },
    bottomButtons:{
        height:50,
        width:"40%",
        marginRight:15,
        borderRadius:10,
        borderWidth:1,


    },
    bottomOptions:{
        width:"100%",
        height:105,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",

    },
    playerReferee: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems:"flex-start",
        backgroundColor:"rgb(226,226,226)",
        elevation:5,
        borderRadius:5,
        paddingHorizontal:5
    },
    viewPlayer: {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        width: '100%',
        height:50
    },
    gameDetails:{
        backgroundColor:"rgb(226,226,226)",
        elevation:5,
        borderRadius:5,
        paddingHorizontal:5,
        paddingVertical:10
    }
})

export default GameDetailsModal;
