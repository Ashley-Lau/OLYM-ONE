import React,{useState} from 'react';
import {Text,TouchableOpacity, StyleSheet, Modal, View, ScrollView} from 'react-native';
import {LinearGradient} from "expo-linear-gradient"

import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";


const GameItem = props => {

    const [playerDetails, openPlayerDetails] = useState(false);
    const [gameDetails, openGameDetails] = useState(false);

    const players = <Modal visible={playerDetails} animationType="slide">
        <View style={{flex:1}}>
            <Background style={{top:0, right:0, position:"absolute"}}/>
            <ScrollView style={{flex:5}}>
                {props.title[5].map(names => (
                    <View key={names}
                          style={{flexDirection:"column",
                              justifyContent:"space-between",
                          }}>
                        <GradientButton
                            colors={['rgba(32,151,83,0.85)', 'rgba(12,78,41,0.85)']}
                            style={{marginTop:10}}>
                            {names}
                        </GradientButton>
                    </View>
                ))}
            </ScrollView>

            <GradientButton style={{marginBottom:25, marginTop:15}}
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
                    <View style={styles.scrollBox}>
                        <ScrollView style={{flex:1, }}>
                            <Text style={styles.textbox}>Host : {props.title[1]}</Text>
                            <Text style={styles.textbox}>Date  : {props.title[2]}</Text>
                            <Text style={styles.textbox}>Time : {props.title[3]}</Text>
                            <Text style={styles.textbox}>Price : {props.title[3]}</Text>
                            <Text style={styles.textbox}>Availability: {props.title[4]}</Text>
                            <GradientButton style={{...Styles.buttonSize, marginTop:35}}
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
            {/*<TouchableOpacity  style={styles.games2}>*/}
            {/*    <Text style={{fontSize:30}}>{props.title[0].toUpperCase()}</Text>*/}
            {/*</TouchableOpacity>*/}

            {/*Option 2*/}
            <TouchableOpacity  style={styles.games}
                               onPress={() => {openGameDetails(true);}}>
                <LinearGradient colors={["rgba(104,0,45,0.6)","rgba(238,134,23,0.84)"]}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    height: 53,
                                    borderRadius:5
                                }}/>
                <Text style={{fontSize:30}}>{props.title[0].toUpperCase()}</Text>
            </TouchableOpacity>
        </View>


    )
}

const styles = StyleSheet.create({
    games:{
        borderRadius:5,
        borderWidth:1,
        borderColor: "rgba(0,111,60,0.6)",
        width:"100%",
        height:55,
        marginTop:15,
        // padding:5,
        justifyContent:"center",
        // alignItems:"flex-start",
        // backgroundColor:"rgba(255,255,255,0.4)",
    },
    games2:{
        borderBottomWidth:1,
        borderColor: "#000000",
        width:"100%",
        height:55,
        // padding:5,
        justifyContent:"center",
        // alignItems:"flex-start",
        // backgroundColor:"rgba(156,155,155,0.4)",
    },
    scrollBox:{
        flex:1,
        borderWidth: 1,
        margin:10,
        borderRadius:10,
        backgroundColor: "rgba(200,200,200,0.2)"
    },
    textbox:{
        fontWeight:"bold",
        fontSize:45,
        fontFamily:"Roboto"

    }
})


export default GameItem;
