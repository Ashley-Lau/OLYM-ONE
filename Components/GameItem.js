import React,{useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, Modal, View, ScrollView, Image, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';


import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";
import firebaseDb from "../firebaseDb"
import ViewPlayerItem from "../Components/ViewPlayerItem"


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
    const [upcomingGame, setUpcomingGame] = useState([]);

    const userRef = firebaseDb.firestore().collection('users');

    const getGames = () => {
        setUpcomingGame([])
        userRef.get()
            .then(snapshot => {
                let gamelist = [];
                snapshot.forEach(doc => {
                    if(doc.data().id === props.user){
                        gamelist = doc.data().upcoming_games
                    }
                })
                setUpcomingGame(gamelist);
            })
    }

    //JOINING GAME ====================================================================================================================
    const gameRef = firebaseDb.firestore().collection('game_details').doc(props.gameId);

    const gameJoin = () => {
        getGames();

        const slots = parseInt(props.title.availability) - 1
        gameRef.update({availability : slots.toString(), players:[...props.title.players, props.user]}).then(() => {})
        userRef.update({upcoming_games: [...upcomingGame, props.gameId]}).then(() => {});
    }

    const alreadyJoined = () => {


        if(props.title.players.includes(props.user)){
            Alert.alert("Already in Game!", "You are already joined this game!")
        } else if(props.title.availability <= 0){
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
    let sportIcon = <MaterialCommunityIcons name="soccer" size={35}/>
    if(props.title.sport.toLowerCase() === "soccer"){
        sportIcon = <MaterialCommunityIcons name="soccer" size={35} color={gameColor}/>
    } else if(props.title.sport.toLowerCase() === "basketball"){
        sportIcon = <MaterialCommunityIcons name="basketball" size={35} color={gameColor}/>
    } else if(props.title.sport.toLowerCase() === "badminton"){
        sportIcon = <MaterialCommunityIcons name="badminton" size={35} color={gameColor} />
    } else if(props.title.sport.toLowerCase() === "floorball"){
        sportIcon = <MaterialCommunityIcons name="hockey-sticks" size={35} color={gameColor}/>
    } else if(props.title.sport.toLowerCase() === "tennis"){
        sportIcon = <MaterialCommunityIcons name="tennis" size={35} color={gameColor}/>
    } else {
        sportIcon = <MaterialCommunityIcons name ="soccer-field" size={35} color={gameColor}/>
    }

    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.title.date
    if(props.title.date){
        gameDate = props.title.date.toDate().toString().slice(4,15);
    }

    let gameTime = props.title.date
    if(props.title.date){
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
                                                openPlayerDetails(true);}}
                                            colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
                                <Text>View Players</Text>
                            </GradientButton>
                            <View style = {{marginBottom: 10}} />
                        </ScrollView>
                    </View>

                    <View style={{...Styles.horizontalbuttonContainer}}>
                        <GradientButton onPress={() => openGameDetails(false)}
                                        colors={["red", "maroon"]}
                                        style={{...Styles.buttonSize, marginRight:75}}>
                            <Text>Cancel</Text>
                        </GradientButton>

                        <GradientButton style={{...Styles.buttonSize}}
                                        onPress={() => {
                                            alreadyJoined();
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
                <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                    {sportIcon}
                    <Text style={{fontSize:18, color: gameColor, marginLeft:10}}>{props.title.sport} </Text>
                </View>

                <View style={{flexDirection:"column"}}>
                    <Text style={{fontSize:18, color:"ghostwhite"}}> Date: {gameDate} </Text>
                    <Text style={{fontSize:18, color:"ghostwhite"}}> Slots Left: {props.title.availability} </Text>
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
