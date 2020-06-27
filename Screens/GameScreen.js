import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback, Text, Alert, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import {useNavigation} from "@react-navigation/native";

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem";
import firebaseDb from "../firebaseDb";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";



const GameScreen = (props) => {
    const navigation = useNavigation()


    // FOR SEARCH FUNCTION ================================================================================================
    const [filteredList, findFilteredList] = useState(game);
    const [searching, findSearching] = useState("");

    //need to refine search method
    const filterList = () => {
        findFilteredList([])

        let filtering = game.map(a => a.value);
        if (searching.length !== 0) {
            let temp = []
            for (let i = 0; i < filtering.length; i++) {
                for (let j = 0; j < 3; j++) {
                    if (typeof filtering[i][j] === "string") {
                        if (filtering[i][j].toLowerCase().includes(searching.toLowerCase())) {
                            temp.push(game[i])
                            break
                        }
                    }
                }
            }
            findFilteredList(temp)
        } else {
            findFilteredList(game);
        }
    }

    const searchHandler = (enteredSearch) => {
        findSearching(enteredSearch)
        filterList()
    }

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
                            // console.log("nimama reloading " + num);
                            num = num + 1;
                            if(d.date.toMillis() < now){
                                doc.ref.delete().then(()=>{});
                            } else if(d.availability <= 0){}
                            else if(d.hostId === currentUser){}
                            else {
                                someGame.push({key:doc.id, value:doc.data()});
                            }

                        }

                    )
                    setGame(someGame);
                },
                error => {
                    Alert.alert("error", error)
                })
    }

    useEffect(() => {
        allGames();

    }, [])

    return (<TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <Background style = {styles.container}>
                <View style={styles.searchSpace}>
                    <View style={styles.searchBar}>
                        <TextInput style={styles.searchInput}
                                   placeholder=" Keywords, Location, HostName"
                                   placeholderTextColor="#B9B9B9"
                                   onChangeText={searchHandler}
                                   value={searching}
                        />
                        {/*<SearchButtons style={{flex: 1, elevation: 5}} searchMe={() => {filterList(); console.log(filteredList); Keyboard.dismiss();}}/>*/}
                        <SearchButtons style={{flex: 1, elevation: 5}} searchMe={() => {console.log(uid);Keyboard.dismiss();}}/>
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

    },
    searchSpace:{
        justifyContent:"center",
        alignItems:"center",
        borderBottomWidth:1,
        borderBottomColor:"rgba(177,177,177,0.78)"
    }

})

export default GameScreen;
