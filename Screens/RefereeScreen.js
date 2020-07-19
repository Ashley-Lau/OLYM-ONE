import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback, Alert
} from 'react-native';
import {Select, SelectItem} from "@ui-kitten/components";

import Background from "../views/Background";
import firebaseDb from '../firebaseDb';
import LocationSearchBar from "../Components/LocationSeachBar";
import Styles from "../styling/Styles";
import FullGameItem from "../Components/FullGameItem";
import {noInput, noSport} from "../Components/NoDataMessages";


const sHeight = Dimensions.get('window').height

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);


const RefereeScreen = (props) => {

    // CURRENT USER ===========================================================================================
    const user = props.route.params.user
    const userId = user.id

    // Referee array to show list of available referee games =============================================================================================
    const [refereeList, setRefereeList] = useState([])

    //UPDATING AND QUERYING OF OUTDATED GAME DETAILS ================================================================================================    let listener = null
    let listener = null
    const gamesRef = firebaseDb.firestore().collection("game_details");
    const refApplRef = firebaseDb.firestore().collection('application_details');
    const playerApplRef = firebaseDb.firestore().collection('player_application_details');


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
                    deleteRefAppl(doc.id)
                })
                batch.commit().catch(error => console.log(error))
            })
            .catch(error => console.log(error))
    }, [])

    const deleteRefAppl = (gameId) => {
        const playerApplRef = firebaseDb.firestore().collection("player_application_details")
        playerApplRef.where('gameId', '==' , gameId)
            .get()
            .then(response => {
                let batch = firebaseDb.firestore().batch()
                response.docs.forEach((doc) => {
                    const docRef = applRef.doc(doc.id)
                    batch.delete(docRef)
                })
                batch.commit().catch(error => console.log(error))
            })
            .catch(error => console.log(error))
        const applRef = firebaseDb.firestore().collection("application_details")
          applRef.where('gameId', '==' , gameId)
              .get()
              .then(response => {
                  let batch = firebaseDb.firestore().batch()
                  response.docs.forEach((doc) => {
                      const docRef = applRef.doc(doc.id)
                      batch.delete(docRef)
                  })
                  batch.commit().catch(error => console.log(error))
              })
              .catch(error => console.log(error))
    }

    //ANIMATED COMPONENTS =========================================================================================
    const x = new Animated.Value(0);
    const onScroll = Animated.event([{ nativeEvent: {contentOffset: { x } } }],
        {useNativeDriver:true,
        });

    // ARRAY FOR PICKER IN THE SEARCH BAR ==============================================================================
    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"];
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
                        const data = doc.data();
                        if(data.date.toMillis() < now){
                            doc.ref.delete().then(()=>{});
                            deleteRefAppl(doc.id)
                        }
                        else if(data.hostId === userId){}
                        else if(data.players.includes(userId)){}
                        else if(data.refereeList.includes(userId)){}
                        else if(parseInt(data.refereeSlots) <= 0){}
                        else if(data.referee[0] === "YES"){
                            filteredGames.push({key:doc.id, value:doc.data()});
                        }
                    })
                    setRefereeList(filteredGames)
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
                        const data = doc.data();
                        if(data.date.toMillis() < now){
                            doc.ref.delete().then(()=>{});
                            deleteRefAppl(doc.id)
                        }
                        else if(data.hostId === userId){}
                        else if(data.players.includes(userId)){}
                        else if(data.refereeList.includes(userId)){}
                        else if(parseInt(data.refereeSlots) <= 0){}
                        else if(data.referee[0] === "YES"){
                            filteredGames.push({key:doc.id, value:doc.data()});
                        }
                    })
                    setRefereeList(filteredGames)
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
                        const data = doc.data();
                        if(data.date.toMillis() < now){
                            doc.ref.delete().then(()=>{});
                            deleteRefAppl(doc.id)
                        }
                        else if(data.hostId === userId){}
                        else if(data.players.includes(userId)){}
                        else if(data.refereeList.includes(userId)){}
                        else if(parseInt(data.refereeSlots) <= 0){}
                        else if(data.referee[0] === "YES"){
                            filteredGames.push({key:doc.id, value:doc.data()});
                        }
                    })
                    setRefereeList(filteredGames)
                    setSearchedBefore(true)
                } , err => {
                    console.log(err.message);
                })
        }
    }

    return (
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
        <Background style = {styles.container}>
            <View style = {{top: Styles.statusBarHeight.height}}>
            {/*==================================== Title and hosting a game ======================================*/}
                <View style = {{justifyContent: 'space-between',height: sHeight * 0.08, width: '100%', flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal:10}}>
                    <Text style = {styles.text}>Referable Games</Text>

                </View>

                {/*================================== SEARCH BAR ==============================================*/}

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
                                                                setSportValue(item);
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
                                                            onPress ={ () => {
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
                        : refereeList.length === 0
                            ? noSport
                            :   <AnimatedFlatList
                                    scrollEventThrottle={16}
                                    {...{onScroll}}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    contentContainerStyle= {{paddingLeft:"8.5%", alignItems:"center"}}
                                    keyExtractor={(item) => item.key.toString()}
                                    data = {refereeList}
                                    renderItem= {({item, index }) => <FullGameItem gameDetails={item.value}
                                                                           gameId={item.key}
                                                                           user={user}
                                                                           itemType={"Referee"}
                                                                           index = {index}
                                                                           translateX = {x}
                                />}
                                >

                                </AnimatedFlatList>}

                </View>
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
        paddingTop: 7,
    },
    text: {
        color: 'white',
        fontSize: 27,
        fontWeight: "bold",
    },
})

export default RefereeScreen;
