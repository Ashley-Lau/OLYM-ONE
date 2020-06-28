import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet, FlatList,TouchableOpacity, Text} from 'react-native';

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import RefereeItem from "../Components/RefereeItem";
import firebaseDb from '../firebaseDb';

const RefereeScreen = (props) => {

    // CURRENT USER ===========================================================================================
    const userId = props.route.params.user.id

    // GETTING REFEREE DETAILS ======================================================================================
    const [refereeList, setRefereeList] = useState([])

    useEffect(() => {
        const unsubscribe = firebaseDb.firestore().collection("game_details")
            .limit(15)
            .onSnapshot(snapshot => {
                let gameList = [];
                snapshot.forEach(doc => {
                    if(doc.data().hostId === userId){}
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
            <View style={styles.searchSpace}>
                <View style={styles.searchBar}>
                    <TextInput style={styles.searchInput}
                               placeholder=" Keywords, Referee Name, Sport"
                               placeholderTextColor="#B9B9B9"
                               // onChangeText={searchHandler}
                               // value={searching}
                    />
                    <SearchButtons style={{flex: 1, elevation: 5}} />
                </View>

            </View>

            <View style={{justifyContent: "space-around", marginTop:10}}>
                <FlatList
                    contentContainerStyle={{justifyContent: "space-between"}}
                    keyExtractor={(item) => item.key}
                    data={refereeList}
                    renderItem={({item}) => <RefereeItem refereeId ={userId} gameId={item.key} game_details={item.value}/>}
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
        left: 10
    },
    searchSpace:{
        justifyContent:"center",
        alignItems:"center",
        borderBottomWidth:1,
        borderBottomColor:"rgba(177,177,177,0.78)"
    }

})

export default RefereeScreen;
