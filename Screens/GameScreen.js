import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback, Text, Alert, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import {useNavigation} from "@react-navigation/native";
import {Select, SelectItem, SelectItem0} from "@ui-kitten/components";

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem";
import firebaseDb from "../firebaseDb";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";



const GameScreen = (props) => {
    const navigation = useNavigation()

    // ARRAY FOR PICKER IN THE SEARCH BAR ==============================================================================
    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"];
    const [sportsIndex, setSportsIndex] = useState();
    const [sportValue, setSportValue] = useState();

    // SEARCH BAR FUNCTION =============================================================================================
    const searchSport = () => {
        console.log(sportValue)
        let searched = [];
        const now = new Date().getTime();
        gamesRef.where('sport', '==', sportValue)
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
    const[uid, setUid] = useState('')

    //UID OF USER ================================================================================================
    const currentUser = props.route.params.user.id;
    // console.log(props.route.params.user.username)

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

    return (<TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <Background style = {styles.container}>
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

                {game.length !== 0
                    ?
                    <FlatList
                    // key = {game.key.toString()}
                    contentContainerStyle= {{justifyContent:"space-between"}}
                    keyExtractor={(item) => item.key.toString()}
                    data = {game}
                    renderItem= {({item}) => <GameItem  title={item.value}
                                                        // updateGames ={allGames}
                                                        gameId={item.key} user={currentUser}/>}
                >

                    </FlatList>
                    :
                    <TouchableOpacity style = {{flex:1, justifyContent:"center", alignItems:"center"}}>
                        <Text style={{color:"black", fontSize:15}}>There are currently no games!</Text>

                    </TouchableOpacity>

                }

            </Background>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection:"column"
    },
    searchBar:{
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center",
        borderWidth:1,
        borderRadius:4,
        width:"98%",
        marginTop:36,
        marginBottom:10,
        borderColor:"black",
        backgroundColor:"transparent"
    },
    searchInput:{
        width:"85%",
        height:45,
        fontSize:20,
        left: 10
    },
    searchSpace:{
        justifyContent:"center",
        alignItems:"center",
        borderBottomWidth:1,
        borderBottomColor:"rgba(177,177,177,0.78)"
    }

})

export default GameScreen;
