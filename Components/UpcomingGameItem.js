import React,{useEffect} from 'react';
import {Text, Alert, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';

import firebaseDb from "../firebaseDb"


const UpcomingGameItem = props => {

    //UPDATING QUIT GAMES ================================================================================================
    const gameRef = firebaseDb.firestore().collection('game_details').doc(props.gameId);
    const refApplRef = firebaseDb.firestore().collection('application_details');
    const playerApplRef = firebaseDb.firestore().collection('player_application_details');

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
    const deleteGame = () => {
        gameRef.delete().then(()=>{});
    }
    const gameQuit = () => {
        if(props.gameDetails.players.length === 1){
            refApplRef.where("gameId", "==", props.gameId)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        doc.ref.delete().then(()=>{})
                    })
                })
            playerApplRef.where("gameId", "==", props.gameId)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        doc.ref.delete().then(()=>{})
                    })
                })
            gameRef.delete().then(() => {})
        } else if(props.gameDetails.hostId === props.user.id){
            const slots = parseInt(props.gameDetails.availability) + 1
            gameRef.update({hostId:props.gameDetails.players[1], host: host}).then(()=>{})
            gameRef.update({availability : slots.toString(), players: firebase.firestore.FieldValue.arrayRemove(props.user.id)}).then(() => {})
        } else {
            const slots = parseInt(props.gameDetails.availability) + 1
            gameRef.update({availability : slots.toString(), players: firebase.firestore.FieldValue.arrayRemove(props.user.id)}).then(() => {})
        }
    }

    //CONFIRM QUIT ALERT =========================================================================================================
    const confirmQuitAlert = () =>{
        props.gameDetails.hostId === props.user.id
        ?

        Alert.alert("Confirm Quit",
            "You are the host to this game!\nDo you want to make the next player in line host or delete this game?",
            [
                {
                    text:'Cancel',
                    onPress:() => {},
                    style:'cancel'
                },
                {
                    text:'Quit',
                    onPress:() => {
                        gameQuit();
                        props.closeGame();
                        },

                },
                {
                    text:'Delete',
                    onPress:() => {
                        deleteGame();
                        props.closeGame();
                    }
                }
            ]
        )

        :
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
        <TouchableOpacity style={{...props.style, justifyContent:"center", alignItems:"center"}}
                          onPress={() => {confirmQuitAlert()}}

        >
            <Text style ={{fontSize:20, color:props.textColor}}>Quit</Text>
        </TouchableOpacity>

    )
}

export default UpcomingGameItem;
