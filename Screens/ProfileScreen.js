import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    ScrollView,
    Image,
    Button,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import firebase from 'firebase';

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import HostGameItem from "../Components/HostGameItem";
import UpcomingGameItem from "../Components/UpcomingGameItem";
import RefereeApplicationItem from "../Components/RefereeApplicationItem";
import firebaseDb from "../firebaseDb";
import GameItem from "../Components/GameItem";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const ProfileScreen = props => {
    const navigation = useNavigation();


    // GETTING USER DATA ================================================================================================
    const user = props.route.params.user
    const [data, setData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: user.password,
        birthDate: user.birthDate,
        email: user.email,
        id: user.id,
        uri: user.uri,
        upcoming_games: user.upcoming_games,
        referee: user.referee
    })

    //GETTING REFEREE APPLICATIONS ========================================================================================
    const [appList, setAppList] = useState([]);
    const appRef = firebaseDb.firestore().collection('application_details')

    //GETTING UPCOMING GAMES =========================================================================================================
    const [upcomingGameList, setList] = useState([])
    const gameRef = firebaseDb.firestore().collection('game_details')


    useEffect(() => {
        const unsubscribe = gameRef
            .where("players", "array-contains", data.id)
            .onSnapshot(
                snapshot => {
                    let gameList = [];
                    snapshot.forEach(doc => {
                        console.log("upcoming loaded")
                        gameList.push({key:doc.id, value:doc.data()});
                    })
                    setList(gameList)
                }, error => {
                    console.log("Upcoming Games " + error.message)
                })

        const unsubscribe2 = appRef
            .where("hostId", "==", data.id)
            .onSnapshot(
                snapshot => {
                    let apps = [];
                    snapshot.forEach(doc => {
                        apps.push({key:doc.id, value:doc.data()});
                    })
                    setAppList(apps);
                },error => {
                    console.log("Upcoming Games " + error.message)
                })

        return () => {
            unsubscribe();
            unsubscribe2();
        }

    },[])

    const updateUserNameOrUri = (values) => {
        const messageRef = firebaseDb.firestore().collection('messages')
        messageRef
            .where('smallerId', 'array-contains', data.id)
            .get()
            .then(response => {
                let batch = firebaseDb.firestore().batch()
                response.docs.forEach((doc) => {
                    const docRef = messageRef.doc(doc.id)
                    batch.update(docRef, {smallerId: [data.id, values.username, values.uri]})
                })
                batch.commit().catch(error => console.log(error.message))
            }).catch(error => console.log(error.message))
        messageRef
            .where('largerId', 'array-contains', data.id)
            .get()
            .then(response => {
                let batch = firebaseDb.firestore().batch()
                response.docs.forEach((doc) => {
                    const docRef = messageRef.doc(doc.id)
                    batch.update(docRef, {largerId: [data.id, values.username, values.uri]})
                })
                batch.commit().catch(error => console.log(error.message))
            }).catch(error => console.log(error.message))
    }



    //MODAL STATES =======================================================================================================
    const[hostGame, setHostGame] = useState(false);

    //UPDATING USER DATA ================================================================================================
    const handleData = values => {
        if(values.password !== '') {
            firebaseDb.auth().currentUser.updatePassword(values.password).then()
                .catch(error => error)
        }

        //need to update username of chats and hostgame items
        if (values.username !== data.username) {
            updateUserNameOrUri(values)
            const gameRef = firebaseDb.firestore().collection('game_details')
            gameRef
                .where('hostId','==', data.id)
                .get()
                .then(response => {
                    let batch = firebaseDb.firestore().batch()
                    response.docs.forEach((doc) => {
                        const docRef = gameRef.doc(doc.id)
                        batch.update(docRef, {host: values.username})
                    })
                    batch.commit().catch(error => console.log(error))
                })
                .catch(error => console.log(error))
        }

        // update only the image uri of chats
        if (values.username === data.username && data.uri !== values.uri) {
            updateUserNameOrUri(values)
        }

        firebaseDb.firestore().collection('users')
            .doc(data.id).update({
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            uri: values.uri,
            password: values.password !== '' ? values.password : data.password,
            referee: values.referee,
        }).then(() => {
            setData({
                ...data,
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username,
                uri: values.uri,
                password: values.password !== '' ? values.password : data.password,
                referee: values.referee,
            })
        }).catch(error => {
            console.log(error)
            alert(error)
        })
    }


    //LOG OUT FUNCTION ================================================================================================
    const logout = () => {
        Alert.alert("Confirm Log Out",
            "Do you want to log out?",
            [{
                text: "Yes",
                onPress: () => firebaseDb.auth().signOut(),
                style: 'cancel'
            },
                {text:"Cancel", onPress: () => {},  style:'cancel'}
            ],
            {cancelable: false}
        )
    }

    return <Background>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style = {{alignItems: 'center', paddingBottom: 30,}}>
                        <View style = {{...style.elevatedComponent, height: 300, justifyContent: 'space-evenly'}}>

                            <View style = {{flexDirection: 'row', justifyContent: 'space-around', paddingTop: 5,}}>
                                <View style = {style.photoFrame}>
                                    <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {{
                                        uri: data.uri
                                    }}/>
                                </View>
                                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                                colors = {['#1bb479','#026c45']}
                                                textStyle = {{fontSize: 15}}
                                                onPress = {() => navigation.navigate('UpdateDetailScreen', {data: data, handler: handleData.bind(this)})}>
                                    Update details
                                </GradientButton>
                                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                                colors = {["red", "maroon"]}
                                                onPress = {logout}
                                                textStyle = {{fontSize: 15}}>
                                    Log Out
                                </GradientButton>
                            </View>

                            <View style = {{paddingLeft: 30, marginTop: 10}}>
                                <Text style = {{fontSize: 20}}> Name: {data.firstName} {data.lastName}</Text>
                                <Text style = {{fontSize: 20}}> Username: {data.username} </Text>
                                <Text style = {{fontSize: 20}}> Email: {data.email}</Text>
                                <Text style = {{fontSize: 20}}> DOB: {data.birthDate.toDate().toString().slice(4,15)}</Text>
                            </View>

                            <GradientButton style={{width: "95%", height:"14%", marginTop: 15, alignSelf: 'center'}}
                                            colors = {['#1bb479','#026c45']}
                                            onPress={() => {
                                                console.log(appList);
                                                navigation.navigate('HostGameItem',
                                                    {
                                                        uid: data.id,
                                                        username: data.username,
                                                        upcoming: data.upcoming_games
                                                    }


                                                )}}
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
                            {data.upcoming_games.length <= 0
                                ?<View>
                                    <Text>No Upcoming Games!</Text>
                                </View>

                                :
                                    <ScrollView nestedScrollEnabled={true}>
                                        {upcomingGameList.map(game =>
                                            (
                                                <UpcomingGameItem key={game.key}
                                                                  gameDetails={game.value}
                                                                  gameId={game.key}
                                                                  user={user.id}
                                                />
                                            )
                                        )}
                                    </ScrollView>
                            }

                        </View>
                        <View style = {{...style.elevatedComponent, marginTop:20, height: 200}}>
                            <View style = {style.titleBackground}>
                                <Text style ={style.titleText}>
                                    Referee applications
                                </Text>
                            </View>
                            <View>
                                {appList.length <= 0
                                    ?<View>
                                        <Text>No Applications!</Text>
                                    </View>

                                    :
                                    <ScrollView nestedScrollEnabled={true}>
                                        {appList.map(app =>
                                            (
                                                <RefereeApplicationItem
                                                                  key={app.key}
                                                                  gameDetails={app.value}
                                                                  gameId={app.key}
                                                                  user={user.id}
                                                />
                                            )
                                        )}
                                    </ScrollView>
                                }
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
        elevation: 30,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.34,
        shadowRadius: 3.27,
        justifyContent: 'center',
        backgroundColor: 'white',
    }
})

export default ProfileScreen;
