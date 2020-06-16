import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback, Text} from 'react-native';
import firebase from 'firebase';

// import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem";
import BackgroundTrial from "../views/BackgroundTrial";
import firebaseDb from "../firebaseDb";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const GameScreen = props => {

    const playerNames =["Ashley", "Dennis", "Lum Jian Yang", "Kenny Seeeeeet", "JoeAlpharius", "KeaneChan"]

    // to be replaced with the Firebase db
    const [gamesList, setGameList] = useState([
        {key: 0, value: ["Soccer", "Hougang", "Ashley", "02/06/2020 ", "1800 ", "6/10", playerNames]},
        {key: 1, value: ["BasketBall", "Tampines", "Dennis", "02/06/2020 ", "1800 ", "6/10", playerNames]},
        {key: 2, value: ["Badminton", "Pasir Ris", "Ashley", "02/06/2020 ", "1800 ", "6/8", playerNames]},
        {key: 3, value: ["Floorball", "Seng Kang", "Dennis", "02/06/2020 ", "1800 ", "6/20", playerNames]},
        {key: 4, value: ["Golf", "Seng Kang", "Ashley", "02/06/2020 ", "1800 ", "6/10", playerNames]}
    ]);

    const [filteredList, findFilteredList] = useState(gamesList);
    const [searching, findSearching] = useState("");

    //need to refine search method
    const filterList = () => {
        findFilteredList([])

        let filtering = gamesList.map(a => a.value);
        if (searching.length !== 0) {
            let temp = []
            for (let i = 0; i < filtering.length; i++) {
                for (let j = 0; j < 3; j++) {
                    if (typeof filtering[i][j] === "string") {
                        if (filtering[i][j].toLowerCase().includes(searching.toLowerCase())) {
                            temp.push(gamesList[i])
                            break
                        }
                    }
                }
            }
            findFilteredList(temp)
        } else {
            findFilteredList(gamesList);
        }
    }

    const searchHandler = (enteredSearch) => {
        findSearching(enteredSearch)
        filterList()
    }

    const [game, setGame] = useState ([{key:"0",
                                                  value: {sport:"floorball"}}]);
    const gamesRef = firebaseDb.firestore().collection('game_details');
    const allGames = () => {
        gamesRef.get()
            . then(snapshot => {
                const someGame =[];
                let num = 0;
                snapshot.forEach( doc => {
                        someGame.push({key: num, value: doc.data()});
                        num = num + 1;
                    }
                )
                setGame(someGame)
                console.log(game)

            })

            .catch(err => {
                console.log("error", err);
            });
    }
    // need to be able to use useEffects, so that the items load without having to press on the search button
    // useEffect (async() => {await allGames() })


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
                        <SearchButtons style={{flex: 1, elevation: 5}} searchMe={() => {allGames();Keyboard.dismiss();}}/>
                    </View>
                </View>

                <View style={{justifyContent: "space-around", marginTop:10}}>
                    {
                        game.length > 0 &&
                        <FlatList
                            // key = {game.key.toString()}
                            contentContainerStyle= {{justifyContent:"space-between"}}
                            keyExtractor={(item) => item.key.toString()}
                            data = {game}
                            renderItem= {({item}) => <GameItem title={item.value}/>}
                        >

                        </FlatList>
                    }
                    {/*{game.map(item => (*/}
                    {/*    <View style={{*/}
                    {/*        flexDirection:"row",*/}
                    {/*        borderBottomWidth:1,*/}
                    {/*        justifyContent:"space-between",*/}
                    {/*        alignItems:"center",*/}
                    {/*        height:"20%"*/}
                    {/*    }}>*/}
                    {/*        <MaterialCommunityIcons name="account" size={35}/>*/}
                    {/*        <TouchableWithoutFeedback key ={item}*/}
                    {/*                                  style={{fontSize:35, marginLeft:35}}*/}
                    {/*                                  onPress={() => console.log(item.value.date.toDate().toString())}*/}
                    {/*        >*/}
                    {/*            <Text>{item.value.sport}</Text>*/}
                    {/*        </TouchableWithoutFeedback>*/}
                    {/*    </View>*/}
                    {/*))*/}
                    {/*}*/}



                {/*    <FlatList*/}
                {/*        // key={filteredList.key.toString()}*/}
                {/*        contentContainerStyle={{justifyContent: "space-between"}}*/}
                {/*        keyExtractor={(item) => item.key.toString()}*/}
                {/*        data={filteredList}*/}
                {/*// props.title should return only one object*/}
                {/*        renderItem={({item}) => <GameItem title={item.value}/>}*/}
                {/*    />*/}
                </View>
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
