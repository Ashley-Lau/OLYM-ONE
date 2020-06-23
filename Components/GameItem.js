import React,{useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, Modal, View, ScrollView, Image, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';


import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";
import firebaseDb from "../firebaseDb"
import ViewPlayerItem from "../Components/ViewPlayerItem"
import GameItemBackGround from "../views/GameItemBackGround";


const GameItem = props => {


    // LIST OF PLAYERS ================================================================================================
    const [playerUser, setPlayerUser] = useState([]);

    const username = () => {
        setPlayerUser([]);
        let playerList = [];
        props.title.players.map(uid => {
            firebaseDb.firestore().collection('users')
                .doc(uid)
                .get()
                .then(doc => {
                    playerList.push(doc.data().username);
                });
        })
        setPlayerUser(playerList);
    }
    //GETTING USER UPCOMING_GAME ARRAY =================================================================================
    const userRef = firebaseDb.firestore().collection('users').doc(props.user);


    //JOINING GAME ====================================================================================================================
    const gameRef = firebaseDb.firestore().collection('game_details').doc(props.gameId);

    const gameJoin = () => {
        const slots = parseInt(props.title.availability) - 1
        gameRef.update({availability : slots.toString(), players: firebase.firestore.FieldValue.arrayUnion(props.user)}).then(() => {})
        userRef.update({upcoming_games: firebase.firestore.FieldValue.arrayUnion(props.gameId)}).then(() => {});
    }

    const alreadyJoined = () => {
        //rejects the join game request if the user is already in the game
        if(props.title.players.includes(props.user)){
            Alert.alert("Already in Game!", "You are already in this game!")
        }
        //rejects the join request if there are no slots left
        else if(props.title.availability <= 0){
            Alert.alert("Game is Full!", "There are no more slots available!")
        } else {
            gameJoin();
        }

    }

    //MODAL STATES ================================================================================================================
    const [playerDetails, openPlayerDetails] = useState(false);
    const [gameDetails, openGameDetails] = useState(false);


    //SPORT ICON ================================================================================================================================
    let gameColor = "rgb(255,255,255)";
    let sportIcon = props.title.sport.toLowerCase();


    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.title.date
    let gameTime = props.title.date
    if(props.title.date){
        gameDate = props.title.date.toDate().toString().slice(4,15);
        gameTime = props.title.date.toDate().toString().slice(16,21);
    }


    return (
        <View>
            {/*to add additional details in firestore for the players modal*/}
            <ViewPlayerItem visible={playerDetails}
                            username={playerUser}
                            closePlayer ={() => {openPlayerDetails(false)}}/>
            <Modal visible = {gameDetails} animationType="slide">
                <Background style={{top: 0,right:0, position:"absolute"}}/>

                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>

                    <View style={styles.scrollBox}>

                        <ScrollView style={{flex:1}}>
                            <Image source={require("../assets/hougang_sports_hall.jpg")} style={{flexWrap:"wrap"}}/>
                            <Text style={{fontSize:35}}>{props.title.sport.toUpperCase()}</Text>
                            <Text style={{fontSize:20}}>Location: {props.title.location}</Text>
                            <Text style={{fontSize:20}}>Host : {props.title.host}</Text>
                            <Text style={{fontSize:20}}>Date  : {gameDate}</Text>
                            <Text style={{fontSize:20}}>Time : {gameTime}</Text>
                            <Text style={{fontSize:20}}>Price : {props.title.price}</Text>
                            <Text style={{fontSize:20}}>To Take Note: </Text>
                            <Text style={{fontSize:20}}>{props.title.notes}</Text>
                            <Text style={{fontSize:20}}>Slots Left: {props.title.availability}</Text>

                            <GradientButton style={{...Styles.buttonSize, height: '7%'}}
                                            onPress={() => {
                                                username();
                                                props.updateGames();
                                                openPlayerDetails(true);}}
                                            colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
                                <Text>View Players</Text>
                            </GradientButton>
                            <View style = {{marginBottom: 10}} />
                        </ScrollView>
                    </View>

                    <View style={{...Styles.horizontalbuttonContainer}}>
                        <GradientButton onPress={() => {
                            props.updateGames();
                            openGameDetails(false)
                        }}
                                        colors={["red", "maroon"]}
                                        style={{...Styles.buttonSize, marginRight:75}}>
                            <Text>Cancel</Text>
                        </GradientButton>

                        <GradientButton style={{...Styles.buttonSize}}
                                        onPress={() => {
                                            alreadyJoined();
                                            props.updateGames();
                                            openGameDetails(false);

                                        }}
                                        colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
                            <Text>Join</Text>
                        </GradientButton>
                    </View>
                </View>

            </Modal>
            <TouchableOpacity style={styles.games}
                              onPress={() => {openGameDetails(true);}}>
                <GameItemBackGround iconName={sportIcon}>
                    <Text style={{fontSize:18, color: "black", marginLeft:10}}>{props.title.sport} </Text>
                </GameItemBackGround>

                <View style={{flexDirection:"column"}}>
                    <Text style={{fontSize:18, color:"black"}}> Date: {gameDate} </Text>
                    <Text style={{fontSize:18, color:"black"}}> Slots Left: {props.title.availability} </Text>
                </View>
            </TouchableOpacity>
        </View>


    )
}

const styles = StyleSheet.create({
    games:{
        flexDirection:"row",
        borderBottomWidth:0.7,
        borderColor:"white",
        width:"100%",
        height:65,
        padding:5,
        justifyContent:"space-between",
        alignItems:"center",
        backgroundColor:"transparent",
    },
    scrollBox:{
        flex:1,
        borderWidth: 1,
        borderBottomEndRadius:10,
        borderBottomStartRadius:10,
        backgroundColor: "rgba(200,200,200,0.2)",
        width:"100%"
    },
    playerButton:{

    }
})


export default GameItem;
