import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import firebaseDb from "../firebaseDb";
import GameItemBackGround from "../views/GameItemBackGround";


const RefereeItem = props => {

    //PROFILE CARD BACKGROUND ============================================================================================================================================
    let profileBack = require("../assets/other_games.png");
    if(props.referee.referee[1].toLowerCase() === "basketball"){
        profileBack = require("../assets/basketball_coloured.png")
    } else if(props.referee.referee[1].toLowerCase()=== 'badminton'){
        profileBack = require("../assets/badminton_coloured.png")
    } else if(props.referee.referee[1].toLowerCase() === 'tennis'){
        profileBack = require("../assets/tennis_coloured.png")
    } else if(props.referee.referee[1].toLowerCase() === 'floorball'){
        profileBack = require("../assets/floorball_coloured.png")
    } else if(props.referee.referee[1].toLowerCase() === 'soccer'){
        profileBack = require("../assets/soccer_coloured.png")
    }

    //MODAL TOGGLE FOR REFEREE ITEM========================================================================================================================
    const[openItem ,setOpenItem] = useState(false);

    //GETTING REFEREE UPCOMING GAMES============================================================================================================================================
    const [refGames, setRefGames] = useState([]);
    const getUpcoming = () => {
        let gameList = []
        props.referee.upcoming_games.map((id) => {
            firebaseDb.firestore().collection('game_details').doc(id)
                .onSnapshot(doc => {
                    gameList.push({key:id, value:doc.data()})

                })

        });
        setRefGames(gameList);

    }

    useEffect(() => {
        getUpcoming();
    },[])


    const refereeItem = <Modal visible={openItem}>
        <Background>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style = {{alignItems: 'center', paddingBottom: 30,}}>
                    <ImageBackground source={profileBack} style = {{...styles.elevatedComponent, height: 200, justifyContent: 'space-evenly'}}>
                        <View style = {{flexDirection: 'column', justifyContent: 'space-around', paddingTop: 5,}}>
                            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-start", marginLeft:20}}>
                                <View style = {styles.photoFrame}>
                                    <MaterialCommunityIcons name='account' size={50}/>
                                </View>
                                <View style = {{alignItems: 'flex-start', marginLeft:10}}>
                                    <Text style = {{fontSize: 20}}>Name: {props.referee.username} </Text>
                                    <Text style = {{fontSize:20}}>Sport: {props.referee.referee[1]}</Text>
                                </View>
                            </View>

                            <View style={{flexDirection:"row", justifyContent:"space-around"}}>
                                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                                colors = {["red", "maroon"]}
                                                textStyle = {{fontSize: 15}}
                                                onPress={() => setOpenItem(false)}>
                                    CANCEL
                                </GradientButton>
                                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                                colors = {['#1bb479','#026c45']}
                                                onPress = {() => setOpenItem(false)}
                                                textStyle = {{fontSize: 15}}>
                                    HIRE
                                </GradientButton>
                            </View>
                        </View>

                    </ImageBackground>
                    <View style = {{...styles.elevatedComponent, marginTop: 20, height: 400}}>
                        <View style = {styles.titleBackground} >
                            <Text style ={styles.titleText}>
                                Upcoming Games
                            </Text>
                        </View>
                        <View>
                            {refGames.length > 0
                            ?
                                <ScrollView nestedScrollEnabled={true}>
                                    {
                                        refGames.map(game => (
                                            <View key={game.value.id}
                                                style={styles.refGames}
                                            >
                                                <View style ={{flexDirection:"row", justifyContent:'space-between', alignItems:"center"}}>
                                                    <GameItemBackGround iconName={game.value.sport.toLowerCase()}>
                                                        <Text style={{fontSize:18, color:"black"}}>{game.value.sport}</Text>
                                                    </GameItemBackGround>
                                                    <Text style={{fontSize:18, color:"black"}}>Date: {game.value.date.toDate().toString().slice(4,16)} </Text>
                                                </View>
                                            </View>
                                            )
                                        )
                                    }

                                </ScrollView>
                            :
                                <View>
                                    <Text>There are no upcoming games!</Text>
                                </View>
                            }

                        </View>
                    </View>

                </View>
            </ScrollView>
        </Background>

    </Modal>

    return(
        <View>
            {refereeItem}
            <TouchableOpacity style={styles.games}
                              onPress={() => {
                                  console.log(refGames);
                                  setOpenItem(true);
                              }}>
                {/*to replace icon with the profile picture of the referee*/}
                <MaterialCommunityIcons name="account" size={35}/>
                <View style={{flexDirection:"column", marginLeft:15}}>
                    <Text style={{fontSize:18}}> Name: {props.referee.username}</Text>
                    <Text style={{fontSize:18, color: "black"}}> Refereeing Sport: {props.referee.referee[1]} </Text>
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
        padding:5,
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
    }

})

export default RefereeItem;
