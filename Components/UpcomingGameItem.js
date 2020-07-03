import React,{useEffect} from 'react';
import {Text,  Alert} from 'react-native';
import * as firebase from 'firebase';

import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import firebaseDb from "../firebaseDb"


const UpcomingGameItem = props => {

    //UPDATING QUIT GAMES ================================================================================================
    const gameRef = firebaseDb.firestore().collection('game_details').doc(props.gameId);
    const userRef = firebaseDb.firestore().collection('users').doc(props.user.id);

    let host = '';
    const getNewHost = () => {
        if(props.gameDetails.players.length === 1){}
        else {
            firebaseDb.firestore().collection('users').doc(props.gameDetails.players[1])
                .get()
                .then(doc => {
                    host = doc.data().username;
                })
        }

    }
    const gameQuit = () => {
        if(props.gameDetails.players.length === 1){
            gameRef.delete().then(() => {})
        } else if(props.gameDetails.hostId === props.user.id){
            const slots = parseInt(props.gameDetails.availability) + 1
            gameRef.update({hostId:props.gameDetails.players[1], host: host}).then(()=>{})
            gameRef.update({availability : slots.toString(), players: firebase.firestore.FieldValue.arrayRemove(props.user.id)}).then(() => {})
        } else {
            const slots = parseInt(props.gameDetails.availability) + 1
            gameRef.update({availability : slots.toString(), players: firebase.firestore.FieldValue.arrayRemove(props.user.id)}).then(() => {})
        }
        userRef.update({upcoming_games: firebase.firestore.FieldValue.arrayRemove(props.gameId)}).then(() => {});
    }

    //CONFIRM QUIT GAME ================================================================================================================
    const confirmQuitAlert = () =>{
        Alert.alert("Confirm Quit",
            "Are you sure you want to quit this game?\nYou might not be able to join this game again!",
            [
                {
                    text:'Cancel',
                    onPress:() => {},
                    style:'cancel'
                },
                {
                    text:'Confirm',
                    onPress:() => {
                        gameQuit();
                        props.closeGame();
                    },
                }
            ]
        )
    }

    //USE EFFECT TO GET THE NEW HOST===========================================================================================
    useEffect(() => {
        getNewHost();
    }, [])

    return (
        <GradientButton style={{...Styles.buttonSize}}
                        onPress={() => {
                            confirmQuitAlert();
                        }}
                        colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
            <Text>Quit</Text>
        </GradientButton>
    )
}

export default UpcomingGameItem;
