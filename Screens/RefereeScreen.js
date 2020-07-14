import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem"
import firebaseDb from '../firebaseDb';
import {Select, SelectItem} from "@ui-kitten/components";
import Entypo from "react-native-vector-icons/Entypo";
import GameScreenItem from "../Components/GameScreenItem";
import LocationSearchBar from "../Components/LocationSeachBar";

const sHeight = Dimensions.get('window').height


const RefereeScreen = (props) => {

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

    const gamesRef = firebaseDb.firestore().collection("game_details")
    const searchSport = (sport) => {
        let searched = [];
        gamesRef.where('sport', '==', sport)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if(doc.data().hostId === userId){}
                    else if(doc.data().players.includes(userId)){}
                    else if(doc.data().referee[0] === "Yes") {
                        searched.push({key:doc.id, value:doc.data()})
                    }
                })
                setRefereeList(searched);
            })
    }

    // CURRENT USER ===========================================================================================
    const user = props.route.params.user
    const userId = props.route.params.user.id

    // GETTING REFEREE DETAILS ======================================================================================
    const [refereeList, setRefereeList] = useState([])

    useEffect(() => {
        const unsubscribe = gamesRef
            .limit(15)
            .onSnapshot(snapshot => {
                let gameList = [];
                snapshot.forEach(doc => {
                    if(doc.data().hostId === userId){}
                    else if(doc.data().players.includes(userId)){}
                    else if(doc.data().referee[0] === "Yes"){
                        gameList.push({key:doc.id, value:doc.data()});
                    }
                })
                setRefereeList(gameList)
            },
                err => {
                console.log(err.message);
                })

        return () => unsubscribe()
    }, [])


    return (
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
        <Background style = {styles.container}>

            {/*==================================== Title and hosting a game ======================================*/}
            <View style = {{justifyContent: 'space-between',height: sHeight * 0.08, width: '100%', flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal:10}}>
                <Text style = {styles.text}>Referable Games</Text>

            </View>

            {/*================================== SEARCH BAR ==============================================*/}

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
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    contentContainerStyle= {{paddingLeft:"8.5%", alignItems:"center"}}
                    keyExtractor={(item) => item.key.toString()}
                    data = {refereeList}
                    renderItem= {({item}) => <GameScreenItem  gameDetails={item.value}
                                                              gameId={item.key}
                                                              user={user}
                                                              itemType={"Referee"}
                    />}
                >

                </FlatList>

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
        backgroundColor: "transparent",
        alignItems: "center",
        paddingTop: 7,
    },
    text: {
        color: 'white',
        justifyContent: 'center',
        fontSize: 27,
        fontWeight: "bold",
    },

})

export default RefereeScreen;
