import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Image,
    Alert
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import firebaseDb from "../firebaseDb";
import GameItemBackGround from "../views/GameItemBackGround";
import Styles from "../styling/Styles";




const RefereeApplicationItem = props => {
    //ACCEPT AND DECLINE FUNCTION ========================================================================================
    const applRef = firebaseDb.firestore().collection("application_details").doc(props.appId)
    const gameRef = firebaseDb.firestore().collection("game_details").doc(props.refDetails.gameId)

    const deleteReq = () => {
        applRef.delete().then(()=>{})
    }

    const acceptReq = () => {
        gameRef.update({referee: firebase.firestore.FieldValue.arrayUnion(props.refDetails.refereeId)})
            .then(()=>{deleteReq()});
    }

    const confirmDecline = () => {
        Alert.alert("Confirmation",
            "Are you sure you want to decline this request?" +
            [
                {
                    text:'Cancel',
                    onPress:() => {},
                    style:'cancel'
                },
                {
                    text:'Confirm',
                    onPress:() => {
                        deleteReq();
                        setOpen(false);
                    },
                }
            ])
    }

    const confirmAccept = () => {
        Alert.alert("Confirmation",
            "Do you want to accept this request?",
            [
                {
                    text:'Cancel',
                    onPress:() => {},
                    style:'cancel'
                },
                {
                    text:'Confirm',
                    onPress:() => {
                        acceptReq();
                        setOpen(false);
                    },
                }
            ]
            )
    }



    // PROFILE CARD BACKGROUND ===========================================================================================
    let profileBack = require("../assets/tennis_coloured.png")
    if(props.refDetails.sport.toLowerCase() === "tennis"){
        profileBack = require("../assets/tennis_coloured.png");
    } else if(props.refDetails.sport.toLowerCase() === "floorball"){
        profileBack = require("../assets/floorball_coloured.png");
    } else if(props.refDetails.sport.toLowerCase() === "basketball"){
        profileBack = require("../assets/basketball_coloured.png");
    } else if(props.refDetails.sport.toLowerCase() === "soccer"){
        profileBack = require("../assets/soccer_coloured.png");
    } else if(props.refDetails.sport.toLowerCase() === "badminton"){
        profileBack = require("../assets/badminton_coloured.png");
    }


    //DATE AND TIME STRING ================================================================================================
    let gameDate = props.refDetails.date
    let gameTime = props.refDetails.date
    if(props.refDetails.date){
        gameDate = props.refDetails.date.toDate().toString().slice(4,15);
        gameTime = props.refDetails.date.toDate().toString().slice(16,21);
    }

    //MODAL STATE =====================================================================================================================
    const [openDetails, setOpen] = useState(false);

    const refItem = <Modal visible={openDetails}>
        <Background>
            <View style = {{flexDirection: 'column', justifyContent: 'space-around',alignItems:"center", paddingTop: 5,}}>
                <View style = {{...styles.elevatedComponent, height: 225}}>
                    <ImageBackground source={profileBack} style ={{width:"100%",height:"100%"}}>
                        <View style = {{marginTop:10}}>
                            <View style={{flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                                <View style = {styles.photoFrame}>
                                    <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {{
                                        uri: props.refDetails.refereeUri
                                    }}/>
                                </View>

                                <View style = {{paddingLeft: 30, marginTop: 10}}>
                                    <Text style = {{fontSize: 20}}> Name: {props.refDetails.refereeName}</Text>
                                    <Text style = {{fontSize: 20}}> Username: {props.refDetails.refereeUserName} </Text>
                                    <Text style = {{fontSize: 20}}> Email: {props.refDetails.refereeEmail}</Text>

                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <View style = {{...styles.elevatedComponent, height: 100}}>
                    <View style={styles.requestTitle}>
                        <Text style={{fontSize:25}}>REQUESTS TO REFEREE</Text>
                    </View>

                    <View style={styles.games}
                          onPress={() => {
                              setOpen(true);
                          }}>

                        <GameItemBackGround iconName={props.refDetails.sport.toLowerCase()}>
                            <Text style={{fontSize:18, color: "black", marginLeft:10}}>{props.refDetails.sport} </Text>
                        </GameItemBackGround>


                        <View style={{flexDirection:"column"}}>
                            <Text style={{fontSize:18, color:"black"}}>Date: {gameDate}</Text>
                            <Text style={{fontSize:18, color:"black"}}>Time: {gameTime} </Text>
                        </View>
                    </View>

                </View>

                <View style ={{...Styles.horizontalbuttonContainer}}>
                    <GradientButton style={{width: 120, height:37, marginRight: 75,}}
                                    colors = {["red", "maroon"]}
                                    onPress = {confirmDecline}
                                    textStyle = {{fontSize: 15}}>
                        DECLINE
                    </GradientButton>



                    <GradientButton style={{width: 120, height:37,}}
                                    colors = {['#1bb479','#026c45']}
                                    textStyle = {{fontSize: 15}}
                                    onPress = {confirmAccept}
                    >
                        ACCEPT
                    </GradientButton>
                </View>

                <View >
                    <GradientButton style={{width: 200, height:45}}
                                    colors = {['red','maroon']}
                                    textStyle = {{fontSize: 20}}
                                    onPress = {() => {setOpen(false)}}
                    >
                        Back
                    </GradientButton>
                </View>
            </View>
        </Background>
    </Modal>



    return (
        <View>
            {refItem}
            <TouchableOpacity style={{...styles.games, borderBottomWidth:0.7}}
                              onPress={() => {
                                  setOpen(true);
                              }}>

                <GameItemBackGround iconName={props.refDetails.sport.toLowerCase()}>
                    <Text style={{fontSize:18, color: "black", marginLeft:10}}>{props.refDetails.sport} </Text>
                </GameItemBackGround>


                <View style={{flexDirection:"column"}}>
                    <Text style={{fontSize:18, color:"black"}}>Date: {gameDate}</Text>
                    <Text style={{fontSize:18, color:"black"}}>Time: {gameTime} </Text>
                </View>
            </TouchableOpacity>
        </View>


    )
}


const styles = StyleSheet.create({
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
        // borderBottomWidth:0.7,
        borderColor:"grey",
        width:"100%",
        height:65,
        padding:5,
        justifyContent:"space-between",
        alignItems:"center",
        backgroundColor:"transparent",
    },
    elevatedComponent: {
        width: '90%',
        height: 150,
        elevation: 10,
        backgroundColor: 'white',
        marginTop: 25,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    requestTitle :{
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(66,231,147,0.49)",
        height:35
    }
})

export default RefereeApplicationItem;
