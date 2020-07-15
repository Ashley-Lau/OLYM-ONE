import React from 'react';
import {Text} from 'react-native';
import * as firebase from 'firebase';

import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import firebaseDb from "../firebaseDb"


const RefereeItem = props => {

    //REQUEST FUNCTION ===============================================================================================
    const appRef = firebaseDb.firestore().collection('application_details')
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
            .then(() => {})
            .catch(err => console.error(err))
    }


    return (
        <GradientButton style={{...props.style}}
                        onPress={() => {
                            requestApp();
                            props.closeGame();
                        }}
                        colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
            <Text>Referee</Text>
        </GradientButton>
    )
}

export default RefereeItem;
