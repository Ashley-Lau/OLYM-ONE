import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity, Image} from 'react-native';

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem"
import firebaseDb from '../firebaseDb';
import {Select, SelectItem} from "@ui-kitten/components";
import Entypo from "react-native-vector-icons/Entypo";
import GameScreenItem from "../Components/GameScreenItem";

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


    return (<Background style = {styles.container}>

            {/*==================================== Title and hosting a game ======================================*/}
            <View style = {{marginTop:"5%", justifyContent: 'space-between',height: "8%", width: '100%', flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal:10}}>
                <Text style = {styles.text}> Referable Games </Text>

            </View>

            {/*================================== SEARCH BAR ==============================================*/}

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

            <View style={{height:"68%", paddingTop:"5%"}}>
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
    )
}

const styles = StyleSheet.create({
    container: {
        // top:-24
        // flex: 1,
        // marginTop:36,
        // justifyContent: 'flex-start',
        // flexDirection: "column",
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
        alignItems:"center",
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

export default RefereeScreen;
