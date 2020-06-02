import React,{useState} from 'react';
import {Text,TouchableOpacity, StyleSheet, Modal, View, ScrollView} from 'react-native';

import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";


const GameItem = props => {

    const [playerDetails, openPlayerDetails] = useState(false);
    const [gameDetails, openGameDetails] = useState(false);

    //setting the textcolour based on the game
    let gameColor = "rgb(234,38,38)";
    if(props.title[0].toLowerCase() === "soccer"){
        gameColor = "rgb(11,83,1)";
    } else if(props.title[0].toLowerCase() === "basketball"){
        gameColor = "rgb(165,40,0)";
    } else if(props.title[0].toLowerCase() === "badminton"){
        gameColor = "rgb(137,137,137)";
    } else if(props.title[0].toLowerCase() === "floorball"){
        gameColor = "rgb(147,147,0)";
    }

    const players = <Modal visible={playerDetails} animationType="slide">
        <ScrollView>
            {props.title[6].map(names => (
                <View key={names}>
                    <Text>{names}</Text>
                </View>
            ))}
        </ScrollView>
        <GradientButton style={{...Styles.buttonSize, marginRight:75}}
                        onPress={() => openPlayerDetails(false)}
                        colors={["rgba(155,113,170,0.84)", "rgba(229,29,62,0.6)"]}>
            <Text>Go Back</Text>
        </GradientButton>
    </Modal>


    return (
        <View>
            {players}
            <Modal visible = {gameDetails} animationType="slide">
                <Background style={{top: 0,right:0, position:"absolute"}}/>

                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>

                    <View style={styles.scrollBox}>
                        <ScrollView style={{flex:1, }}>
                            <Text style={{fontSize:45}}>Host : {props.title[1]}</Text>
                            <Text style={{fontSize:45}}>Date  : {props.title[2]}</Text>
                            <Text style={{fontSize:45}}>Time : {props.title[3]}</Text>
                            <Text style={{fontSize:45}}>Price : {props.title[3]}</Text>
                            <Text style={{fontSize:45}}>Availability: {props.title[4]}</Text>
                            <GradientButton style={{...Styles.buttonSize, marginRight:75}}
                                            onPress={() => openPlayerDetails(true)}
                                            colors={['rgba(32,151,83,0.85)', 'rgba(12,78,41,0.85)']}>
                                <Text>View Players</Text>
                            </GradientButton>
                        </ScrollView>
                    </View>

                    <View style={{...Styles.horizontalbuttonContainer}}>
                        <GradientButton style={{...Styles.buttonSize, marginRight:75}}
                                        onPress={() => openGameDetails(false)}
                                        colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
                            <Text>Join</Text>
                        </GradientButton>

                        <GradientButton onPress={() => openGameDetails(false)}
                                        colors={["rgba(155,113,170,0.84)", "rgba(229,29,62,0.6)"]}
                                        style={{...Styles.buttonSize}}>
                            <Text>Cancel</Text>
                        </GradientButton>

                    </View>



                </View>

            </Modal>
            <TouchableOpacity style={styles.games}
                              onPress={() => {openGameDetails(true);}}>
                <Text style={{fontSize:25, color: gameColor}}>{props.title[0]} </Text>
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
        backgroundColor: "rgba(200,200,200,0.2)"
    }
})


export default GameItem;
