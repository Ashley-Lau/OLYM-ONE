import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
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
            refereeUri:props.user.uri
        })
            .then(() => {
                gameRef.update({applicants:firebase.FieldValue.arrayUnion(props.user.id)})
                    .then(() => {});
            })
            .catch(err => console.error(err))
    }


    return (
        <TouchableOpacity style={{...props.style, justifyContent:"center", alignItems:"center"}}
                          onPress={() => {
                              requestApp();
                              props.closeGame();
                          }}
        >
            <Text style ={{fontSize:20, color:props.textColor}}>Referee</Text>
        </TouchableOpacity>

    )
}

export default RefereeItem;
