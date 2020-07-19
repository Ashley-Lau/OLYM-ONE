import React from 'react';
import {Text, StyleSheet, Modal, View, ScrollView, Image, ImageBackground, TouchableOpacity, Dimensions} from 'react-native';
import * as firebase from 'firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";
import JoinItem from "./JoinItem";
import UpcomingRefereeItem from "./UpcomingRefereeItem";
import RefereeItem from "./RefereeItem";
import UpcomingGameItem from "./UpcomingGameItem";


const GameDetailsModal = props => {

    // DEVICE WIDTH AND HEIGHT===========================================================================================
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;

    //SPORT BG and colour================================================================================================================================
    let sportBG = require("../assets/BballBG.png");
    let sportColor = "rgba(0,0,0,1)"
    let lightColor = "rgb(255,255,255)"
    if(props.gameDetails.sport.toLowerCase() === "basketball"){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/BballRefereeApp.png");
        } else {
            sportBG = require("../assets/BballApp.png");
        }
        sportColor = "rgba(200,98,57,1)";
        lightColor = "rgb(252,238,184)"

    } else if(props.gameDetails.sport.toLowerCase() === "soccer"){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/SoccerRefereeApp.png");
        } else {
            sportBG = require("../assets/SoccerApp.png");
        }
        sportColor = "rgba(134,119,198,1)";
        lightColor = "rgb(195,185,206)"

    } else if(props.gameDetails.sport.toLowerCase() === "floorball"){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/floorballRefereeApp.png");
        } else {
            sportBG = require("../assets/floorballApp.png");
        }
        sportColor = "rgba(58,204,255,1)";
        lightColor = "rgb(228,235,255)"

    } else if(props.gameDetails.sport.toLowerCase() === "tennis" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/TennisRefereeApp.png");
        } else {
            sportBG = require("../assets/TennisApp.png");
        }
        sportColor = "rgba(212,242,102,1)";
        lightColor = "rgb(196,172,19)"
    } else if(props.gameDetails.sport.toLowerCase() === "badminton" ) {
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/BadmintonRefereeApp.png");
        } else {
            sportBG = require("../assets/BadmintonApp.png");
        }
        sportColor = "rgba(211,55,64,1)";
        lightColor = "rgb(218,138,158)"

    }

    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.gameDetails.date
    let gameTime = props.gameDetails.date
    if(props.gameDetails.date){
        gameDate = gameDate.toDate().toString().slice(4,15);
        gameTime = gameTime.toDate().toString().slice(16,21);
    }


    return (
        <View>

            <Modal visible = {props.visible} animationType="slide">
                <View style={{...styles.header, backgroundColor:sportColor, width:width}}>
                    <TouchableOpacity activeOpacity={0.6} style={{flexDirection:"row",justifyContent:"center", alignItems:"center", marginLeft:5}}
                                      onPress={props.closeGame}
                    >
                        <Ionicons name="ios-arrow-back" size={40} style={{color:lightColor}}/>
                        <Text style = {{fontSize: 30, marginLeft: 6, color: lightColor}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} style={{marginRight:5}} onPress={props.chatFunction}>
                        <MaterialCommunityIcons name="chat" size={40} style={{color:lightColor}}/>
                    </TouchableOpacity>

                </View>

                <View style={{flexDirection:"column", flex:1, backgroundColor:lightColor}}>

                    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>

                        <View style={styles.scrollBox}>

                            <ScrollView contentContainerStyle={{marginLeft:5, marginBottom:20}}>

                                    <View>
                                        <Text style={{fontWeight:"bold", fontSize:35}}>{props.gameDetails.sport.toUpperCase()}</Text>

                                        {/*Game Details*/}

                                        <View style = {{flexDirection:"column", alignItems:"center", paddingHorizontal:5, paddingVertical:10}}>

                                            <Text style={{fontWeight:"bold", fontSize:20, marginBottom:5, alignSelf:"flex-start"}}>GAME DETAILS</Text>

                                            <View style = {{ width:0.95 * width, ...styles.gameDetails}}>
                                                <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                    <View style={{flexDirection:"row", alignItems:"center"}}>
                                                        <MaterialCommunityIcons name="account" size={25} color={"black"}/>
                                                        <Text style={{fontSize:20, color:"black"}}>  Hosted By:</Text>
                                                    </View>
                                                    <Text style={{fontSize:20, color:"grey", marginLeft:25}}>  {props.gameDetails.host}</Text>
                                                </View>

                                                <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                    <View style={{flexDirection:"row", alignItems:"center"}}>
                                                        <MaterialCommunityIcons name="map-marker" size={25} color={"black"}/>
                                                        <Text style={{fontSize:20, color:"black"}}>  Location:</Text>
                                                    </View>
                                                    <Text style={{fontSize:20, color:"grey", marginLeft:25}}>  {props.gameDetails.specificLocation} @ {props.gameDetails.location}</Text>
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
                                                                      props.openPlayer();}}
                                                >
                                                    <Text style={{fontSize:20}}>{props.gameDetails.players.length} Players</Text>

                                                    <Ionicons name="ios-arrow-forward" size={20}/>

                                                </TouchableOpacity>


                                                <TouchableOpacity style={styles.viewPlayer}
                                                                  onPress={() => {
                                                                      props.openReferee();}}
                                                >
                                                    <Text style={{fontSize:20}}>{props.gameDetails.refereeList.length} Referees</Text>

                                                    <Ionicons name="ios-arrow-forward" size={20}/>

                                                </TouchableOpacity>
                                            </View>

                                        </View>

                                        {/*NOTES*/}


                                        {props.gameDetails.notes !== ''
                                        ?
                                            <View style = {{flexDirection:"column", alignItems:"center", paddingHorizontal:5, marginBottom:10}}>
                                                <Text style={{fontWeight:"bold", fontSize:20, marginBottom:5, alignSelf:"flex-start"}}>TO TAKE NOTE:</Text>

                                                <View style = {{...styles.playerReferee, width:0.95 * width, paddingVertical:15}}
                                                            nestedScrollEnabled={true}
                                                >
                                                    <Text style={{fontSize:20, color:"grey"}}>{props.gameDetails.notes}</Text>
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

                    {props.itemType === "Join" || "Quit"
                    ?
                        <View>
                            <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                <Text style={{fontSize:25, marginLeft:15, color:lightColor}}>${parseFloat(props.gameDetails.price).toFixed(2)}</Text>
                                <Text style={{fontSize:15, color:lightColor, marginLeft:15}}> {props.gameDetails.availability} Slots Left!</Text>
                            </View>

                        </View>

                    :
                        <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                            <Text style={{fontSize:25, color:lightColor, marginLeft:15}}> {props.gameDetails.refereeSlots} Slots Left!</Text>
                        </View>

                    }



                    {props.itemType === "Join"
                        ?
                        <JoinItem gameDetails ={props.gameDetails}
                                  gameId ={props.gameId}
                                  user = {props.user}
                                  closeGame = {props.closeGame}
                                  textColor = {sportColor}
                                  style = {{...styles.bottomButtons, borderColor:lightColor, backgroundColor:lightColor}}
                        />
                        : props.itemType === "Referee"
                            ?
                            <RefereeItem gameDetails ={props.gameDetails}
                                         gameId ={props.gameId}
                                         user = {props.user}
                                         closeGame = {props.closeGame}
                                         textColor = {sportColor}
                                         style = {{...styles.bottomButtons, borderColor:lightColor, backgroundColor:lightColor}}

                            />
                            :  props.itemType === "Quit"
                                ?
                                <UpcomingGameItem gameDetails ={props.gameDetails}
                                                  gameId ={props.gameId}
                                                  user = {props.user}
                                                  closeGame = {props.closeGame}
                                                  textColor = {sportColor}
                                                  style = {{...styles.bottomButtons, borderColor:lightColor, backgroundColor:lightColor}}

                                />
                                :
                                <UpcomingRefereeItem gameDetails ={props.gameDetails}
                                                     gameId ={props.gameId}
                                                     user = {props.user}
                                                     closeGame = {props.closeGame}
                                                     textColor = {sportColor}
                                                     style = {{...styles.bottomButtons, borderColor:lightColor, backgroundColor:lightColor}}

                                />
                    }


                </View>



            </Modal>

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
