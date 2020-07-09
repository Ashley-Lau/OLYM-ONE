import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    ScrollView,
    Image,
    SafeAreaView,
    ImageBackground,
    TouchableOpacity,
    Button
} from 'react-native';
import {Popover } from '@ui-kitten/components';
import {useNavigation} from "@react-navigation/native";

import firebase from 'firebase';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';


import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import RefereeApplicationItem from "../Components/RefereeApplicationItem";
import firebaseDb from "../firebaseDb";
import GameItem from "../Components/GameItem";
import {keywordsMaker} from "../Components/SearchBarFunctions";


const ProfileScreen = props => {
    const navigation = useNavigation();

    //for logout and change profile picture buttons
    const [color, setColor] = useState('#5a5959')
    const [buttonVisible, setButtonVisible] = React.useState(false);


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
    const [upcomingGameList, setList] = useState([]);
    const [upcomingRefList, setRefList] = useState([]);
    const gameRef = firebaseDb.firestore().collection('game_details')


    useEffect(() => {

        const unsubscribe2 = appRef
            .where("hostId", "==", data.id)
            .onSnapshot( snapshot => {
                    let apps = [];
                    snapshot.forEach(doc => {
                        console.log("application loaded")
                        apps.push({key:doc.id, value:doc.data()});
                    })
                    setAppList(apps);
                },error => {
                    console.log("Upcoming Games " + error.message)
                })


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

        const unsubscribe3 = gameRef
            .where("referee", "array-contains", data.id)
            .onSnapshot(
                snapshot => {
                    let refList = [];
                    snapshot.forEach( doc => {
                        console.log("ref loaded")
                        refList.push({key:doc.id, value:doc.data()});
                    })
                    setRefList(refList);
                }, error => {
            console.log("Refereeing Games " + error.message)
                })



        return () => {
            unsubscribe2();
            unsubscribe();
            unsubscribe3();
        }

    },[])

    const updateUsernameOrUri = (values) => {
        const messageRef = firebaseDb.firestore().collection('messages')
        messageRef
            .where('smallerId', 'array-contains', data.id)
            .get()
            .then(response => {

                let batch = firebaseDb.firestore().batch()
                response.docs.forEach((doc) => {
                    const otherUsername = doc.data().largerId[1]
                    const newKeywords = keywordsMaker([values.username, otherUsername])
                    const docRef = messageRef.doc(doc.id)
                    batch.update(docRef, {smallerId: [data.id, values.username, values.uri], keywords: newKeywords})
                })
                batch.commit().catch(error => console.log(error.message))
            }).catch(error => console.log(error.message))
        messageRef
            .where('largerId', 'array-contains', data.id)
            .get()
            .then(response => {
                let batch = firebaseDb.firestore().batch()
                response.docs.forEach((doc) => {
                    const otherUsername = doc.data().smallerId[1]
                    const newKeywords = keywordsMaker([otherUsername, values.username])
                    const docRef = messageRef.doc(doc.id)
                    batch.update(docRef, {largerId: [data.id, values.username, values.uri], keywords: newKeywords})
                })
                batch.commit().catch(error => console.log(error.message))
            }).catch(error => console.log(error.message))
    }




    //UPDATING USER DATA ================================================================================================
    const handleData = values => {
        if(values.password !== '') {
            firebaseDb.auth().currentUser.updatePassword(values.password).then()
                .catch(error => error)
        }

        //need to update username of chats and hostgame items
        if (values.username !== data.username) {
            updateUsernameOrUri(values)
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
            updateUsernameOrUri(values)
        }

        firebaseDb.firestore().collection('users')
            .doc(data.id).update({
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            uri: values.uri,
            password: values.password !== '' ? values.password : data.password,
        }).then(() => {
            const newData = {
                ...data,
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username,
                uri: values.uri,
                password: values.password !== '' ? values.password : data.password,
            }
            setData(newData)
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
                {text:"Cancel", onPress: () => {setColor('#5a5959')},  style:'cancel'}
            ],
            {cancelable: false}
        )
    }

    const renderToggleButton = () => (
        <TouchableOpacity style = {{backgroundColor: 'transparent', alignItems: 'center'}}
                          activeOpacity= {0.9}
                          onPress={() => {setButtonVisible(true); setColor('white');}}>
            <AntDesign name="caretdown" color={color} size={20} />
        </TouchableOpacity>
    );

    return <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/*============================================== orange thing at the top=========================================*/}
                    <Animatable.View style = {{height: 150, width: '100%', borderBottomLeftRadius: 40}} animation = "fadeInDown">
                        <ImageBackground source={require('../assets/OrangeBackground.jpg')}
                                         style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}
                                         imageStyle={{borderBottomLeftRadius: 40}}
                        >
                            <View style = {{marginTop: -30, height: '100%', justifyContent: 'space-evenly'}}>
                                <View>
                                    <Text style = {{color: 'white', fontWeight: 'bold', fontSize: 30, marginRight: 40}}>
                                        Welcome back,
                                    </Text>
                                    <Text style = {{color: 'white', fontWeight: 'bold', fontSize: 25,}}>
                                        {data.username}!
                                    </Text>
                                </View>
                                <Text style = {{color: 'white', fontWeight: 'bold', fontSize: 15, position: 'absolute', bottom: 0}}>
                                    These are your upcoming events...
                                </Text>
                            </View>
                            <View style = {{flexDirection: 'row', alignItems: 'flex-end'}}>
                            {/*====================================================Profile Picture================================*/}
                                <View style = {{...style.photoFrame, right: 10}}>
                                    <Image style = {{height: 50, width: 50, borderRadius: 170}} source = {{
                                        uri: data.uri
                                    }}/>
                                </View>
                                {/*==========================================Button beside profile picture============================*/}
                                <Popover
                                    backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                                    visible={buttonVisible}
                                    anchor={renderToggleButton}
                                    onBackdropPress={() => {setButtonVisible(false); setColor('#5a5959')}}>
                                    <View style = {{width: 120}}>
                                        <TouchableOpacity style={{...style.buttonStyle, borderBottomColor: 'grey', borderBottomWidth: 1}}
                                                          activeOpacity={0.7}
                                                          onPress = {() => {
                                                              setButtonVisible(false);
                                                              setColor('#5a5959');
                                                              navigation.navigate('UpdateDetailScreen', {data: data, handler: handleData.bind(this)});
                                                          }}
                                        >
                                            <Text style = {{fontWeight: 'bold'}}> Update Profile </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={style.buttonStyle}
                                                          activeOpacity={0.7}
                                                          onPress = {() => {setButtonVisible(false);logout()}}
                                        >
                                            <Text style = {{fontWeight: 'bold'}}> Logout </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Popover>
                            </View>

                        </ImageBackground>
                    </Animatable.View>

                    <View style = {{alignItems: 'center', paddingBottom: 30,}}>
                        <View style = {{...style.elevatedComponent, marginTop: 20, height: 200}}>
                            <View style = {style.titleBackground} >
                                <Text style ={style.titleText}>
                                    Upcoming Games
                                </Text>
                            </View>
                            {upcomingGameList.length <= 0
                                ?<View>
                                    <Text>No Upcoming Games!</Text>
                                </View>

                                :
                                    <ScrollView nestedScrollEnabled={true}>
                                        {upcomingGameList.map(game =>
                                            (
                                                // <UpcomingGameItem key={game.key}
                                                //                   gameDetails={game.value}
                                                //                   gameId={game.key}
                                                //                   user={user.id}
                                                //                   itemType={"Quit"}
                                                // />
                                            <GameItem key={game.key}
                                                              gameDetails={game.value}
                                                              gameId={game.key}
                                                              user={user}
                                                              itemType={"Quit"}
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
                            {appList.length <= 0
                                ?<View>
                                    <Text>No Applications!</Text>
                                </View>

                                :
                                <ScrollView nestedScrollEnabled={true}>
                                    {appList.map(appl =>
                                        (
                                            <RefereeApplicationItem
                                                              key={appl.key}
                                                              refDetails={appl.value}
                                                              appId={appl.key}
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
                                    Upcoming Refereeing Games
                                </Text>
                            </View>
                            {upcomingRefList.length <= 0
                                ?<View>
                                    <Text>No Upcoming Refereeing!</Text>
                                </View>

                                :
                                <ScrollView nestedScrollEnabled={true}>
                                    {upcomingRefList.map(upcoming =>
                                        (
                                            // <UpcomingRefereeItem
                                            //     key={upcoming.key}
                                            //     gameDetails={upcoming.value}
                                            //     gameId={upcoming.key}
                                            //     user={user.id}
                                            // />
                                            <GameItem
                                                key={upcoming.key}
                                                gameDetails={upcoming.value}
                                                gameId={upcoming.key}
                                                user={user}
                                                itemType={"Resign"}
                                            />
                                        )
                                    )}
                                </ScrollView>
                            }
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
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
        backgroundColor: 'orange',
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
        height: 50,
        width: 50,
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
    },
    buttonStyle : {
        backgroundColor: 'white',
        width: '100%',
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default ProfileScreen;
