import React from 'react';
import {Text, Alert} from 'react-native';
import * as firebase from 'firebase';

import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import firebaseDb from "../firebaseDb"


const UpcomingGameItem = props => {

    //UPDATING QUIT GAMES ================================================================================================
    const gameRef = firebaseDb.firestore().collection('game_details').doc(props.gameId);

    const quitGame = () => {
        gameRef.update({referee: firebase.firestore.FieldValue.arrayRemove(props.user.id)}).then(()=>{})
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
                        props.closeGame();
                    },
                }
            ]
        )
    }

    return (
        <GradientButton style={{...Styles.buttonSize}}
                        onPress={() => {
                            confirmQuit();
                            props.closeGame();
                        }}
                        colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
            <Text>Resign</Text>
        </GradientButton>
    )
}

export default UpcomingGameItem;
