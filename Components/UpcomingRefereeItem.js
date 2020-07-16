import React from 'react';
import {Text, Alert, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';

import firebaseDb from "../firebaseDb"


const UpcomingGameItem = props => {

    //UPDATING QUIT GAMES ================================================================================================
    const gameRef = firebaseDb.firestore().collection('game_details').doc(props.gameId);

    const quitGame = () => {
        const refSlots = parseInt(props.gameDetails.refereeSlots) + 1;
        gameRef.update({refereeSlots: refSlots, refereeList: firebase.firestore.FieldValue.arrayRemove(props.user.id)}).then(()=>{})
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
        <TouchableOpacity style={{...props.style, justifyContent:"center", alignItems:"center"}}
                          onPress={() => {
                              confirmQuit();
                              props.closeGame();
                          }}
        >
            <Text style ={{fontSize:20, color:props.textColor}}>Resign</Text>
        </TouchableOpacity>

    )
}

export default UpcomingGameItem;
