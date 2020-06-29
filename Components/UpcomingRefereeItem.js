import React,{useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, Modal, View, ScrollView, Image, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';



import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";
import firebaseDb from "../firebaseDb"
import GameItemBackGround from "../views/GameItemBackGround";
import ViewPlayerItem from "../Components/ViewPlayerItem"
import {keywordsMaker} from "./SearchBarFunctions";



const UpcomingRefereeItem = props => {
    const navigation = useNavigation()

    //IMAGE LOCATION ==================================================================================================
    let location = require("../assets/tampines.jpg");
    if(props.gameDetails.location.toLowerCase() === "tampines"){
        location = require("../assets/tampines.jpg");
    } else if (props.gameDetails.location.toLowerCase() === "pasir ris"){
        location = require("../assets/pasirris.jpg");
    } else if (props.gameDetails.location.toLowerCase() === "seng kang"){
        location = require("../assets/sengkang.jpg");
    } else if (props.gameDetails.location.toLowerCase() === "punggol"){
        location = require("../assets/punggol.jpg");
    } else if (props.gameDetails.location.toLowerCase() === "clementi"){
        location = require("../assets/clementi.jpg");
    } else if (props.gameDetails.location.toLowerCase() === "hougang"){
        location = require("../assets/hougang_sports_hall.jpg");
    }

    // LIST OF PLAYERS ================================================================================================
    const [playerList, setPlayerList] = useState([]);


    useEffect(() => {
        const unsubscribe = setPlayerList([]);
        let players = [];
        props.gameDetails.players.map(uid => {
            firebaseDb.firestore().collection('users').doc(uid)
                .onSnapshot(doc => {
                    players.push(doc.data().username);
                })
        })
        setPlayerList(players);
    }, [])


    //MODAL VIEWABLE =====================================================================================================
    const [gameDetails, setGameDetails] = useState(false);
    const [playerDetails, setPlayerDetails] = useState(false);

    //UPDATING QUIT GAMES ================================================================================================
    const gameRef = firebaseDb.firestore().collection('game_details').doc(props.gameId);
    const userRef = firebaseDb.firestore().collection('users').doc(props.user);

    const quitGame = () => {
        gameRef.update({referee: firebase.firestore.FieldValue.arrayRemove(props.user)}).then(()=>{})
    }

    const confirmQuit = () => {
        Alert.alert(
            "Confirm Resignation",
            "Are you sure you want to resign as a referee for this game?",
            [
                {
                    text:'Cancel',
                    onPress:() => {},
                    style:'cancel'
                },
                {
                    text:'Confirm',
                    onPress:() => {
                        quitGame();
                        setGameDetails(false);
                    },
                }
            ]
        )
    }

    //SPORT ICON ================================================================================================================================
    let gameColor = "rgba(47,47,47,0.32)";
    let sportIcon = props.gameDetails.sport.toLowerCase()


    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.gameDetails.date
    let gameTime = props.gameDetails.date
    if(props.gameDetails.date){
        gameDate = props.gameDetails.date.toDate().toString().slice(4,15);
        gameTime = props.gameDetails.date.toDate().toString().slice(16,21);
    }

    // chatting with host function ====================================================================================
    const chatWithHost = () => {
        const hostId = props.gameDetails.hostId
        const currentUserId = props.user
        const smallerId = hostId < currentUserId ? hostId : currentUserId
        const largerId = hostId < currentUserId ? currentUserId : hostId
        const chatId = smallerId + '_' + largerId
        const chatRef = firebaseDb
            .firestore()
            .collection('messages')
        if (hostId === currentUserId) {
            Alert.alert('You are The host!', 'Cannot talk to yourself')
            return;
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
                                            setGameDetails(false)
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
                    setGameDetails(false)
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




    return (<View>
            <ViewPlayerItem visible={playerDetails}
                            closePlayer={() => setPlayerDetails(false)}
                            username={playerList}
            />
            <Modal visible = {gameDetails} animationType="slide">
                <Background style={{top: 0,right:0, position:"absolute"}}/>

                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>

                    <View style={styles.scrollBox}>

                        <ScrollView style={{flex:1}}>
                            <ScrollView nestedScrollEnabled={true} horizontal={true}>
                                <Image source={location} style={{flexWrap:"wrap"}}/>
                            </ScrollView>
                            <View style={{alignItems:"center"}}>
                                <View>
                                    <Text style={{fontSize:35}}>{props.gameDetails.sport.toUpperCase()}</Text>
                                    <Text style={{fontSize:20}}>Location: {props.gameDetails.location}</Text>
                                    <Text style={{fontSize:20}}>Host : {props.gameDetails.host}</Text>
                                    <Text style={{fontSize:20}}>Date  : {gameDate}</Text>
                                    <Text style={{fontSize:20}}>Time : {gameTime}</Text>
                                    <Text style={{fontSize:20}}>{props.gameDetails.notes}</Text>
                                </View>
                            </View>
                            <View style = {{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                                <GradientButton style={{width: '27%', marginLeft: 20}}
                                                onPress={chatWithHost}
                                                colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                                    Chat with host
                                </GradientButton>
                                <GradientButton style={{width: '27%', marginRight: 20}}
                                                onPress={() => {
                                                    setPlayerDetails(true);}}
                                                colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
                                    View Players
                                </GradientButton>
                            </View>
                            <View style = {{marginBottom: 20}} />
                        </ScrollView>
                    </View>

                    <View style={{...Styles.horizontalbuttonContainer}}>
                        <GradientButton onPress={() => {
                            confirmQuit();

                        }}
                                        colors={["red", "maroon"]}
                                        style={{...Styles.buttonSize, marginRight:75}}>
                            <Text>Resign</Text>
                        </GradientButton>

                        <GradientButton style={{...Styles.buttonSize}}
                                        onPress={() => {
                                            setGameDetails(false);
                                        }}
                                        colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
                            <Text>Back</Text>
                        </GradientButton>
                    </View>
                </View>

            </Modal>
            <TouchableOpacity style={styles.games}
                              onPress={() => {
                                  setGameDetails(true);
                              }}>

                <GameItemBackGround iconName={sportIcon} color={gameColor}>
                    <Text style={{fontSize:18, color: "black", marginLeft:10}}>{props.gameDetails.sport} </Text>
                </GameItemBackGround>


                <View style={{flexDirection:"column"}}>
                    <Text style={{fontSize:18, color:"black"}}>Date: {gameDate}</Text>
                    <Text style={{fontSize:18, color:"black"}}>Time: {gameTime} </Text>
                </View>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    games:{
        flexDirection:"row",
        borderBottomWidth:0.7,
        borderColor:"grey",
        width:"100%",
        height:65,
        padding:5,
        justifyContent:"space-between",
        alignItems:"center",
        backgroundColor:"transparent",
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

    }
})


export default UpcomingRefereeItem;
