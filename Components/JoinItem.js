import React from 'react';
import {Text, Alert} from 'react-native';
import * as firebase from 'firebase';

import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import firebaseDb from "../firebaseDb"


const JoinItem = props => {

    //JOINING GAME ====================================================================================================================
    const gameRef = firebaseDb.firestore().collection('game_details').doc(props.gameId);

    const gameJoin = () => {
        const slots = parseInt(props.gameDetails.availability) - 1
        gameRef.update({availability : slots.toString(), players: firebase.firestore.FieldValue.arrayUnion(props.user.id)}).then(() => {})
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
            gameJoin();
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
