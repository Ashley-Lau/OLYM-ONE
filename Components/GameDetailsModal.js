import React from 'react';
import {Text, StyleSheet, Modal, View, ScrollView, Image, ImageBackground, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";
import JoinItem from "./JoinItem";
import UpcomingRefereeItem from "./UpcomingRefereeItem";
import RefereeItem from "./RefereeItem";
import UpcomingGameItem from "./UpcomingGameItem";


const GameDetailsModal = props => {

    //SPORT BG and colour================================================================================================================================
    let sportBG = require("../assets/BballBG.png");
    let sportColor = "rgba(0,0,0,1)"
    let lightColor = "rgb(255,255,255)"
    if(props.gameDetails.sport.toLowerCase() === "basketball" && props.itemType === "Referee"){
        sportBG = require("../assets/BballRefereeBG.png");
        sportColor = "rgba(200,98,57,1)";
        lightColor = "rgb(252,238,184)"
    } else if(props.gameDetails.sport.toLowerCase() === "soccer" && props.itemType === "Referee"){
        sportBG = require("../assets/SoccerRefereeBG.png");
        sportColor = "rgba(134,119,198,1)";
        lightColor = "rgb(195,185,206)"
    } else if(props.gameDetails.sport.toLowerCase() === "floorball" && props.itemType === "Referee"){
        sportBG = require("../assets/floorballRefereeBG.png");
        sportColor = "rgba(58,204,255,1)";
        lightColor = "rgb(228,235,255)"
    } else if(props.gameDetails.sport.toLowerCase() === "tennis" && props.itemType === "Referee"){
        sportBG = require("../assets/TennisRefereeBG.png");
        sportColor = "rgba(212,242,102,1)";
        lightColor = "rgb(196,172,19)"
    } else if(props.gameDetails.sport.toLowerCase() === "badminton" && props.itemType === "Referee") {
        sportBG = require("../assets/BadmintonRefereeBG.png");
        sportColor = "rgba(211,55,64,1)";
        lightColor = "rgb(218,138,158)"
    } else if(props.gameDetails.sport.toLowerCase() === "basketball"){
        sportBG = require("../assets/BballBG.png");
        sportColor = "rgba(200,98,57,1)";
        lightColor = "rgb(252,238,184)"
    } else if(props.gameDetails.sport.toLowerCase() === "soccer"){
        sportBG = require("../assets/SoccerBG.png");
        sportColor = "rgba(134,119,198,1)";
        lightColor = "rgb(195,185,206)"
    } else if(props.gameDetails.sport.toLowerCase() === "floorball"){
        sportBG = require("../assets/floorballBG.png");
        sportColor = "rgba(58,204,255,1)";
        lightColor = "rgb(228,235,255)"
    } else if(props.gameDetails.sport.toLowerCase() === "tennis"){
        sportBG = require("../assets/TennisBG.png");
        sportColor = "rgba(212,242,102,1)";
        lightColor = "rgb(196,172,19)"
    } else if(props.gameDetails.sport.toLowerCase() === "badminton") {
        sportBG = require("../assets/BadmintonBG.png");
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

                <ImageBackground source={sportBG} style={{flexDirection:"column", flex:1}}>

                    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                        <View style={{flexDirection:"row", height:50, width:"100%", backgroundColor:sportColor, elevation:10, justifyContent:"space-between", alignItems:"center"}}>
                            <TouchableOpacity activeOpacity={0.6} style={{marginLeft:5}} onPress={props.closeGame}>
                                <MaterialCommunityIcons name="arrow-left" size={40} style={{color:lightColor}}/>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.6} style={{marginRight:5}} onPress={props.chatFunction}>
                                <MaterialCommunityIcons name="chat" size={40} style={{color:lightColor}}/>
                            </TouchableOpacity>



                        </View>

                        <View style={styles.scrollBox}>

                            <ScrollView style={{flex:1}}>

                                <View style = {{alignItems: 'flex-start', marginLeft:5, marginBottom:20}}>
                                    <View>
                                        <Text style={{fontWeight:"bold", fontSize:35}}>{props.gameDetails.sport.toUpperCase()}</Text>


                                        <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                                <MaterialCommunityIcons name="account" size={25} color="grey"/>
                                                <Text style={{fontSize:20, color:"grey"}}>  Hosted By:</Text>
                                            </View>
                                            <Text style={{fontSize:20, color:"black", marginLeft:25}}>  {props.gameDetails.host}</Text>
                                        </View>

                                        <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                                <MaterialCommunityIcons name="map-marker" size={25} color="grey"/>
                                                <Text style={{fontSize:20, color:"grey"}}>  Location:</Text>
                                            </View>
                                            <Text style={{fontSize:20, color:"black", marginLeft:25}}>  {props.gameDetails.location}</Text>
                                        </View>

                                        <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                                <MaterialCommunityIcons name="clock" size={25} color="grey"/>
                                                <Text style={{fontSize:20, color:"grey"}}>  Date:</Text>
                                            </View>
                                            <Text style={{fontSize:20, color:"black",marginLeft:25}}>  {gameDate}</Text>
                                            <Text style={{fontSize:20, color:"black", marginLeft:25}}>  {gameTime}</Text>
                                        </View>


                                        {props.itemType === "Join" || props.itemType === "Quit"
                                        ?
                                            <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                <View style={{flexDirection:"row", alignItems:"center"}}>
                                                    <MaterialCommunityIcons name="account-group-outline" size={25} color="grey"/>
                                                    <Text style={{fontSize:20, color:"grey"}}>  Slots Left:</Text>
                                                </View>
                                                <Text style={{fontSize:20, color:"black", marginLeft:25}}>  {props.gameDetails.availability}</Text>
                                            </View>
                                        :
                                            <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                <View style={{flexDirection:"row", alignItems:"center"}}>
                                                    <MaterialCommunityIcons name="whistle" size={25} color="grey"/>
                                                    <Text style={{fontSize:20, color:"grey"}}>  Referees Required:</Text>
                                                </View>
                                                <Text style={{fontSize:20, color:"black", marginLeft:25}}>  {props.gameDetails.refereeSlots}</Text>
                                            </View>

                                        }

                                        <View style = {styles.playerReferee}>
                                            <TouchableOpacity style={{flexDirection:"column", justifyContent:"center", alignItems:"center", width: '27%'}}
                                                              onPress={() => {
                                                                  props.openPlayer();}}
                                            >
                                                <Text style={{fontSize:20}}>{props.gameDetails.players.length}</Text>
                                                {/*<MaterialCommunityIcons name="account-group" size={35}/>*/}
                                                <Text style={{fontSize:20}}>Players</Text>

                                            </TouchableOpacity>

                                            <Text style={{fontSize:30, color:"grey"}}>   |   </Text>

                                            <TouchableOpacity style={{flexDirection:"column", justifyContent:"center", alignItems:"center", width: '27%', marginLeft: 20}}>
                                                <Text style={{fontSize:20}}>{props.gameDetails.refereeList.length}</Text>
                                                {/*<MaterialCommunityIcons name="whistle" size={35}/>*/}
                                                <Text style={{fontSize:20}}>Referees</Text>

                                            </TouchableOpacity>
                                            {/*<GradientButton style={{width: '27%', marginLeft: 20}}*/}
                                            {/*                onPress={props.chatFunction}*/}
                                            {/*                colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>*/}
                                            {/*    View Referee*/}
                                            {/*</GradientButton>*/}
                                        </View>



                                        {props.gameDetails.notes !== ''
                                        ?
                                            <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                <View style={{flexDirection:"row", alignItems:"flex-start"}}>
                                                    <Text style={{fontWeight:"bold",fontSize:30, color:"grey"}}>To Take Note:</Text>
                                                </View>
                                                <Text style={{fontSize:20, color:"black"}}>{props.gameDetails.notes}</Text>
                                            </View>
                                        :
                                            <View/>
                                        }


                                    </View>
                                </View>

                            </ScrollView>
                        </View>

                        <View style={{...styles.bottomOptions, backgroundColor: sportColor}}>

                            <Text style={{fontSize:25, marginLeft:15, color:lightColor}}>${parseFloat(props.gameDetails.price).toFixed(2)}</Text>


                            {props.itemType === "Join"
                                ?
                                <JoinItem gameDetails ={props.gameDetails}
                                          gameId ={props.gameId}
                                          user = {props.user}
                                          closeGame = {props.closeGame}
                                          style = {{...styles.bottomButtons}}
                                />
                                : props.itemType === "Referee"
                                    ?
                                    <RefereeItem gameDetails ={props.gameDetails}
                                                 gameId ={props.gameId}
                                                 user = {props.user}
                                                 closeGame = {props.closeGame}
                                                 style = {styles.bottomButtons}
                                    />
                                    :  props.itemType === "Quit"
                                        ?
                                        <UpcomingGameItem gameDetails ={props.gameDetails}
                                                          gameId ={props.gameId}
                                                          user = {props.user}
                                                          closeGame = {props.closeGame}
                                                          style = {styles.bottomButtons}
                                        />
                                        :
                                        <UpcomingRefereeItem gameDetails ={props.gameDetails}
                                                             gameId ={props.gameId}
                                                             user = {props.user}
                                                             closeGame = {props.closeGame}
                                                             style = {styles.bottomButtons}
                                        />
                            }


                        </View>
                    </View>

                </ImageBackground>

            </Modal>

        </View>

    )
}


const styles = StyleSheet.create({
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
        marginRight:5

    },
    bottomOptions:{
        width:"100%",
        height:100,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:3,



    },
    playerReferee: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:"center",
        marginVertical: 20,
        width:"100%"

    }
})

export default GameDetailsModal;
