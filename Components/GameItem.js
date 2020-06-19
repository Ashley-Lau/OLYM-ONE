import React,{useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, Modal, View, ScrollView, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';

import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";


const GameItem = props => {

    const [playerDetails, openPlayerDetails] = useState(false);
    const [gameDetails, openGameDetails] = useState(false);


    //setting the textcolour based on the game
    let gameColor = "rgb(255,255,255)";
    let sportIcon = <MaterialCommunityIcons name="soccer" size={35}/>
    if(props.title.sport.toLowerCase() === "soccer"){
        // gameColor = "rgb(12,104,0)";
        sportIcon = <MaterialCommunityIcons name="soccer" size={35} color={gameColor}/>
    } else if(props.title.sport.toLowerCase() === "basketball"){
    //     gameColor = "rgb(165,40,0)";
        sportIcon = <MaterialCommunityIcons name="basketball" size={35} color={gameColor}/>
    } else if(props.title.sport.toLowerCase() === "badminton"){
        // gameColor = "rgb(137,137,137)";
        sportIcon = <MaterialCommunityIcons name="badminton" size={35} color={gameColor} />
    } else if(props.title.sport.toLowerCase() === "floorball"){
        // gameColor = "rgb(147,147,0)";
        sportIcon = <MaterialCommunityIcons name="hockey-sticks" size={35} color={gameColor}/>
    } else if(props.title.sport.toLowerCase() === "golf"){
        // gameColor = "rgb(27,99,2)";
        sportIcon = <MaterialCommunityIcons name="golf" size={35} color={gameColor}/>
    } else {
        sportIcon = <MaterialCommunityIcons name ="soccer-field" size={35} color={gameColor}/>
    }

    let gameDate = props.title.date
    if(props.title.date){
        gameDate = props.title.date.toDate().toString().slice(4,15);
    }

    let gameTime = props.title.date
    if(props.title.date){
        gameTime = props.title.date.toDate().toString().slice(16,21);
    }

    // const players = <Modal visible={playerDetails} animationType="slide">
    //     <Background style={{top:0, right:-25, position:"absolute"}}/>
    //     <View style ={{flex:1}}>
    //         <View style ={{flex:0.1, justifyContent:"center", alignItems:"center", backgroundColor:"maroon"}}>
    //             <Text style={{fontSize:45, color:"white"}}>PLAYERS</Text>
    //         </View>
    //         <ScrollView style={{flex:3}}>
    //             {props.title[6].map(names => (
    //                 <View key={names} style={{
    //                     flexDirection:"row",
    //                     borderBottomWidth:1,
    //                     justifyContent:"space-between",
    //                     alignItems:"center",
    //                     height:"20%"
    //                 }}>
    //                     <MaterialCommunityIcons name="account" size={35}/>
    //                     <Text key ={names} style={{fontSize:35, marginLeft:35}}>{names}</Text>
    //                 </View>
    //             ))}
    //         </ScrollView>
    //
    //         <GradientButton style={{width:"100%", height:"10%", alignItem:"center", justifyContent: "center"}}
    //                         onPress={() => openPlayerDetails(false)}
    //                         colors={["red", "maroon"]}>
    //             <Text style={{fontSize:40}}>Go Back</Text>
    //         </GradientButton>
    //     </View>
    //
    // </Modal>


    return (
        <View>
            {/*to add additional details in firestore for the players modal*/}
            {/*{players}*/}
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
                                            onPress={() => openPlayerDetails(true)}
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
                                        onPress={() => openGameDetails(false)}
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
