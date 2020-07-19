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




const RefereeApplicationItem = props => {
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
        applRef.delete().then(()=>{})
    }
    console.log(props)
    const acceptReq = () => {
        const slots = parseInt(details.refereeSlots) - 1
        gameRef.update({refereeSlots:slots.toString(), refereeList: firebase.firestore.FieldValue.arrayUnion(props.refDetails.refereeId)})
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
            "Do you want to accept this request?",
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



    // PROFILE CARD BACKGROUND ===========================================================================================
    let profileBack = require("../assets/tennis_coloured.png");
    let refBack = require("../assets/BballRefereeApp.png");
    if(props.refDetails.sport.toLowerCase() === "tennis"){
        profileBack = require("../assets/tennis_coloured.png");
        refBack = require("../assets/TennisRefereeApp.png");
    } else if(props.refDetails.sport.toLowerCase() === "floorball"){
        profileBack = require("../assets/floorball_coloured.png");
        refBack = require("../assets/floorballRefereeApp.png");
    } else if(props.refDetails.sport.toLowerCase() === "basketball"){
        profileBack = require("../assets/basketball_coloured.png");
        refBack = require("../assets/BballRefereeApp.png");
    } else if(props.refDetails.sport.toLowerCase() === "soccer"){
        profileBack = require("../assets/soccer_coloured.png");
        refBack = require("../assets/SoccerRefereeApp.png");
    } else if(props.refDetails.sport.toLowerCase() === "badminton"){
        profileBack = require("../assets/badminton_coloured.png");
        refBack = require("../assets/BadmintonRefereeApp.png");
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
        {/*<Background>*/}
            <View style = {{flexDirection: 'column', justifyContent: 'space-around',alignItems:"center", paddingTop: 5,}}>
                <View style = {{...styles.elevatedComponent, height: 225}}>
                    {/*<ImageBackground source={profileBack} style ={{width:"100%",height:"100%"}}>*/}
                        <View style = {{marginTop:10}}>
                            <View style={{flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                                <View style = {styles.photoFrame}>
                                    <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {{
                                        uri: props.refDetails.refereeUri
                                    }}/>
                                </View>

                                <View style = {{paddingLeft: 30, marginTop: 10}}>
                                    <Text style = {{fontSize: 20}}> Name: {props.refDetails.refereeName}</Text>
                                    <Text style = {{fontSize: 20}}> Username: {props.refDetails.refereeUserName} </Text>
                                    <Text style = {{fontSize: 20}}> Email: {props.refDetails.refereeEmail}</Text>

                                </View>
                            </View>
                        </View>
                    {/*</ImageBackground>*/}
                </View>

                <View style = {{...styles.elevatedComponent, height: 135}}>
                    <View style={styles.requestTitle}>
                        <Text style={{fontSize:25}}>REQUESTS TO REFEREE</Text>
                    </View>

                    <View style={{...styles.games}}
                          onPress={() => {
                              setOpen(true);
                          }}>

                        <View style={{flexDirection:"column"}}>
                            <Text style={{fontWeight:"bold", fontSize:25, color: "black"}}>{props.refDetails.sport} </Text>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialCommunityIcons name="calendar-range" size={20}/>
                                <Text style={{fontSize:20, color:"black"}}>  {gameDate} </Text>
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialCommunityIcons name="clock-outline" size={20}/>
                                <Text style={{fontSize:20, color:"black"}}>  {gameTime}</Text>
                            </View>

                        </View>

                        <GameItemBackGround iconName={props.refDetails.sport.toLowerCase()} style={{height:93}}/>

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
                                    onPress = {confirmAccept}
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
            <TouchableOpacity style={{...styles.games}}
                              onPress={() => {
                                  setOpen(true);
                              }}>


                <View style={{flexDirection:"column", justifyContent:"flex-start"}}>
                    <Text style={{fontWeight:"bold", fontSize:25, color: "black"}}>{props.refDetails.sport} </Text>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="calendar-range" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {gameDate} </Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="clock-outline" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {gameTime}</Text>
                    </View>

                </View>

                <GameItemBackGround iconName={props.refDetails.sport.toLowerCase()} style={{height:90}}/>


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

export default RefereeApplicationItem;
