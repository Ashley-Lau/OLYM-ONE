import React, {useState} from 'react';
import {View, TextInput, StyleSheet, FlatList,} from 'react-native';
import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem";
import Styles from "../styling/Styles";

const GameScreen = props => {

    const playerNames =["Ashley", "Dennis", "Lum Jian Yang", "Kenny Seeeeeet", "JoeAlpharius", "KeaneChan"]

    // to be replaced with the Firebase db
    const [gamesList, setGameList] = useState([
        {key: 0, value: ["Hougang", "Ashley", "02/06/2020 ", "1800 ", "6/10", playerNames]},
        {key: 1, value: ["Tampines", "Dennis", "02/06/2020 ", "1800 ", "6/10", playerNames]},
        {key: 2, value: ["Pasir Ris", "Ashley", "02/06/2020 ", "1800 ", "6/10", playerNames]},
        {key: 3, value: ["Seng Kang", "Dennis", "02/06/2020 ", "1800 ", "6/10", playerNames]},
        {key: 4, value: ["Seng Kang", "Ashley", "02/06/2020 ", "1800 ", "6/10", playerNames]}
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

    return (<Background style = {styles.container}>
                <View style={styles.searchBar}>
                    <TextInput style={styles.searchInput}
                               placeholder="Keywords, Location, HostName"
                               onChangeText={searchHandler}
                               value={searching}
                    />
                    <SearchButtons style={{flex: 1, elevation: 5}} searchMe={filterList}/>
                </View>
                <View style={{justifyContent: "space-around"}}>
                    <FlatList
                        contentContainerStyle={{justifyContent: "space-between"}}
                        keyExtractor={(item) => item.key.toString()}
                        data={filteredList}
                        renderItem={({item}) => <GameItem title={item.value}/>}
                    />
                </View>
        </Background>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection:"column"
    },
    searchBar:{
        // marginTop: 20,
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    searchInput:{
        width:"85%",
        height:45,
        fontSize:20,
        borderBottomWidth: 1,
    }

})

export default GameScreen;
