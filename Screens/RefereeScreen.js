import React, {useState, useEffect} from 'react';
import {View,StyleSheet, FlatList} from 'react-native';

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem"
import firebaseDb from '../firebaseDb';
import {Select, SelectItem} from "@ui-kitten/components";

const RefereeScreen = (props) => {

    // ARRAY FOR PICKER IN THE SEARCH BAR ==============================================================================
    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"];
    const [sportsIndex, setSportsIndex] = useState();
    const [sportValue, setSportValue] = useState();

    // SEARCH BAR FUNCTION =============================================================================================

    const gamesRef = firebaseDb.firestore().collection("game_details")
    const searchSport = () => {
        let searched = [];
        gamesRef.where('sport', '==', sportValue)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if(doc.data().hostId === userId){}
                    else if(doc.data().referee[0] === "Yes") {
                        searched.push({key:doc.id, value:doc.data()})
                    }
                })
                setRefereeList(searched);
            })
    }

    // CURRENT USER ===========================================================================================
    const user = props.route.params.user
    const userId = props.route.params.user.id

    // GETTING REFEREE DETAILS ======================================================================================
    const [refereeList, setRefereeList] = useState([])

    useEffect(() => {
        const unsubscribe = gamesRef
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

                {/*<FlatList*/}
                {/*    contentContainerStyle={{justifyContent: "space-between"}}*/}
                {/*    keyExtractor={(item) => item.key}*/}
                {/*    data={refereeList}*/}
                {/*    renderItem={({item}) => <RefereeItem refereeId ={props.route.params.user} gameId={item.key} game_details={item.value}/>}*/}
                {/*/>*/}
                <FlatList
                    contentContainerStyle={{justifyContent: "space-between"}}
                    keyExtractor={(item) => item.key}
                    data={refereeList}
                    renderItem={({item}) => <GameItem user ={props.route.params.user}
                                                         gameId={item.key}
                                                         gameDetails={item.value}
                                                         itemType={"Referee"}
                    />}
                />

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
        borderBottomColor:"rgba(177,177,177,0.78)",
        marginBottom: 10,
    }

})

export default RefereeScreen;
