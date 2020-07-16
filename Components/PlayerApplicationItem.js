import React, {useState, useEffect} from 'react';
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

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import firebaseDb from "../firebaseDb";
import GameItemBackGround from "../views/GameItemBackGround";
import Styles from "../styling/Styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";




const PlayerApplicationItem = props => {
    //GETTING CURRENT GAME INFO ========================================================================================
    const gameRef = firebaseDb.firestore().collection("game_details").doc(props.playerDetails.gameId);
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
    const applRef = firebaseDb.firestore().collection("player_application_details").doc(props.appId)


    const deleteReq = () => {
        applRef.delete().then(()=>{})
    }

    const acceptReq = () => {
        const slots = parseInt(details.availability) - 1
        gameRef.update({availability : slots.toString(), players: firebase.firestore.FieldValue.arrayUnion(props.playerDetails.playerId)})
            .then(()=>{deleteReq()});
    }

    const acceptFunction = () => {
        if(details.availability <= 0){
            return noMoreSlot();
        } else {
            return confirmAccept();
        }
    }


    //ALERTS FOR CONFIRMATION AND TO INFORM USER IF THERE ARE NO SLOTS LEFT ============================================

    const confirmDecline = () => {
        Alert.alert("Confirmation",
            "Are you sure you want to decline this player's request?",
            [
                {
                    text:'Cancel',
                    onPress:() => {},
                    style:'cancel'
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
            "Do you want to accept this player's request?",
            [
                {
                    text:'Cancel',
                    onPress:() => {},
                    style:'cancel'
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

    const noMoreSlot = () => {
        Alert.alert("Warning!",
            "There are no longer any availability left in this game! \n You cannot accept this player into the game! \n Press Confirm to delete this request!",
            [
                {
                    text:'Cancel',
                    onPress:() => {},
                    style:'cancel'
                },
                {
                    text:'Confirm',
                    onPress:() => {
                        deleteReq();
                        setOpen(false);
                    },
                }
            ]
        )

    }



    // PROFILE CARD BACKGROUND ===========================================================================================
    let refBack = require("../assets/BballBG.png");
    if(props.playerDetails.sport.toLowerCase() === "tennis"){
        refBack = require("../assets/TennisApp.png");
    } else if(props.playerDetails.sport.toLowerCase() === "floorball"){
        refBack = require("../assets/floorballApp.png");
    } else if(props.playerDetails.sport.toLowerCase() === "basketball"){
        refBack = require("../assets/BballApp.png");
    } else if(props.playerDetails.sport.toLowerCase() === "soccer"){
        refBack = require("../assets/SoccerApp.png");
    } else if(props.playerDetails.sport.toLowerCase() === "badminton"){
        refBack = require("../assets/BadmintonApp.png");
    }


    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.playerDetails.date
    let gameTime = props.playerDetails.date
    if(props.playerDetails.date){
        gameDate = props.playerDetails.date.toDate().toString().slice(4,15);
        gameTime = props.playerDetails.date.toDate().toString().slice(16,21);
    }

    //MODAL STATE =====================================================================================================================
    const [openDetails, setOpen] = useState(false);

    const refItem = <Modal visible={openDetails}>
        <ImageBackground source={refBack} opacity={0.8} style ={{height:"100%", width:"100%"}}>
            {/*<Background>*/}
            <View style = {{flexDirection: 'column', justifyContent: 'space-around',alignItems:"center", paddingTop: 5,}}>
                <View style = {{...styles.elevatedComponent, height: 225}}>
                    {/*<ImageBackground source={profileBack} style ={{width:"100%",height:"100%"}}>*/}
                    <View style = {{marginTop:10}}>
                        <View style={{flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                            <View style = {styles.photoFrame}>
                                <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {{
                                    uri: props.playerDetails.playerUri
                                }}/>
                            </View>

                            <View style = {{paddingLeft: 30, marginTop: 10}}>
                                <Text style = {{fontSize: 20}}> Name: {props.playerDetails.playerName}</Text>
                                <Text style = {{fontSize: 20}}> Username: {props.playerDetails.playerUserName} </Text>
                                <Text style = {{fontSize: 20}}> Email: {props.playerDetails.playerEmail}</Text>

                            </View>
                        </View>
                    </View>
                    {/*</ImageBackground>*/}
                </View>

                <View style = {{...styles.elevatedComponent, height: 135}}>
                    <View style={styles.requestTitle}>
                        <Text style={{fontSize:25}}>REQUESTS TO JOIN</Text>
                    </View>

                    <View style={{...styles.games}}
                          onPress={() => {
                              setOpen(true);
                          }}>

                        <View style={{flexDirection:"column"}}>
                            <Text style={{fontWeight:"bold", fontSize:25, color: "black"}}>{props.playerDetails.sport} </Text>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialCommunityIcons name="calendar-range" size={20}/>
                                <Text style={{fontSize:20, color:"black"}}>  {gameDate} </Text>
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialCommunityIcons name="clock-outline" size={20}/>
                                <Text style={{fontSize:20, color:"black"}}>  {gameTime}</Text>
                            </View>

                        </View>

                        <GameItemBackGround iconName={props.playerDetails.sport.toLowerCase()} style={{height:93}}/>

                    </View>

                </View>

                <View style ={{...Styles.horizontalbuttonContainer}}>
                    <GradientButton style={{width: 120, height:37, marginRight: 75,}}
                                    colors = {["red", "maroon"]}
                                    onPress = {confirmDecline}
                                    textStyle = {{fontSize: 15}}>
                        DECLINE
                    </GradientButton>



                    <GradientButton style={{width: 120, height:37,}}
                                    colors = {['#1bb479','#026c45']}
                                    textStyle = {{fontSize: 15}}
                                    onPress = {acceptFunction}
                    >
                        ACCEPT
                    </GradientButton>
                </View>

                <View >
                    <GradientButton style={{width: 200, height:45}}
                                    colors = {['#1bb479','#026c45']}
                                    textStyle = {{fontSize: 20}}
                                    onPress = {() => {setOpen(false)}}
                    >
                        Back
                    </GradientButton>
                </View>
            </View>
            {/*</Background>*/}
        </ImageBackground>
    </Modal>



    return (
        <View>
            {refItem}
            <TouchableOpacity style={styles.games}
                              onPress={() => {
                                  setOpen(true);
                              }}>


                <View style={{flexDirection:"column", justifyContent:"flex-start"}}>
                    <Text style={{fontWeight:"bold", fontSize:25, color: "black"}}>{props.playerDetails.sport} </Text>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="calendar-range" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {gameDate} </Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="clock-outline" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {gameTime}</Text>
                    </View>

                </View>

                <GameItemBackGround iconName={props.playerDetails.sport.toLowerCase()} style={{height:90}}/>


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
        borderBottomWidth:0.7,
        borderColor:"grey",
        width:"100%",
        height:100,
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
    }
})

export default PlayerApplicationItem;
