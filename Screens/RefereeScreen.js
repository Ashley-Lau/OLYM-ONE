import React, {useState} from 'react';
import {View, TextInput, StyleSheet, FlatList,} from 'react-native';

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import RefereeItem from "../Components/RefereeItem";

const RefereeScreen = props => {

    // to be replaced with the Firebase db
    const [refereeList, setRefereeList] = useState([
        {key: 0, value: ["Soccer", "Ashley"]},
        {key: 1, value: ["BasketBall", "Dennis"]},
        {key: 2, value: ["Badminton", "Lum Jian Yang"]},
        {key: 3, value: ["Floorball", "Kenny Seeeeeet"]},
        {key: 4, value: ["Badminton", "JoeAlpharius"]},
        {key: 5, value: ["Soccer", "KeaneChan"]}
    ]);

    const [filteredList, findFilteredList] = useState([...refereeList]);
    const [searching, findSearching] = useState("");

    const filteredGames = (searchItem) => {
        findFilteredList([...filteredList, searchItem]);
    }

    //need to refine search method
    const filterList = () => {
        //not sure why resetting onPress doesnt work
        findFilteredList([]);

        let filtering = refereeList.map(a => a.value);
        for (var i = 0; i < filtering.length; i++) {
            for (var j = 0; j < filtering[i].length; j++) {
                if(typeof filtering[i][j] === "string"){
                    if (searching.toLowerCase() == filtering[i][j].toLowerCase()) {
                        filteredGames(refereeList[i]);
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
            <View style={styles.searchSpace}>
                <View style={styles.searchBar}>
                    <TextInput style={styles.searchInput}
                               placeholder=" Keywords, Referee Name, Sport"
                               placeholderTextColor="#B9B9B9"
                               onChangeText={searchHandler}
                               value={searching}
                    />
                    <SearchButtons style={{flex: 1, elevation: 5}} searchMe={filterList}/>
                </View>

            </View>

            <View style={{justifyContent: "space-around", marginTop:10}}>
                <FlatList
                    contentContainerStyle={{justifyContent: "space-between"}}
                    keyExtractor={(item) => item.key.toString()}
                    data={filteredList}
                    renderItem={({item}) => <RefereeItem title={item.value}/>}
                />
            </View>
        </Background>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop:36,
        justifyContent: 'flex-start',
        flexDirection:"column"
    },
    searchBar:{
        // marginTop: 20,
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center",
        borderWidth:1,
        borderRadius:4,
        width:"98%",
        marginTop:36,
        marginBottom:10
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

export default RefereeScreen;
