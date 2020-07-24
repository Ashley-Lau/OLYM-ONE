import React from 'react';
import {Text, Alert, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';

import firebaseDb from "../firebaseDb"


const JoinItem = props => {

    // REQUESTING TO JOIN INSTEAD OF JOINING THE GAME STRAIGHT ====================================================

    const playerAppRef = firebaseDb.firestore().collection("player_application_details");
    const gameRef = firebaseDb.firestore().collection("game_details").doc(props.gameId);

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
            playerUri:props.user.uri,
            applicationDate:new Date()

        })
            .then(() => {
                gameRef.update({applicants:firebase.firestore.FieldValue.arrayUnion(props.user.id)})
                    .then(() => {})
            })
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
            requestSentSuccessfully();

        }
    }

    const requestSentSuccessfully = () => {
        Alert.alert("Request has been sent successfully to the host",
            "You will be notified through notifications in home tab if you are accepted.",
            [
                {text:"Confirm", onPress: () => {}},
            ],
            {cancelable: false}
        )
    }


    return (

        <TouchableOpacity style={{...props.style, justifyContent:"center", alignItems:"center"}}
                          onPress={() => {
                              alreadyJoined();
                              props.closeGame();
                          }}
        >
            <Text style ={{fontSize:20, color:props.textColor}}>Request to Join</Text>
        </TouchableOpacity>

    )
}

export default JoinItem;
