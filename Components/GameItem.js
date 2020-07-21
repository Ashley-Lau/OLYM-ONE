import React,{useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Alert} from 'react-native';
import * as firebase from 'firebase';

import { useNavigation } from '@react-navigation/native';
import GameItemBackGround from "../views/GameItemBackGround";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GameItem = props => {
    const navigation = useNavigation()

    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.gameDetails.date
    if(props.gameDetails.date){
        gameDate = gameDate.toDate().toString().slice(4,15);
    }


    let sportIcon = props.gameDetails.sport.toLowerCase();




    return (
        <View>


            <TouchableOpacity style={{...styles.games}}
                              onPress={() => {props.onPress()}}>

                <View style={{flexDirection:"column", justifyContent:"flex-start", alignItems:"flex-start"}}>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <Text style={{fontWeight:"bold", fontSize:18, color: "black"}}>{props.gameDetails.sport.toUpperCase()}</Text>
                    </View>

                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="map-marker" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.location}</Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="calendar-range" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {gameDate} </Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <MaterialCommunityIcons name="account-group" size={18}/>
                        <Text style={{fontSize:15, color:"black"}}>  {props.gameDetails.availability}</Text>
                    </View>
                </View>

                <GameItemBackGround iconName={sportIcon} style={{height:90, flexDirection:"row", justifyContent: "flex-end", alignItems:"flex-end"}}>

                    {props.gameDetails.hostId === props.user.id
                        ?
                        <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                            <MaterialCommunityIcons name="crown" size={22} style={{color:'black'}}/>
                            <Text>Hosting</Text>
                        </View>

                        :
                        <View></View>
                    }

                </GameItemBackGround>
            </TouchableOpacity>
        </View>


    )
}

const styles = StyleSheet.create({
    games:{
        flexDirection:"row",
        borderBottomWidth:0.7,
        borderColor:"black",
        borderRadius:10,
        width:"100%",
        height:100,
        padding:5,
        justifyContent:"center",
        alignItems:"center",


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

    },
    locationImage:{
        height:200,
        flexWrap:"wrap"
    }
})


export default GameItem;
