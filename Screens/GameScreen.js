import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback, Text, Alert} from 'react-native';
import firebase from 'firebase';

// import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem";
import BackgroundTrial from "../views/BackgroundTrial";
import firebaseDb from "../firebaseDb";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";



const GameScreen = (props) => {


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
    const currentUser = firebaseDb.auth().currentUser.uid;
    const username = firebaseDb.firestore().collection('users')
        .doc(currentUser)
        .get()
        .then(doc => {
            setUid(doc.data().username);
        });


    const gamesRef = firebaseDb.firestore().collection('game_details');
    const allGames = () => {
        gamesRef.get()
            . then(snapshot => {
                const someGame =[];
                const now = new Date().getTime();
                snapshot.forEach( doc => {
                        const d = doc.data()
                        if (d.date.toMillis() < now) {
                            doc.ref.delete().then(() => {
                            })
                        } else {
                            someGame.push({key: doc.id, value: doc.data()});
                        }
                    }
                )
                setGame(someGame)
            })

            .catch(err => {
                Alert.alert("error", err);
            });
    }
    // keeps the function running, so the items keep rerendering, will pose a problem as the page will
    // keep rerendering itself, might make it difficult for users
    useEffect (() => {setTimeout(() =>{allGames(); setTimeout(()=>{},100000)}, 1000)})


    return (<TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <BackgroundTrial style = {styles.container}>
                <View style={styles.searchSpace}>
                    <View style={styles.searchBar}>
                        <TextInput style={styles.searchInput}
                                   placeholder=" Keywords, Location, HostName"
                                   placeholderTextColor="rgba(0,0,0,1.0)"
                                   onChangeText={searchHandler}
                                   value={searching}
                        />
                        {/*<SearchButtons style={{flex: 1, elevation: 5}} searchMe={() => {filterList(); console.log(filteredList); Keyboard.dismiss();}}/>*/}
                        <SearchButtons style={{flex: 1, elevation: 5}} searchMe={() => {console.log(uid);Keyboard.dismiss();}}/>
                    </View>
                </View>

                {/*<View style={{flex:1, justifyContent: "space-around", marginTop:10}}>*/}
                    <FlatList
                        // key = {game.key.toString()}
                        contentContainerStyle= {{justifyContent:"space-between"}}
                        keyExtractor={(item) => item.key.toString()}
                        data = {game}
                        renderItem= {({item}) => <GameItem title={item.value} gameId={item.key} user={uid}/>}
                    >
                    </FlatList>

            </BackgroundTrial>
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
        // borderWidth:1,
        borderRadius:4,
        width:"98%",
        marginTop:36,
        marginBottom:10,
        borderColor:"white",
        backgroundColor:"ghostwhite"
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
