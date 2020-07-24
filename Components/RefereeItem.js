import React from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';

import firebaseDb from "../firebaseDb"


const RefereeItem = props => {

    //REQUEST FUNCTION ===============================================================================================
    const appRef = firebaseDb.firestore().collection('application_details')
    const gameRef = firebaseDb.firestore().collection("game_details").doc(props.gameId);
    const requestApp = () => {
        appRef.add({
            date:props.gameDetails.date,
            gameId:props.gameId,
            hostId:props.gameDetails.hostId,
            refereeId: props.user.id,
            sport:props.gameDetails.sport,
            refereeEmail:props.user.email,
            refereeUserName:props.user.username,
            refereeName: props.user.firstName + " " + props.user.lastName,
            refereeUri:props.user.uri,
            applicationDate: new Date()
        })
            .then(() => {
                gameRef.update({applicants:firebase.firestore.FieldValue.arrayUnion(props.user.id)})
                    .then(() => {});
                requestSentSuccessfully()
            })
            .catch(err => console.error(err))
    }

    const requestSentSuccessfully = () => {
        Alert.alert("Request has been sent successfully to the host",
            "You will be notified through notifications in home tab if you are hired.",
            [
                {text:"Confirm", onPress: () => {}},
            ],
            {cancelable: false}
        )
    }

    return (
        <TouchableOpacity style={{...props.style, justifyContent:"center", alignItems:"center"}}
                          onPress={() => {
                              requestApp();
                              props.closeGame();
                          }}
        >
            <Text style ={{fontSize:20, color:props.textColor}}>Request to referee</Text>
        </TouchableOpacity>

    )
}

export default RefereeItem;
