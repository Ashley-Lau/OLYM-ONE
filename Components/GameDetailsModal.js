import React from 'react';
import {Text, StyleSheet, Modal, View, ScrollView, Image} from 'react-native';
import * as firebase from 'firebase';


import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";
import JoinItem from "./JoinItem";
import UpcomingRefereeItem from "./UpcomingRefereeItem";
import RefereeItem from "./RefereeItem";
import UpcomingGameItem from "./UpcomingGameItem";

const GameDetailsModal = props => {

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

                <Background style={{top: 0,right:0, position:"absolute"}}/>

                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>

                    <View style={styles.scrollBox}>

                        <ScrollView style={{flex:1}}>
                            <ScrollView nestedScrollEnabled={true} horizontal={true}>
                                <Image source={location} style={{flexWrap:"wrap"}}/>
                            </ScrollView>
                            <View style = {{alignItems: 'center'}}>
                                <View>
                                    <Text style={{fontSize:35}}>{props.gameDetails.sport.toUpperCase()}</Text>
                                    <Text style={{fontSize:20}}>Location: {props.gameDetails.location}</Text>
                                    <Text style={{fontSize:20}}>Host : {props.gameDetails.host}</Text>
                                    <Text style={{fontSize:20}}>Date  : {gameDate}</Text>
                                    <Text style={{fontSize:20}}>Time : {gameTime}</Text>
                                    <Text style={{fontSize:20}}>Price : {props.gameDetails.price}</Text>
                                    <Text style={{fontSize:20}}>To Take Note: </Text>
                                    <Text style={{fontSize:20}}>{props.gameDetails.notes}</Text>
                                    <Text style={{fontSize:20}}>Slots Left: {props.gameDetails.availability}</Text>
                                </View>
                            </View>
                            <View style = {{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                                <GradientButton style={{width: '27%', marginLeft: 20}}
                                                onPress={props.chatFunction}
                                                colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                                    Chat with host
                                </GradientButton>
                                <GradientButton style={{width: '27%', marginRight: 20}}
                                                onPress={() => {
                                                    props.openPlayer();}}
                                                colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
                                    View Players
                                </GradientButton>
                            </View>
                            <View style = {{marginBottom: 20}} />
                        </ScrollView>
                    </View>

                    <View style={{...Styles.horizontalbuttonContainer}}>
                        <GradientButton onPress={() => {
                            props.closeGame();
                        }}
                                        colors={["red", "maroon"]}
                                        style={{...Styles.buttonSize, marginRight:75}}>
                            <Text>Cancel</Text>
                        </GradientButton>

                        {props.itemType === "Join"
                        ?
                            <JoinItem gameDetails ={props.gameDetails}
                                      gameId ={props.gameId}
                                      user = {props.user}
                                      closeGame = {props.closeGame}
                            />
                        : props.itemType === "Referee"
                            ?
                                <RefereeItem gameDetails ={props.gameDetails}
                                                gameId ={props.gameId}
                                                user = {props.user}
                                                closeGame = {props.closeGame}
                                />
                            :  props.itemType === "Quit"
                            ?
                                    <UpcomingGameItem gameDetails ={props.gameDetails}
                                                         gameId ={props.gameId}
                                                         user = {props.user}
                                                         closeGame = {props.closeGame}
                                    />
                            :
                                    <UpcomingRefereeItem gameDetails ={props.gameDetails}
                                                            gameId ={props.gameId}
                                                            user = {props.user}
                                                            closeGame = {props.closeGame}
                                    />
                        }


                    </View>
                </View>

            </Modal>

        </View>

    )
}


const styles = StyleSheet.create({
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

export default GameDetailsModal;
