import {AntDesign, FontAwesome, FontAwesome5} from "react-native-vector-icons";
import {Text, View, StyleSheet, Dimensions} from "react-native";
import React from "react";

const style = StyleSheet.create({
    noApplication: {
        fontSize: 33,
        alignSelf: 'center',
        color: '#5a5959',
        top: 20,
        textAlign:'center'
    },
})

// picture shown when list in home tab contains no data ================================================================
export const noUpcomingReferee  = (
    <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1, bottom: 10}}>
    <FontAwesome name = 'optin-monster' size={100} color={'#5c5c5c'}/>
        <Text style = {{...style.noApplication, fontSize: 25, color: 'black'}}>No Games to Referee</Text>
        <Text style = {{...style.noApplication, fontSize: 15}}>Search for games to referee in referee tab!</Text>
    </View>
)

export const noNotifications  = (
    <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1, bottom: 10}}>
        <FontAwesome5 name = 'bell-slash' size={85} color={'#5c5c5c'}/>
        <Text style = {{...style.noApplication, fontSize: 25, color: 'black'}}>No Notifications!</Text>
    </View>
)

export const noApplications = (
    <View style = {{alignItems: 'center', top: Dimensions.get('window').height * 0.15}}>
        <FontAwesome name = 'linux' size={100} color={'#5c5c5c'}/>
        <Text style = {style.noApplication}>No Applications!</Text>
    </View>
)

export const noUpcomingGame = (
    <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1, bottom: 10}}>
        <FontAwesome name = 'soccer-ball-o' size={100} color={'#5c5c5c'}/>
        <Text style = {{...style.noApplication, fontSize: 25, color: 'black'}}>No Upcoming Games</Text>
        <Text style = {{...style.noApplication, fontSize: 15}}>Search for games to play in games tab!</Text>
    </View>
)

// picture shown when the users have not inputted zone or sport yet for game or referee tab==========================================
export const noInput = (
    <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1, bottom: 50}}>
        <FontAwesome name = 'search-plus' size={100} color={'#5c5c5c'}/>
        <Text style = {{...style.noApplication, fontSize: 25, color: 'black'}}>No sport or zone selected</Text>
        <Text style = {{...style.noApplication, fontSize: 15, width: Dimensions.get('window').width * 0.8}}>Search for games or sport by filling the fields above!</Text>
    </View>
)

export const noSport = (
    <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1, bottom: 50}}>
        <AntDesign name = 'frowno' size={100} color={'#5c5c5c'}/>
        <Text style = {{...style.noApplication, fontSize: 25, color: 'black'}}>No games available</Text>
        <Text style = {{...style.noApplication, fontSize: 15, width: Dimensions.get('window').width * 0.8}}>There are no games currently for the selected location and sport.</Text>
    </View>
)