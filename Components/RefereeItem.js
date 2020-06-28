import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    ImageBackground, Image
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import firebaseDb from "../firebaseDb";
import GameItemBackGround from "../views/GameItemBackGround";
import Styles from "../styling/Styles";


const RefereeItem = props => {

    //REQUEST FUNCTION ===============================================================================================
    const appRef = firebaseDb.firestore().collection('application_details')
    const requestApp = () => {
        appRef.add({
            date:props.game_details.date,
            gameId:props.gameId,
            hostId:props.game_details.hostId,
            refereeId: props.refereeId,
            sport:props.game_details.sport
        })
            .then(() => {})
            .catch(err => console.error(err))
    }

    //IMAGE LOCATION ==================================================================================================
    let location = require("../assets/tampines.jpg");
    if(props.game_details.location.toLowerCase() === "tampines"){
        location = require("../assets/tampines.jpg");
    } else if (props.game_details.location.toLowerCase() === "pasir ris"){
        location = require("../assets/pasirris.jpg");
    } else if (props.game_details.location.toLowerCase() === "seng kang"){
        location = require("../assets/sengkang.jpg");
    } else if (props.game_details.location.toLowerCase() === "punggol"){
        location = require("../assets/punggol.jpg");
    } else if (props.game_details.location.toLowerCase() === "clementi"){
        location = require("../assets/clementi.jpg");
    } else if (props.game_details.location.toLowerCase() === "hougang"){
        location = require("../assets/hougang_sports_hall.jpg");
    }

    //MODAL TOGGLE FOR REFEREE ITEM========================================================================================================================
    const[openItem ,setOpenItem] = useState(false);

    //SPORT ICON ================================================================================================================================
    let gameColor = "rgba(47,47,47,0.32)";
    let sportIcon = props.game_details.sport.toLowerCase()

    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.game_details.date
    let gameTime = props.game_details.date
    if(props.game_details.date){
        gameDate = props.game_details.date.toDate().toString().slice(4,15);
        gameTime = props.game_details.date.toDate().toString().slice(16,21);
    }

    const refereeGame =<Modal visible = {openItem} animationType="slide">
        <Background style={{top: 0,right:0, position:"absolute"}}/>

        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>

            <View style={styles.scrollBox}>

                <ScrollView style={{flex:1}}>
                    <ScrollView nestedScrollEnabled={true} horizontal={true}>
                        <Image source={location} style={{flexWrap:"wrap"}}/>
                    </ScrollView>
                    <View style = {{alignItems: 'center'}}>
                        <View>
                            <Text style={{fontSize:35}}>{props.game_details.sport.toUpperCase()}</Text>
                            <Text style={{fontSize:20}}>Location: {props.game_details.location}</Text>
                            <Text style={{fontSize:20}}>Host : {props.game_details.host}</Text>
                            <Text style={{fontSize:20}}>Date  : {gameDate}</Text>
                            <Text style={{fontSize:20}}>Time : {gameTime}</Text>
                            <Text style={{fontSize:20}}>Price : {props.game_details.price}</Text>
                            {/*<Text style={{fontSize:20}}>To Take Note: </Text>*/}
                            {/*<Text style={{fontSize:20}}>{props.game_details.notes}</Text>*/}
                            {/*<Text style={{fontSize:20}}>Slots Left: {props.game_details.availability}</Text>*/}
                        </View>
                    </View>
                    <View style = {{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                        <GradientButton style={{width: '27%', marginLeft: 20}}
                                        // onPress={chatWithHost}
                                        colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                            Chat with host
                        </GradientButton>
                        {/*<GradientButton style={{width: '27%', marginRight: 20}}*/}
                        {/*                onPress={() => {*/}
                        {/*                    setOpenItem(true);}}*/}
                        {/*                colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>*/}
                        {/*    View Players*/}
                        {/*</GradientButton>*/}
                    </View>
                    <View style = {{marginBottom: 20}} />
                </ScrollView>
            </View>

            <View style={{...Styles.horizontalbuttonContainer}}>
                <GradientButton onPress={() => {
                    setOpenItem(false);
                }}
                                colors={["red", "maroon"]}
                                style={{...Styles.buttonSize, marginRight:75}}>
                    <Text>Cancel</Text>
                </GradientButton>

                <GradientButton style={{...Styles.buttonSize, height:65}}
                                onPress={() => {
                                    requestApp();
                                    setOpenItem(false);

                                }}
                                colors={["rgba(25,224,32,0.6)","rgba(12,78,41,0.85)"]}>
                    <Text>Request Referee</Text>
                </GradientButton>
            </View>
        </View>

    </Modal>



    return(
        <View>
            {refereeGame}
            <TouchableOpacity style={styles.games}
                              onPress={() => {
                                  setOpenItem(true);
                              }}>

                <GameItemBackGround iconName={sportIcon} color={gameColor}>
                    <Text style={{fontSize:18, color: "black", marginLeft:10}}>{props.game_details.sport} </Text>
                </GameItemBackGround>


                <View style={{flexDirection:"column"}}>
                    <Text style={{fontSize:18, color:"black"}}>Date: {gameDate}</Text>
                    <Text style={{fontSize:18, color:"black"}}>Slots Left: {props.game_details.availability} </Text>
                </View>
            </TouchableOpacity>
        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: "bold",
    },
    elevatedComponent: {
        width: '90%',
        height: 150,
        elevation: 10,
        backgroundColor: 'white',
        marginTop: 40,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    titleBackground: {
        backgroundColor: 'green',
        height: 40,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    titleText: {
        textDecorationLine: 'underline',
        fontSize: 25,
        marginTop: 2,
        marginLeft: 4,
        fontWeight: '500',
        color: 'white',
    },
    photoFrame: {
        height: 85,
        width: 85,
        borderRadius: 170,
        elevation: 10,
        justifyContent: 'center',
        alignItems:'center',
        borderWidth: 2,
        backgroundColor: 'white',
    },
    games:{
        flexDirection:"row",
        borderBottomWidth:1,
        // padding:5,
        justifyContent:"flex-start",
        alignItems:"center",
        backgroundColor:"transparent",
    },
    refGames:{
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
    }

})

export default RefereeItem;
