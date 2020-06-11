import React, {useState} from 'react';
import {View, TextInput, StyleSheet, FlatList,} from 'react-native';

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem";
import BackgroundTrial from "../views/BackgroundTrial";

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

    const [filteredList, findFilteredList] = useState([...gamesList]);
    const [searching, findSearching] = useState("");

    const filteredGames = (searchItem) => {
        findFilteredList([...filteredList, searchItem]);
    }

    //need to refine search method
    const filterList = () => {
        //not sure why resetting onPress doesnt work
        findFilteredList([]);

        let filtering = gamesList.map(a => a.value);
        for (var i = 0; i < filtering.length; i++) {
            for (var j = 0; j < filtering[i].length; j++) {
                if(typeof filtering[i][j] === "string"){
                    if (searching.toLowerCase() == filtering[i][j].toLowerCase()) {
                        filteredGames(gamesList[i]);
                        break;
                    };
                };
            };
        };

    }

    const searchHandler = (enteredSearch) => {
        findSearching(enteredSearch);
        findFilteredList([]);
    }

    return (<BackgroundTrial style = {styles.container}>
            <View style={styles.searchSpace}>
                <View style={styles.searchBar}>
                    <TextInput style={styles.searchInput}
                               placeholder=" Keywords, Location, HostName"
                               placeholderTextColor="rgba(0,0,0,1.0)"
                               onChangeText={searchHandler}
                               value={searching}
                    />
                    <SearchButtons style={{flex: 1, elevation: 5}} searchMe={filterList}/>
                </View>

            </View>

            <View style={{justifyContent: "space-around", marginTop:10}}>
                <FlatList
                    // key={filteredList.key.toString()}
                    contentContainerStyle={{justifyContent: "space-between"}}
                    keyExtractor={(item) => item.key.toString()}
                    data={filteredList}
                    renderItem={({item}) => <GameItem title={item.value}/>}
                />
            </View>
        </BackgroundTrial>
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
