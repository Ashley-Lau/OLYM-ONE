import React,{useState} from 'react';
import {Text,TouchableOpacity, StyleSheet, Modal, View, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";


const GameItem = props => {

    const [playerDetails, openPlayerDetails] = useState(false);
    const [gameDetails, openGameDetails] = useState(false);

    //setting the textcolour based on the game
    let gameColor = "rgb(234,38,38)";
    let sportIcon = <MaterialCommunityIcons name="soccer" size={35}/>
    if(props.title[0].toLowerCase() === "soccer"){
        gameColor = "rgb(11,83,1)";
        sportIcon = <MaterialCommunityIcons name="soccer" size={35} color={gameColor}/>
    } else if(props.title[0].toLowerCase() === "basketball"){
        gameColor = "rgb(165,40,0)";
        sportIcon = <MaterialCommunityIcons name="basketball" size={35} color={gameColor}/>
    } else if(props.title[0].toLowerCase() === "badminton"){
        gameColor = "rgb(137,137,137)";
        sportIcon = <MaterialCommunityIcons name="badminton" size={35} color={gameColor} />
    } else if(props.title[0].toLowerCase() === "floorball"){
        gameColor = "rgb(147,147,0)";
        sportIcon = <MaterialCommunityIcons name="hockey-sticks" size={35} color={gameColor}/>
    } else if(props.title[0].toLowerCase() === "golf"){
        gameColor = "rgb(27,99,2)";
        sportIcon = <MaterialCommunityIcons name="golf" size={35} color={gameColor}/>
    }

    const players = <Modal visible={playerDetails} animationType="slide">
        <Background style={{top:0, right:-25, position:"absolute"}}/>
        <View style ={{flex:1}}>
            <ScrollView style={{flex:3}}>
                {props.title[6].map(names => (
                    <View style={{flexDirection:"row", borderBottomWidth:1, justifyContent:"center", alignItems:"center"}}>
                        <MaterialCommunityIcons name="account" size={35}/>
                        <Text key ={names} style={{fontSize:35, marginLeft:35}}>{names}</Text>
                    </View>
                ))}
            </ScrollView>


            <GradientButton style={{width:"100%", height:"10%", alignItem:"center", justifyContent: "center"}}
                            onPress={() => openPlayerDetails(false)}
                            colors={["rgba(155,113,170,0.84)", "rgba(229,29,62,0.6)"]}>
                <Text>Go Back</Text>
            </GradientButton>
        </View>

    </Modal>


    return (
        <View>
            {players}
            <Modal visible = {gameDetails} animationType="slide">
                <Background style={{top: 0,right:0, position:"absolute"}}/>

                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <View style={{width:"100%",
                        height:"15%",
                        backgroundColor:"#7b0303",
                        justifyContent:"center",
                        alignItems:"center"
                    }}>
                        <Text style={{fontSize:40, color:"white"}}>GAME DETAILS</Text>
                    </View>

                    <View style={styles.scrollBox}>

                        <ScrollView style={{flex:1, }}>
                            <Text style={{fontSize:35}}>Sport : {props.title[0]}</Text>
                            <Text style={{fontSize:35}}>Location: {props.title[1]}</Text>
                            <Text style={{fontSize:35}}>Host : {props.title[2]}</Text>
                            <Text style={{fontSize:35}}>Date  : {props.title[3]}</Text>
                            <Text style={{fontSize:35}}>Time : {props.title[4]}</Text>
                            <Text style={{fontSize:35}}>Price : {props.title[5]}</Text>
                            <Text style={{fontSize:35}}>Availability: {props.title[4]}</Text>
                            <GradientButton style={{...Styles.buttonSize, marginRight:75}}
                                            onPress={() => openPlayerDetails(true)}
                                            colors={['rgba(32,151,83,0.85)', 'rgba(12,78,41,0.85)']}>
                                <Text>View Players</Text>
                            </GradientButton>
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
                {sportIcon}
                <Text style={{fontSize:18, color: gameColor}}>{props.title[0]} </Text>
                <Text style={{fontSize:18}}> Date: {props.title[3]} Players: {props.title[5]}</Text>
            </TouchableOpacity>
        </View>


    )
}

const styles = StyleSheet.create({
    games:{
        flexDirection:"row",
        // borderRadius:5,
        borderBottomWidth:1,
        width:"100%",
        height:45,
        // marginTop:20,
        padding:5,
        justifyContent:"flex-start",
        alignItems:"center",
        backgroundColor:"transparent",
    },
    scrollBox:{
        flex:1,
        borderWidth: 1,
        margin:10,
        borderRadius:10,
        backgroundColor: "rgba(200,200,200,0.2)",
        width:"100%"
    },
    playerButton:{

    }
})


export default GameItem;
