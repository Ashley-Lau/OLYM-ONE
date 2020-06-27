import React,{useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, Modal, View, ScrollView, Image, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';


import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";
import firebaseDb from "../firebaseDb"
import GameItemBackGround from "../views/GameItemBackGround";
import ViewPlayerItem from "../Components/ViewPlayerItem"



const UpcomingGameItem = props => {

    // LIST OF PLAYERS ================================================================================================
    const [playerList, setPlayerList] = useState([]);

    const userName = () => {
        setPlayerList([]);
        let playerlist = [];
        props.gameDetails.players.map(uid => {
            firebaseDb.firestore().collection('users').doc(uid)
                .onSnapshot(doc => {
                    playerlist.push(doc.data().username);
                })
        })
        setPlayerList(playerList);
    }

    useEffect(() => {
        userName();
    }, [])

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
                        setGameDetails(false);
                    },
                }
            ]
        )
    }

    //MODAL VIEWABLE =====================================================================================================
    const [gameDetails, setGameDetails] = useState(false);
    const [playerDetails, setPlayerDetails] = useState(false);

    //UPDATING QUIT GAMES ================================================================================================
    const gameRef = firebaseDb.firestore().collection('game_details').doc(props.gameId);
    const userRef = firebaseDb.firestore().collection('users').doc(props.user);

    const gameQuit = () => {
        if(props.gameDetails.players.length === 1){
            gameRef.delete().then(() => {})
        } else {
            const slots = parseInt(props.gameDetails.availability) + 1
            gameRef.update({availability : slots.toString(), players: firebase.firestore.FieldValue.arrayRemove(props.user)}).then(() => {})
        }
        userRef.update({upcoming_games: firebase.firestore.FieldValue.arrayRemove(props.gameId)}).then(() => {});
    }


    //SPORT ICON ================================================================================================================================
    let gameColor = "rgba(47,47,47,0.32)";
    let sportIcon = props.gameDetails.sport.toLowerCase()


    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.gameDetails.date
    let gameTime = props.gameDetails.date
    if(props.gameDetails.date){
        gameDate = props.gameDetails.date.toDate().toString().slice(4,15);
        gameTime = props.gameDetails.date.toDate().toString().slice(16,21);
    }




    return (<View>
            <ViewPlayerItem visible={playerDetails}
                            closePlayer={() => setPlayerDetails(false)}
                            username={playerList}
            />
            <Modal visible = {gameDetails} animationType="slide">
                <Background style={{top: 0,right:0, position:"absolute"}}/>

                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>

                    <View style={styles.scrollBox}>

                        <ScrollView style={{flex:1}}>
                            <Image source={require("../assets/hougang_sports_hall.jpg")} style={{flexWrap:"wrap"}}/>
                            <Text style={{fontSize:35}}>{props.gameDetails.sport.toUpperCase()}</Text>
                            <Text style={{fontSize:20}}>Location: {props.gameDetails.location}</Text>
                            <Text style={{fontSize:20}}>Host : {props.gameDetails.host}</Text>
                            <Text style={{fontSize:20}}>Date  : {gameDate}</Text>
                            <Text style={{fontSize:20}}>Time : {gameTime}</Text>
                            <Text style={{fontSize:20}}>Price : {props.gameDetails.price}</Text>
                            <Text style={{fontSize:20}}>To Take Note: </Text>
                            <Text style={{fontSize:20}}>{props.gameDetails.notes}</Text>
                            <Text style={{fontSize:20}}>Slots Left: {props.gameDetails.availability}</Text>

                            <GradientButton style={{...Styles.buttonSize, height: '7%'}}
                                            onPress={() => {
                                                setPlayerDetails(true);}}
                                            colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
                                <Text>View Players</Text>
                            </GradientButton>
                            <View style = {{marginBottom: 10}} />
                        </ScrollView>
                    </View>

                    <View style={{...Styles.horizontalbuttonContainer}}>
                        <GradientButton onPress={() => {
                            confirmQuitAlert()
                        }}
                                        colors={["red", "maroon"]}
                                        style={{...Styles.buttonSize, marginRight:75}}>
                            <Text>Quit</Text>
                        </GradientButton>

                        <GradientButton style={{...Styles.buttonSize}}
                                        onPress={() => {
                                            setGameDetails(false);
                                        }}
                                        colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
                            <Text>Back</Text>
                        </GradientButton>
                    </View>
                </View>

            </Modal>
            <TouchableOpacity style={styles.games}
                              onPress={() => {
                                  setGameDetails(true);
                              }}>

                <GameItemBackGround iconName={sportIcon} color={gameColor}>
                    <Text style={{fontSize:18, color: "black", marginLeft:10}}>{props.gameDetails.sport} </Text>
                </GameItemBackGround>


                <View style={{flexDirection:"column"}}>
                    <Text style={{fontSize:18, color:"black"}}>Date: {gameDate}</Text>
                    <Text style={{fontSize:18, color:"black"}}>Slots Left: {props.gameDetails.availability} </Text>
                </View>
            </TouchableOpacity>
    </View>



    )
}

const styles = StyleSheet.create({
    games:{
        flexDirection:"row",
        borderBottomWidth:0.7,
        borderColor:"grey",
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


export default UpcomingGameItem;
