import React, {useEffect, useState} from 'react';

import {View, Image, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity, ImageBackground} from 'react-native';
import firebase from 'firebase';
import {useNavigation} from "@react-navigation/native";
import {Select, SelectItem,} from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo'

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem";
import GameScreenItem from "../Components/GameScreenItem";

import firebaseDb from "../firebaseDb";




const GameScreen = (props) => {
    const navigation = useNavigation()
    const user = props.route.params.user

    // ARRAY FOR PICKER IN THE SEARCH BAR ==============================================================================
    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"];
    const [sportsIndex, setSportsIndex] = useState();
    const [sportValue, setSportValue] = useState();

    // IMAGE FOR RELATIVE SPORT =======================================================================================
    const sportImage = (sport) => {
        if(sport === "Soccer"){
            return require("../assets/soccer_coloured.png");
        } else if(sport === "BasketBall"){
            return require("../assets/basketball_coloured.png");
        } else if(sport === "Floorball"){
            return require("../assets/floorball_icon.png");
        } else if(sport === "Badminton"){
            return require("../assets/badminton_icon.png");
        } else if(sport === "Tennis"){
            return require("../assets/tennis_coloured.png");
        } else {
            return require("../assets/other_games.png")
        }
    }



    // SEARCH BAR FUNCTION =============================================================================================
    const searchSport = (sport) => {
        console.log(sportValue)
        console.log(sport)
        let searched = [];
        const now = new Date().getTime();
        gamesRef.where('sport', '==', sport)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const d = doc.data();
                    if(d.date.toMillis() < now){
                        doc.ref.delete().then(()=>{});
                    } else if(d.hostId === currentUser){}
                    else if(parseInt(d.availability) <= 0){}
                    else {
                        searched.push({key:doc.id, value:doc.data()});
                    }
                })
                setGame(searched);
            })
    }


    // MODAL FUNCTION ==============================================================================================
    const [game, setGame] = useState ([]);

    //UID OF USER ================================================================================================
    const currentUser = props.route.params.user.id;

    //UPDATING AND QUERYING OF GAME DETAILS ================================================================================================

    const gamesRef = firebaseDb.firestore().collection('game_details');
    const allGames = () => {
        gamesRef
            .orderBy("date", "asc")
            .limit(15)
            .onSnapshot(snapshot => {
                    const someGame = [];
                    const now = new Date().getTime();
                    let num = 1;
                    snapshot.forEach( doc => {
                            const d = doc.data();
                            console.log("num reloads :" + num);
                            num = num + 1;
                            if(d.date.toMillis() < now){
                                doc.ref.delete().then(()=>{});
                            } else if(d.hostId === currentUser){}
                            else if( parseInt(d.availability) <= 0){}
                            else {
                                someGame.push({key:doc.id, value:doc.data()});
                            }
                        }
                    )
                    setGame(someGame);
                },
                error => {
                    console.log("Game Screen " + error.message)
                })
    }

    useEffect(() => {
        const unsubscribe = allGames();

        return () => unsubscribe;

    }, [])

    return (<Background style = {styles.container}>

                {/*==================================== Title and hosting a game ======================================*/}
                <View style = {{marginTop:"5%", justifyContent: 'space-between',height: "8%", width: '100%', flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal:10}}>
                    <Text style = {styles.text}> Games </Text>
                    <TouchableOpacity activeOpacity={ 0.9}
                                      onPress={() => {
                                          navigation.navigate('HostGameScreen',
                                              {
                                                  uid: currentUser,
                                              }
                                          )
                                      }}
                                      style = {styles.hostButton}
                    >
                        <Text style = {{...styles.text,fontSize:13}}>  Host a Game </Text>
                        <View style = {{backgroundColor: 'rgba(255,255,255,0.30)', ...styles.hostButton}}>
                            <Entypo name="plus" color={'white'} size={30}/>
                        </View>
                    </TouchableOpacity>
                </View>

                {/*==================================SEARCH BAR ==============================================*/}
                <View style={styles.searchSpace}>
                    <View style={styles.searchBar}>
                        <Select
                            style = {{width: "90%", justifyContent:"space-between"}}
                            placeholder='Select Sport'
                            value ={sports[sportsIndex - 1]}
                            onSelect={index => {
                                setSportsIndex(index)
                                setSportValue(sports[index.row])
                            }}
                            selectedIndex={sportsIndex}>
                            {sports.map(sport => (
                                <SelectItem key={sport} title={sport}/>
                            ))}

                        </Select>
                        <SearchButtons style={{flex: 1, elevation: 5}} searchMe={searchSport}/>
                    </View>
                </View>



                {/*===============================Sport Selection ===========================================*/}

                <View style={{height:"15%"}}>
                    <FlatList showsHorizontalScrollIndicator={false}
                              horizontal={true}
                              contentContainerStyle= {{justifyContent:"space-between", paddingRight:"45%"}}
                              keyExtractor={(item) => item.toString()}
                              data = {sports}
                              renderItem= {({item}) =>
                                  item === sportValue
                                      ?
                                      <View style={styles.sportItem}>
                                          <TouchableOpacity activeOpacity={0.6}
                                                            style={{...styles.sportSelected}}
                                                            onPress ={ () => {
                                                                setSportValue(item);
                                                                searchSport(item);


                                                            }}
                                          >
                                              <View style={styles.sportImageSelected}>
                                                  <Image source={sportImage(item)} style={{width:37.5, height:37.5, resizeMode:"contain", opacity:1.0}}/>
                                              </View>

                                          </TouchableOpacity>
                                          <Text>{item}</Text>
                                      </View>
                                      : <View style={styles.sportItem}>
                                          <TouchableOpacity activeOpacity={0.6}
                                                            style={{...styles.sportSelection}}
                                                            onPress ={ () => {
                                                                setSportValue(item);
                                                                searchSport(item);


                                                            }}
                                          >
                                              <View style={styles.sportImageShadow}>
                                                  <Image source={sportImage(item)} style={{width:35, height:35, resizeMode:"contain", opacity:0.3}}/>
                                              </View>

                                          </TouchableOpacity>
                                          <Text style={{opacity:0.3}}>{item}</Text>
                                      </View>

                              }

                    >



                    </FlatList>
                </View>

                <View style={{height:"68%", paddingTop:"5%"}}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        contentContainerStyle= {{paddingRight:"35%", paddingHorizontal:"6%", alignItems:"center"}}
                        keyExtractor={(item) => item.key.toString()}
                        data = {game}
                        renderItem= {({item}) => <GameScreenItem  gameDetails={item.value}
                                                                  gameId={item.key}
                                                                  user={user}
                                                                  itemType={"Join"}
                        />}
                    >

                    </FlatList>

                </View>




            </Background>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor:"transparent",
        top:-24
        // justifyContent: 'flex-start',
        // flexDirection:"column",
        // backgroundColor:"grey"

    },
    searchBar:{
        flexDirection: "row",
        justifyContent:"space-around",
        alignItems:"center",
        borderBottomWidth:1,
        borderRadius:4,
        width:"98%",
        // marginTop:30,
        marginBottom:10,
        borderColor:"black",
        backgroundColor:"transparent"
    },
    searchInput:{
        width:"85%",
        height:"100%",
        fontSize:20,
        left: 10
    },
    searchSpace:{
        width:"98%",
        height:"10%",
        // flex:1,
        flexDirection:"column",
        justifyContent:"space-around",
        alignItems:"flex-end",
        marginLeft:"2%"
        // borderBottomWidth:1,
        // borderBottomColor:"rgba(177,177,177,0.78)",
    },
    sportItem:{
        // height:"80%",
        // width:"40%",
        flex:1,
        // marginTop:10,
        marginHorizontal:10,
        justifyContent:"flex-start",
        alignItems:"center",

    },
    sportSelection:{
        backgroundColor:'rgb(255,255,255)',
        elevation:10,
        borderRadius:15,
        height:70,
        width:100,
        justifyContent:"center",
        alignItems:"center"

    },
    sportSelected:{
        backgroundColor:'rgb(239,195,144)',
        elevation:5,
        borderRadius:15,
        height:75,
        width:110,
        justifyContent:"center",
        alignItems:"center"
    },
    sportImageShadow:{
        width: 50,
        height: 50 ,
        borderRadius:27.5,
        backgroundColor:"transparent",
        alignItems:"center",
        paddingTop:7.5
    },
    sportImageSelected: {
        width: 50,
        height: 50,
        borderRadius: 27.5,
        // borderWidth: 1,
        // borderColor: "rgba(46,44,47,0.83)",
        backgroundColor: "transparent",
        alignItems: "center",
        paddingTop: 7
    },
    text: {
        color: 'white',
        justifyContent: 'center',
        fontSize: 30,
        fontWeight: "bold",
    },
    hostButton:{
        borderRadius: 20,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
})

export default GameScreen;
