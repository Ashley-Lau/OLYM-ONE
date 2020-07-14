import React from 'react';
import {Text, StyleSheet, Modal, View, ScrollView, Image, ImageBackground, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import GradientButton from "./GradientButton";
import Styles from "../../OLYM-ONE/styling/Styles";
import Background from "../views/Background";
import JoinItem from "./JoinItem";
import UpcomingRefereeItem from "./UpcomingRefereeItem";
import RefereeItem from "./RefereeItem";
import UpcomingGameItem from "./UpcomingGameItem";


const GameDetailsModal = props => {

    //IMAGE LOCATION ==================================================================================================
    let location = require("../assets/tampines.jpg");
    if(props.gameDetails.location.toLowerCase() === "tampines"){
        location = require("../assets/tampines.jpg");
    } else if (props.gameDetails.location.toLowerCase() === "pasir ris"){
        location = require("../assets/pasirris.jpg");
    } else if (props.gameDetails.location.toLowerCase() === "seng kang"){
        location = require("../assets/sengkang.jpg");
    } else if (props.gameDetails.location.toLowerCase() === "punggol"){
        location = require("../assets/punggol.jpg");
    } else if (props.gameDetails.location.toLowerCase() === "clementi"){
        location = require("../assets/clementi.jpg");
    } else if (props.gameDetails.location.toLowerCase() === "hougang"){
        location = require("../assets/hougang_sports_hall.jpg");
    }

    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.gameDetails.date
    let gameTime = props.gameDetails.date
    if(props.gameDetails.date){
        gameDate = gameDate.toDate().toString().slice(4,15);
        gameTime = gameTime.toDate().toString().slice(16,21);
    }


    return (
        <View>

            <Modal visible = {props.visible} animationType="slide">

                <ImageBackground source={require("../assets/BrownSkyline.png")} style={{flexDirection:"column", flex:1}}>

                    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                        <View style={{flexDirection:"row", height:50, width:"100%", backgroundColor:"rgb(223,128,81)", elevation:10, justifyContent:"flex-start", alignItems:"center"}}>
                            <TouchableOpacity activeOpacity={0.6} style={{marginLeft:5, marginRight:"20%"}} onPress={props.closeGame}>
                                <MaterialCommunityIcons name="arrow-left" size={40} style={{color:"rgb(243,187,130)"}}/>
                            </TouchableOpacity>

                            <Text style={{fontSize:40, }}>{props.gameDetails.sport}</Text>



                        </View>

                        <View style={styles.scrollBox}>

                            <ScrollView style={{flex:1}}>
                                <ScrollView nestedScrollEnabled={true} horizontal={true}>
                                    <Image source={location} style={{flexWrap:"wrap"}}/>
                                </ScrollView>
                                <View style = {{alignItems: 'flex-start', marginLeft:5}}>
                                    <View>
                                        <Text style={{fontWeight:"bold", fontSize:35}}>{props.gameDetails.sport.toUpperCase()}</Text>

                                        <View style = {{alignSelf:"center", flexDirection: 'row', justifyContent: 'center',alignItems:"center", marginVertical: 20}}>
                                            <TouchableOpacity style={{flexDirection:"column", justifyContent:"center", alignItems:"center", width: '27%', marginLeft: 20}}>
                                                <Text style={{fontSize:20}}>{props.gameDetails.players.length}</Text>
                                                {/*<MaterialCommunityIcons name="account-group" size={35}/>*/}
                                                <Text style={{fontSize:20}}>Players</Text>

                                            </TouchableOpacity>

                                            <Text style={{fontSize:30, color:"grey"}}>   |   </Text>

                                            <TouchableOpacity style={{flexDirection:"column", justifyContent:"center", alignItems:"center", width: '27%', marginLeft: 20}}>
                                                <Text style={{fontSize:20}}>{props.gameDetails.refereeList.length}</Text>
                                                {/*<MaterialCommunityIcons name="whistle" size={35}/>*/}
                                                <Text style={{fontSize:20}}>Referee</Text>

                                            </TouchableOpacity>
                                            {/*<GradientButton style={{width: '27%', marginLeft: 20}}*/}
                                            {/*                onPress={props.chatFunction}*/}
                                            {/*                colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>*/}
                                            {/*    View Referee*/}
                                            {/*</GradientButton>*/}
                                            {/*<GradientButton style={{width: '27%', marginRight: 20}}*/}
                                            {/*                onPress={() => {*/}
                                            {/*                    props.openPlayer();}}*/}
                                            {/*                colors={["rgba(25,224,32,1)","rgba(12,78,41,1)"]}>*/}
                                            {/*    View Players*/}
                                            {/*</GradientButton>*/}
                                        </View>


                                        <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                                <MaterialCommunityIcons name="map-marker" size={25} color="grey"/>
                                                <Text style={{fontSize:20, color:"grey"}}>  Location:</Text>
                                            </View>
                                            <Text style={{fontSize:20, color:"black", marginLeft:25}}>  {props.gameDetails.location}</Text>
                                        </View>

                                        <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                                <MaterialCommunityIcons name="account" size={25} color="grey"/>
                                                <Text style={{fontSize:20, color:"grey"}}>  Hosted By:</Text>
                                            </View>
                                            <Text style={{fontSize:20, color:"black", marginLeft:25}}>  {props.gameDetails.host}</Text>
                                        </View>


                                        <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                                <MaterialCommunityIcons name="clock" size={25} color="grey"/>
                                                <Text style={{fontSize:20, color:"grey"}}>  Date:</Text>
                                            </View>
                                            <Text style={{fontSize:20, color:"black",marginLeft:25}}>  {gameDate}</Text>
                                            <Text style={{fontSize:20, color:"black", marginLeft:25}}>  {gameTime}</Text>
                                        </View>

                                        <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                                <MaterialCommunityIcons name="cash-multiple" size={25} color="grey"/>
                                                <Text style={{fontSize:20, color:"grey"}}>  Price per player:</Text>
                                            </View>
                                            <Text style={{fontSize:20, color:"black", marginLeft:25}}>  ${props.gameDetails.price}</Text>
                                        </View>

                                        {props.itemType === "Join" || props.itemType === "Quit"
                                        ?
                                            <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                <View style={{flexDirection:"row", alignItems:"center"}}>
                                                    <MaterialCommunityIcons name="account-group-outline" size={25} color="grey"/>
                                                    <Text style={{fontSize:20, color:"grey"}}>  Slots Left:</Text>
                                                </View>
                                                <Text style={{fontSize:20, color:"black", marginLeft:25}}>  {props.gameDetails.availability}</Text>
                                            </View>
                                        :
                                            <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                <View style={{flexDirection:"row", alignItems:"center"}}>
                                                    <MaterialCommunityIcons name="whistle" size={25} color="grey"/>
                                                    <Text style={{fontSize:20, color:"grey"}}>  Referees Required:</Text>
                                                </View>
                                                <Text style={{fontSize:20, color:"black", marginLeft:25}}>  {props.gameDetails.refereeSlots}</Text>
                                            </View>

                                        }



                                        {props.gameDetails.notes !== ''
                                        ?
                                            <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                                                <View style={{flexDirection:"row", alignItems:"flex-start"}}>
                                                    <Text style={{fontWeight:"bold",fontSize:30, color:"grey"}}>To Take Note:</Text>
                                                </View>
                                                <Text style={{fontSize:20, color:"black"}}>{props.gameDetails.notes}</Text>
                                            </View>
                                        :
                                            <View/>
                                        }


                                    </View>
                                </View>

                                <View style = {{marginBottom: 20}} />
                            </ScrollView>
                        </View>

                        <View style={styles.bottomOptions}>

                            <GradientButton style={styles.bottomButtons}
                                            onPress={props.chatFunction}
                                            colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                                Chat with host
                            </GradientButton>

                            {props.itemType === "Join"
                                ?
                                <JoinItem gameDetails ={props.gameDetails}
                                          gameId ={props.gameId}
                                          user = {props.user}
                                          closeGame = {props.closeGame}
                                          style = {styles.bottomButtons}
                                />
                                : props.itemType === "Referee"
                                    ?
                                    <RefereeItem gameDetails ={props.gameDetails}
                                                 gameId ={props.gameId}
                                                 user = {props.user}
                                                 closeGame = {props.closeGame}
                                                 style = {styles.bottomButtons}
                                    />
                                    :  props.itemType === "Quit"
                                        ?
                                        <UpcomingGameItem gameDetails ={props.gameDetails}
                                                          gameId ={props.gameId}
                                                          user = {props.user}
                                                          closeGame = {props.closeGame}
                                                          style = {styles.bottomButtons}
                                        />
                                        :
                                        <UpcomingRefereeItem gameDetails ={props.gameDetails}
                                                             gameId ={props.gameId}
                                                             user = {props.user}
                                                             closeGame = {props.closeGame}
                                                             style = {styles.bottomButtons}
                                        />
                            }


                        </View>
                    </View>

                </ImageBackground>

                {/*<Background style={{top: 0,right:0, position:"absolute"}}/>*/}

            </Modal>

        </View>

    )
}


const styles = StyleSheet.create({
    scrollBox:{
        flex:1,
        // borderWidth: 1,
        borderBottomEndRadius:10,
        borderBottomStartRadius:10,
        backgroundColor: "rgba(200,200,200,0.2)",
        width:"100%"
    },
    bottomButtons:{
        height:50,
        width:"50%",
        borderRadius:0


    },
    locationImage:{
        height:200,
        flexWrap:"wrap"
    },
    bottomOptions:{
        width:"100%",
        height:50,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"flex-end",

    }
})

export default GameDetailsModal;
