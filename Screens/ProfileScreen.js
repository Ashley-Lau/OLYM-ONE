import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    ScrollView,
    Image,
} from 'react-native';
import {useNavigation} from "@react-navigation/native";

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import HostGameItem from "../Components/HostGameItem";
import firebaseDb from "../firebaseDb";

const ProfileScreen = props => {
    const navigation = useNavigation();
    const[hostGame, setHostGame] = useState(false);

    const confirmLogOut = () => {
        Alert.alert("Confirm Log Out",
            "Do you want to log out?",
            [{
                text: "Yes",
                onPress: () => navigation.navigate('LoginScreen'),
                style: 'cancel'
            },
                {text:"Cancel", onPress: () => {},  style:'cancel'}
            ],
            {cancelable: false}
        )
    }

    const logout = () => {
        firebaseDb.auth()
            .signOut()
            .then(() => confirmLogOut());
    }

    return <Background>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style = {{alignItems: 'center', paddingBottom: 30,}}>
                        <View style = {{...style.elevatedComponent, height: 300, justifyContent: 'space-evenly'}}>
                            <View style = {{flexDirection: 'row', justifyContent: 'space-around', paddingTop: 5,}}>
                                <View style = {style.photoFrame}>
                                    <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {require('../assets/OLYMONE.png')}/>
                                </View>
                                <HostGameItem visible={hostGame} closeHost={() =>setHostGame(false)}/>
                                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                                colors = {['#1bb479','#026c45']}
                                                textStyle = {{fontSize: 15}}
                                                onPress = {() => navigation.push('UpdateDetailScreen')}>
                                    Update details
                                </GradientButton>
                                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                                colors = {["red", "maroon"]}
                                                onPress = {logout}
                                                textStyle = {{fontSize: 15}}>
                                    Log Out
                                </GradientButton>
                            </View>
                            <View style = {{alignItems: 'center'}}>
                                <Text style = {{fontSize: 20}}> Name: Dennis Lim nimama </Text>
                                <Text style = {{fontSize: 20}}> UserName: NIMAMA DE </Text>
                                <Text style = {{fontSize: 20}}> DOB: 29/ 10/ 1998 </Text>
                                <Text style = {{fontSize: 20}}> Occupation: Dou Jiang maker </Text>
                            </View>
                            <HostGameItem visible={hostGame} closeHost={() =>setHostGame(false)}/>
                            <GradientButton style={{width: "95%", height:"14%", marginTop: 20, marginLeft: 10}}
                                            colors = {['#1bb479','#026c45']}
                                            onPress={() => setHostGame(true)}
                                            textStyle = {{fontSize: 20}}>
                                Host Game
                            </GradientButton>
                        </View>
                        <View style = {{...style.elevatedComponent, marginTop: 20, height: 200}}>
                            <View style = {style.titleBackground} >
                                <Text style ={style.titleText}>
                                    Upcoming Games
                                </Text>
                            </View>
                        </View>
                        <View style = {{...style.elevatedComponent, marginTop:20, height: 200}}>
                            <View style = {style.titleBackground}>
                                <Text style ={style.titleText}>
                                    Referee applications
                                </Text>
                            </View>
                        </View>
                        <View style = {{...style.elevatedComponent, marginTop:20, height: 200}}>
                            <View style = {style.titleBackground}>
                                <Text style ={style.titleText}>
                                    Upcoming Refereeing Games
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Background>
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: "bold",
    },
    elevatedComponent: {
        width: '90%',
        height: 150,
        elevation: 10,
        backgroundColor: 'white',
        marginTop: 40,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    titleBackground: {
        backgroundColor: 'green',
        height: 40,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    titleText: {
        textDecorationLine: 'underline',
        fontSize: 25,
        marginTop: 2,
        marginLeft: 4,
        fontWeight: '500',
        color: 'white',
    },
    photoFrame: {
        height: 85,
        width: 85,
        borderRadius: 170,
        elevation: 10,
        justifyContent: 'center',
        borderWidth: 2,
        backgroundColor: 'white',
    }

})

export default ProfileScreen;
