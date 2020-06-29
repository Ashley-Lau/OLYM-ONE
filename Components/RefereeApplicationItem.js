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




const RefereeApplicationItem = props => {

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
        <View style = {{flexDirection: 'column', justifyContent: 'space-around',alignItems:"center", paddingTop: 5,}}>
            <View style = {{...styles.elevatedComponent, height: 225, paddingTop:10}}>
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

            <View style = {{...styles.elevatedComponent, height: 225}}>
                    <View style={{justifyContent:"center", backgroundColor:"blue", height:"20%"}}>
                        <Text style={{fontSize:25}}> REQUESTS TO REFEREE </Text>
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



                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                colors = {['#1bb479','#026c45']}
                                textStyle = {{fontSize: 15}}
                    onPress = {() => setOpen(false)}
                >
                    Decline
                </GradientButton>
                {/*<GradientButton style={{width: 120, height:37, marginTop: 20,}}*/}
                {/*                colors = {["red", "maroon"]}*/}
                {/*    // onPress = {logout}*/}
                {/*                textStyle = {{fontSize: 15}}>*/}
                {/*    Accept*/}
                {/*</GradientButton>*/}





        </View>



    </Modal>



    return (
        <View>
            {refItem}
            <TouchableOpacity style={styles.games}
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
        borderBottomWidth:0.7,
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
    }
})

export default RefereeApplicationItem;
