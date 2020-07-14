import React, {useEffect, useState} from 'react';
import {Animated, View, Image, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity, SafeAreaView, Dimensions} from 'react-native';

import {useNavigation} from "@react-navigation/native";
import {Select, SelectItem,} from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';


import Background from "../views/Background";
import GameItem from "../Components/GameItem";
import LocationSearchBar from "../Components/LocationSeachBar";
import FullGameItem from "../Components/FullGameItem";
import firebaseDb from "../firebaseDb";

const sHeight = Dimensions.get('window').height

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const GameScreen = (props) => {
    const navigation = useNavigation()
    const user = props.route.params.user

    //ANIMATED COMPONENTS =========================================================================================
    const x = new Animated.Value(0);
    const onScroll = Animated.event([{ nativeEvent: {contentOffset: { x } } }],
        {useNativeDriver:true,
        });

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
                    else if(d.players.includes(currentUser)){}
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
                            else if(d.players.includes(currentUser)){}
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

    return (
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <Background>
                {/*==================================== Title and hosting a game ======================================*/}
                <View style = {{justifyContent: 'space-between',height: sHeight * 0.08, width: '100%', flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal:10}}>
                    <Text style = {styles.text}>Games </Text>
                    <View style = {{alignItems: 'center', justifyContent: 'center', flexDirection: 'row',}}>
                        <Text style = {{...styles.text, fontSize: 25}}> Host </Text>
                        <TouchableOpacity style = {{backgroundColor: 'rgba(255,255,255,0.30)', borderRadius: 20, alignItems: 'center', justifyContent: 'center',height: 40, width: 40 }}
                                          activeOpacity={ 0.9}
                                          onPress={() => {
                                              navigation.navigate('HostGameScreen',
                                                  {
                                                      uid: currentUser,
                                                  }
                                              )
                                          }}
                        >
                            <Entypo name="plus" color={'white'} size={35}/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*==================================SEARCH BAR ==============================================*/}
                <View style={styles.searchSpace}>
                    <LocationSearchBar onPress = {() => {}}/>
                </View>
                {/*===============================Sport Selection ===========================================*/}

                <View style={{height: sHeight * 0.14}}>
                    <FlatList showsHorizontalScrollIndicator={false}
                              horizontal={true}
                              contentContainerStyle= {{justifyContent:"space-between"}}
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

                <View style={{height:sHeight * 0.6, paddingVertical:"4%"}}>

                    <AnimatedFlatList
                        scrollEventThrottle={16}
                        {...{onScroll}}
                        showsHorizontalScrollIndicator={false}
                        //KIV need to do some Apploading for it to work
                        // initialScrollIndex={Math.floor(game.length/2)}
                        horizontal={true}
                        contentContainerStyle= {{ paddingHorizontal:"8.5%", alignItems:"center"}}
                        keyExtractor={(item) => item.key.toString()}
                        data = {game}
                        renderItem= {({item, index}) => <FullGameItem gameDetails={item.value}
                                                               gameId={item.key}
                                                               user={user}
                                                               itemType={"Join"}
                                                               translateX = {x}
                                                               index = {index}

                        />}
                    >

                    </AnimatedFlatList>


                </View>
            </Background>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    searchSpace:{
        width:"96%",
        height: sHeight * 0.1,
        justifyContent: 'center',
        alignSelf: 'center'
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
        alignItems:"center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.27,

    },
    sportSelected:{
        backgroundColor:'rgb(239,195,144)',
        elevation:5,
        borderRadius:15,
        height:75,
        width:110,
        justifyContent:"center",
        alignItems:"center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.27,
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
        fontSize: 27,
        fontWeight: "bold",
    },
})

export default GameScreen;
