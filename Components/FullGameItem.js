import React,{useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Alert,ImageBackground, Image, Animated, Dimensions} from 'react-native';
import * as firebase from 'firebase';

import { useNavigation } from '@react-navigation/native';
import firebaseDb from "../firebaseDb"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FullGameItem = props => {
    const navigation = useNavigation()

    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.gameDetails.date
    if(props.gameDetails.date){
        gameDate = gameDate.toDate().toString().slice(4,15);
    }

    const totalPlayers = props.gameDetails.players.length + parseInt(props.gameDetails.availability);
    const totalReferee = props.gameDetails.refereeList.length + parseInt(props.gameDetails.refereeSlots);


    //SPORT BG and colour================================================================================================================================
    let sportBG = require("../assets/OthersBG.png");
    let sportColor = "rgba(47,49,53,1)"
    let theme = props.index;
    if(props.gameDetails.sport.toLowerCase() === "basketball" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/BballRefereeBG.png");
        } else {
            sportBG = require("../assets/BballBG.png");
        }
        sportColor = "rgba(200,98,57,1)";

    } else if(props.gameDetails.sport.toLowerCase() === "soccer" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/SoccerRefereeBG.png");
        } else {
            sportBG = require("../assets/SoccerBG.png");
        }
        sportColor = "rgba(134,119,198,1)";

    } else if(props.gameDetails.sport.toLowerCase() === "floorball" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/floorballRefereeBG.png");
        } else {
            sportBG = require("../assets/floorballBG.png");
        }
        sportColor = "rgba(58,204,255,1)";

    } else if(props.gameDetails.sport.toLowerCase() === "tennis" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/TennisRefereeBG.png");
        } else {
            sportBG = require("../assets/TennisBG.png");
        }
        sportColor = "#a5bb3e";

    } else if(props.gameDetails.sport.toLowerCase() === "badminton" ){
        if(props.itemType === "Referee" || props.itemType === "Resign"){
            sportBG = require("../assets/BadmintonRefereeBG.png");
        } else {
            sportBG = require("../assets/BadmintonBG.png");
        }
        sportColor = "rgba(211,55,64,1)";

    } else {
        if(theme === 1){
            sportBG = require("../assets/OthersBG.png");
        } else if (theme === 2){
            sportBG = require("../assets/OthersBG2.png");
        } else{
            sportBG = require("../assets/OthersBG3.png");
        }
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

            <Animated.View style={[styles.games, {opacity, transform: [{ translateX }, { scale }] }]} key={props.index}>
                <TouchableOpacity style={{...styles.games}}
                                  onPress = {() => props.onPress()}
                >
                    <ImageBackground source={sportBG}
                                     style={styles.gameBG}
                                     imageStyle={{borderRadius:40}}
                    >
                        <View style={{flexDirection:"column"}}>
                            <Text style={{fontWeight:"bold", fontSize:35, color:sportColor}}>{props.gameDetails.sport.toUpperCase()}</Text>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialCommunityIcons name="account" size={20}/>
                                <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.host}</Text>
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialCommunityIcons name="map-marker" size={20}/>
                                <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.location}</Text>
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialCommunityIcons name="calendar-range" size={20}/>
                                <Text style={{fontSize:15, color:"black"}}>  {gameDate} </Text>
                            </View>
                            {props.itemType === "Join"
                                ?
                                <View style={{flexDirection:"row", alignItems:"center",}}>
                                    <MaterialCommunityIcons name="account-group" size={20}/>
                                    <Text style={{fontSize:15, color:"black", top: 1}}>  {props.gameDetails.players.length} / {totalPlayers} </Text>
                                </View>
                                :
                                <View style={{flexDirection:"row", alignItems:"center"}}>
                                    <MaterialCommunityIcons name="whistle" size={20}/>
                                    <Text style={{fontSize:15, color:"black", top: 2}}>  {props.gameDetails.refereeList.length} / {totalReferee}</Text>
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
        height:"96%",
        overflow:"hidden",
        justifyContent:"center",
        alignItems:"flex-start",
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
