import React from 'react';
import {Text, Alert} from 'react-native';
import * as firebase from 'firebase';

import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import firebaseDb from "../firebaseDb"


const JoinItem = props => {

    // REQUESTING TO JOIN INSTEAD OF JOINING THE GAME STRAIGHT ====================================================

    const playerAppRef = firebaseDb.firestore().collection("player_application_details")

    const gameApp = () => {
        playerAppRef.add({
            date:props.gameDetails.date,
            gameId:props.gameId,
            hostId:props.gameDetails.hostId,
            availability:props.gameDetails.availability,
            playerId: props.user.id,
            sport:props.gameDetails.sport,
            playerEmail:props.user.email,
            playerUserName:props.user.username,
            playerName: props.user.firstName + " " + props.user.lastName,
            playerUri:props.user.uri

        })
            .then(() => {})
            .catch(err => console.error(err))
    }


    const alreadyJoined = () => {
        //rejects the join game request if the user is already in the game
        if(props.gameDetails.players.includes(props.user.id)){
            Alert.alert("Already in Game!", "You are already in this game!")
        }
        //failsafe in the case where the games with zero slots are queried too
        else if(props.gameDetails.availability <= 0){
            Alert.alert("Game is Full!", "There are no more slots available!")
        } else {
            gameApp();
        }

    }


    return (
        <GradientButton style={{...Styles.buttonSize}}
                        onPress={() => {
                            alreadyJoined();
                            props.closeGame();
                        }}
                        colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
            <Text>Join</Text>
        </GradientButton>
    )
}

export default JoinItem;
