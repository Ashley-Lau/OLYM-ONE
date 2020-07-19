import React, {useEffect, useState} from 'react';
import {
    Animated,
    View,
    Image,
    StyleSheet,
    FlatList,
    Keyboard,
    TouchableWithoutFeedback,
    Text,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native';

import {useNavigation} from "@react-navigation/native";
import Entypo from 'react-native-vector-icons/Entypo';


import Background from "../views/Background";
import LocationSearchBar from "../Components/LocationSeachBar";
import FullGameItem from "../Components/FullGameItem";
import firebaseDb from "../firebaseDb";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GameDetailsModal from "../Components/GameDetailsModal";


const sHeight = Dimensions.get('window').height

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const GameScreen = (props) => {
    const navigation = useNavigation()

    //UID OF USER ================================================================================================
    const user = props.route.params.user
    const currentUser = user.id;

    // Array for available games ==============================================================================================
    const [game, setGame] = useState ([]);

    //UPDATING AND QUERYING OF OUTDATED GAME DETAILS ================================================================================================

    const gamesRef = firebaseDb.firestore().collection('game_details');
    const refApplRef = firebaseDb.firestore().collection('application_details');
    const playerApplRef = firebaseDb.firestore().collection('player_application_details');
    let listener = null

    useEffect(() => {
        // deleting of expired games
        const now = new Date().getTime() / 1000;
        gamesRef.where('date', '<', now)
            .get()
            .then(response => {
                let batch = firebaseDb.firestore().batch()
                response.docs.forEach((doc) => {
                    const docRef = gamesRef.doc(doc.id)
                    batch.delete(docRef)
                })
                batch.commit().catch(error => console.log(error))
            })
            .catch(error => console.log(error))
    }, [])

    //ANIMATED COMPONENTS =========================================================================================
    const [x,setX] = useState(new Animated.Value(0));
    const onScroll = Animated.event([{ nativeEvent: {contentOffset: { x } } }],
        {useNativeDriver:true,
        });

    // ARRAY FOR SPORT SELECTION BELOW SEARCH BAR ==============================================================================
    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis"];
    const [sportValue, setSportValue] = useState('');

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
        }
    }

    // SEARCH BAR FUNCTIONS AND PARAMS ===========================================================================================
    const [zone, setZone] = useState('')
    const [searchedBefore, setSearchedBefore] = useState(false)

    const noFieldsSelected = () => Alert.alert(
        "No Fields selected!",
        "Please select a zone or location or both.",
        [
            {text:"Confirm", onPress: () => {},  style:'cancel'}
        ],
        {cancelable: false}
    )

    // searching function on pressing search or any of the sport ==============================================
    // will only go through when a valid zone is selected =============================
    const search = (sportValue) => {
        if (sportValue === '' && zone === '') {
            noFieldsSelected()
            return
        }
        if (listener !== null) {
            // unsubscribing from current listener
            listener()
        }
        if (sportValue !== '' && zone !== '') {
            listener = gamesRef
                            .orderBy("date", "asc")
                            .where('sport', '==', sportValue)
                            .where('location', '==', zone)
                            .onSnapshot(documents => {
                                const now = new Date().getTime()
                                const filteredGames = []
                                documents.forEach( doc => {
                                    const d = doc.data();
                                    if(d.date.toMillis() < now){
                                        playerApplRef.where("gameId", "==", doc.ref)
                                            .get()
                                            .then(snapShot => {
                                                snapShot.forEach(doc => {
                                                    doc.ref.delete().then(()=>{});
                                                })
                                            });
                                        refApplRef.where("gameId", "==", doc.ref)
                                            .get()
                                            .then(snapShot => {
                                                snapShot.forEach(doc => {
                                                    doc.ref.delete().then(()=>{});
                                                })
                                            });
                                        doc.ref.delete().then(()=>{})
                                    } else if(d.hostId === currentUser){}
                                    else if( parseInt(d.availability) <= 0){}
                                    else if(d.players.includes(currentUser)){}
                                    else {
                                        filteredGames.push({key:doc.id, value:doc.data()});
                                    }
                                })
                                setGame(filteredGames)
                                setSearchedBefore(true)
                            } , err => {
                                console.log(err.message);
                            })
            return;
        }
        if (sportValue !== '') {
            listener = gamesRef
                            .orderBy("date", "asc")
                            .where('sport', '==', sportValue)
                            .onSnapshot(documents => {
                                const now = new Date().getTime()
                                const filteredGames = []
                                documents.forEach( doc => {
                                        const d = doc.data();
                                        if(d.date.toMillis() < now){
                                            playerApplRef.where("gameId", "==", doc.ref)
                                                .get()
                                                .then(snapShot => {
                                                    snapShot.forEach(doc => {
                                                        doc.ref.delete().then(()=>{});
                                                    })
                                                });
                                            refApplRef.where("gameId", "==", doc.ref)
                                                .get()
                                                .then(snapShot => {
                                                    snapShot.forEach(doc => {
                                                        doc.ref.delete().then(()=>{});
                                                    })
                                                });
                                            doc.ref.delete().then(()=>{});
                                        } else if(d.hostId === currentUser){}
                                        else if( parseInt(d.availability) <= 0){}
                                        else if(d.players.includes(currentUser)){}
                                        else {
                                            filteredGames.push({key:doc.id, value:doc.data()});
                                        }
                                    }
                                )
                                setGame(filteredGames)
                                console.log(filteredGames.length)
                                setSearchedBefore(true)
                            }, err => {
                                console.log(err.message);
                            })
            return;
        }
        if (zone !== '') {
            listener = gamesRef
                            .orderBy("date", "asc")
                            .where('location', '==', zone)
                            .onSnapshot(documents => {
                                const now = new Date().getTime()
                                const filteredGames = []
                                documents.forEach( doc => {
                                        const d = doc.data();
                                        if(d.date.toMillis() < now){
                                            playerApplRef.where("gameId", "==", doc.ref)
                                                .get()
                                                .then(snapShot => {
                                                    snapShot.forEach(doc => {
                                                        doc.ref.delete().then(()=>{});
                                                    })
                                                });
                                            refApplRef.where("gameId", "==", doc.ref)
                                                .get()
                                                .then(snapShot => {
                                                    snapShot.forEach(doc => {
                                                        doc.ref.delete().then(()=>{});
                                                    })
                                                });
                                            doc.ref.delete().then(()=>{});
                                        } else if(d.hostId === currentUser){}
                                        else if( parseInt(d.availability) <= 0){}
                                        else if(d.players.includes(currentUser)){}
                                        else {
                                            filteredGames.push({key:doc.id, value:doc.data()});
                                        }
                                    }
                                )
                                setGame(filteredGames)
                                setSearchedBefore(true)
                            } , err => {
                                console.log(err.message);
                            })
        }
    }

    // picture shown when the users have not inputted zone or sport yet ==========================================
    const noInput = (
        <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1, bottom: 50}}>
            <FontAwesome name = 'search-plus' size={100} color={'#5c5c5c'}/>
            <Text style = {{...styles.noApplication, fontSize: 25, color: 'black'}}>No sport or zone selected</Text>
            <Text style = {{...styles.noApplication, fontSize: 15,}}>Search for games or sport by filling the fields above!</Text>
        </View>
    )

    const noSport = (
        <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1, bottom: 50}}>
            <FontAwesome5 name = 'sad-tear' size={100} color={'#5c5c5c'}/>
            <Text style = {{...styles.noApplication, fontSize: 25, color: 'black'}}>No games available</Text>
            <Text style = {{...styles.noApplication, fontSize: 15}}>There are no games currently for the selected location and sport.</Text>
        </View>
    )

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
                    <LocationSearchBar select = {val => setZone(val)}
                                       onPress = {() => search(sportValue)}/>
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
                                                                console.log(item)
                                                                search(item);
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
                                                            onPress ={() => {
                                                                console.log(item)
                                                                setSportValue(item);
                                                                search(item);
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

                    {!searchedBefore
                        ? noInput
                        : game.length === 0
                            ? noSport
                            : <AnimatedFlatList
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
                    }

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
        flex:1,
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
        paddingTop: 7
    },
    text: {
        color: 'white',
        fontSize: 27,
        fontWeight: "bold",
    },
    noApplication: {
        fontSize: 33,
        alignSelf: 'center',
        color: '#5a5959',
        top: 20,
        textAlign:'center',
        width: Dimensions.get('window').width * 0.8
    },
})

export default GameScreen;
