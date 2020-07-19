import React,{useEffect} from 'react';
import {Text, Alert, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';

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
        <TouchableOpacity style={{...props.style, justifyContent:"center", alignItems:"center"}}
                          onPress={() => {
                              confirmQuitAlert();
                          }}
        >
            <Text style ={{fontSize:20, color:props.textColor}}>Quit</Text>
        </TouchableOpacity>

    )
}

export default UpcomingGameItem;
