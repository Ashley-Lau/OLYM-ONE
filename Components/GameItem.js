import React,{useState} from 'react';
import {Text,TouchableOpacity, StyleSheet, Modal, View, ScrollView} from 'react-native';

import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";

const GameItem = props => {

    const [playerDetails, openPlayerDetails] = useState(false);
    const [gameDetails, openGameDetails] = useState(false);

    const players = <Modal visible={playerDetails} animationType="slide">
        <ScrollView>
            {props.title[5].map(names => (
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
                <Text>{props.title[0]}</Text>
            </TouchableOpacity>
        </View>


    )
}

const styles = StyleSheet.create({
    games:{
        borderRadius:5,
        borderWidth:1,
        width:"100%",
        height:45,
        marginTop:20,
        padding:5,
        justifyContent:"center",
        alignItems:"flex-start",
        backgroundColor:"rgba(255,255,255,0.4)",
    },
    scrollBox:{
        flex:2,
        borderWidth: 1,
        margin:10,
        borderRadius:10,
        backgroundColor: "gray"
    }
})


export default GameItem;
