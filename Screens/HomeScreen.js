import React, {useState, useEffect, useRef} from 'react';
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
    Dimensions,

} from 'react-native';
import {Popover, Modal} from '@ui-kitten/components';
import {useNavigation} from "@react-navigation/native";

import firebase from 'firebase';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import RBSheet from "react-native-raw-bottom-sheet";


import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import RefereeApplicationItem from "../Components/RefereeApplicationItem";
import firebaseDb from "../firebaseDb";
import GameItem from "../Components/GameItem";
import {keywordsMaker} from "../Components/SearchBarFunctions";
import PlayerApplicationItem from "../Components/PlayerApplicationItem";


const HomeScreen = props => {
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

    //GETTING PLAYER APPLICATION AND THEIR DETAILS ==========================================================================
    const [gameAppList, setGameAppList] = useState([]);
    const gameAppRef = firebaseDb.firestore().collection('player_application_details');
    const playerRef = useRef (null);

    const renderPlayerButton = (
        <TouchableOpacity style = {style.middleButton} activeOpacity={0.8}
                          onPress={()=>playerRef.current.open()}>
            <View style = {{alignItems: 'flex-end', }}>
                {gameAppList.length === 0 ?
                    <Text style = {{color: 'transparent', fontWeight: 'bold'}}>
                        {'  ' + 1 + '  '}
                    </Text>
                    :
                    <View style = {{borderRadius: 60, backgroundColor: 'orange',left: 10, top: 5, zIndex: 1 }}>
                        <Text style = {{color: 'white', fontWeight: 'bold'}}>
                            {'  ' + gameAppList.length + '  '}
                        </Text>
                    </View>}
                <FontAwesome name="group" color={'#5a5959'} size={50} />
            </View>
            <Text style = {{ color: '#5a5959', fontSize: 20, marginTop: 6, textAlign: 'center'}}>
                Players
            </Text>
        </TouchableOpacity>
    )

    //GETTING REFEREE APPLICATIONS AND ITS DETAILS ========================================================================================
    const [appList, setAppList] = useState([]);
    const appRef = firebaseDb.firestore().collection('application_details')
    const refereeRef = useRef(null)

    const renderRefereeButton = (
        <TouchableOpacity style = {style.middleButton} activeOpacity={0.8}
                          onPress = {() => refereeRef.current.open()}>
            <View style = {{alignItems: 'flex-end', }}>
                {appList.length === 0 ?
                        <Text style = {{color: 'transparent', fontWeight: 'bold'}}>
                            {'  ' + 1 + '  '}
                        </Text>
                    :   <View style = {{borderRadius: 60, backgroundColor: 'orange',top: 5, zIndex: 1 }}>
                            <Text style = {{color: 'white', fontWeight: 'bold'}}>
                                {'  ' + appList.length + '  '}
                            </Text>
                        </View>}
                <FontAwesome5  name="file-signature" color={'#5a5959'} size={50} style = {{left: 7}}/>
            </View>
            <Text style = {{ color: '#5a5959', fontSize: 20, marginTop: 6, textAlign: 'center'}}>
                Referees
            </Text>
        </TouchableOpacity>
    )

    const noApplications = (
        <View style = {{alignItems: 'center', top: Dimensions.get('window').height * 0.15}}>
            <FontAwesome name = 'linux' size={100} color={'#5c5c5c'}/>
            <Text style = {style.noApplication}>No Applications!</Text>
        </View>
    )

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
            .where("refereeList", "array-contains", data.id)
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

        const unsubscribe4 = gameAppRef
            .where("hostId", "==", data.id)
            .onSnapshot(snapshot => {
                let gameApps = [];
                snapshot.forEach(doc => {
                    console.log("Game application loaded")
                    gameApps.push({key:doc.id, value:doc.data()});
                })
                setGameAppList(gameApps);
            },error => {
                console.log("Upcoming Games " + error.message)
            })



        return () => {
            unsubscribe2();
            unsubscribe();
            unsubscribe3();
            unsubscribe4();
        }

    },[])

    // updating of user or uri in firebase after updating of profile=======================
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

    // for game and referee tab =========================================================
    const [isGameTab, setIsGameTab] = useState('true')

    const changeTab = (gameTab) => {
        if (gameTab === isGameTab) {
            return;
        }
        setIsGameTab(!isGameTab)
    }

    const gameTab = (
        upcomingGameList.length <= 0
            ?<View style = {{justifyContent: 'center', alignItems: 'center', flex: 1, bottom: 10}}>
                <FontAwesome name = 'soccer-ball-o' size={100} color={'#5c5c5c'}/>
                <Text style = {{...style.noApplication, fontSize: 25, color: 'black'}}>No Upcoming Games</Text>
                <Text style = {{...style.noApplication, fontSize: 15}}>Search for games to play in games tab!</Text>
            </View>

            :
            <ScrollView nestedScrollEnabled={true}>
                {upcomingGameList.map(game =>
                    (

                        <GameItem key={game.key}
                                  gameDetails={game.value}
                                  gameId={game.key}
                                  user={user}
                                  itemType={"Quit"}
                        />
                    )
                )}
            </ScrollView>
    )

    const refereeTab = (
        upcomingRefList.length <= 0
                ?<View style = {{justifyContent: 'center', alignItems: 'center', flex: 1, bottom: 10}}>
                    <FontAwesome name = 'optin-monster' size={100} color={'#5c5c5c'}/>
                    <Text style = {{...style.noApplication, fontSize: 25, color: 'black'}}>No Games to Referee</Text>
                    <Text style = {{...style.noApplication, fontSize: 15}}>Search for games to referee in referee tab!</Text>
                </View>
                :
                <ScrollView nestedScrollEnabled={true}>
                    {upcomingRefList.map(upcoming =>
                        (

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
    )

    return <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ImageBackground source={require('../assets/whiteBackground.jpg')}
                                     style = {{flex: 1}}
                                     // imageStyle={{borderBottomLeftRadius: 40,}}
                    >
                    {/*============================================== orange thing at the top=========================================*/}
                    <Animatable.View style = {style.orangeImageContainer} animation = "fadeInDown">
                        <ImageBackground source={require('../assets/OrangeBackground.jpg')}
                                         style = {style.orangeImage}
                                         imageStyle={{borderBottomLeftRadius: 40,}}
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
                                        <TouchableOpacity style={{...style.logoutButtonStyle, borderBottomColor: 'grey', borderBottomWidth: 1}}
                                                          activeOpacity={0.7}
                                                          onPress = {() => {
                                                              setButtonVisible(false);
                                                              setColor('#5a5959');
                                                              navigation.navigate('UpdateDetailScreen', {data: data, handler: handleData.bind(this)});
                                                          }}
                                        >
                                            <Text style = {{fontWeight: 'bold'}}> Update Profile </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={style.logoutButtonStyle}
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
                    <View style = {{width: '90%', alignSelf: 'center', marginTop: 20}}>
                        <Text style = {{color: '#3b3b3b', fontWeight: 'bold', fontSize: 30}}>
                            Applications
                        </Text>
                    {/*====================================================Player and Referee buttons===================================*/}
                        <View style = {{height: 130, width: '100%',marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', }}>
                            {/*=========================================player button=========================================*/}
                            {/*=======================================functionalities not inputted yet=================================*/}
                            {renderPlayerButton}
                            <RBSheet
                                ref={playerRef}
                                height={Dimensions.get("window").height * 0.7}
                                closeOnDragDown={true}
                                animationType = {'fade'}
                                dragFromTopOnly = {true}
                                customStyles={{
                                    container: {
                                        alignItems: "center",
                                        borderTopRightRadius: 30,
                                        borderTopLeftRadius: 30,
                                    },
                                    draggableIcon: {
                                        width: 60,
                                    }
                                }}
                            >
                                {gameAppList.length <= 0
                                    ? noApplications
                                    :
                                    <ScrollView nestedScrollEnabled={true}>
                                        {gameAppList.map(appl =>
                                            (
                                                <PlayerApplicationItem
                                                    key={appl.key}
                                                    playerDetails={appl.value}
                                                    appId={appl.key}
                                                    user={user.id}
                                                />

                                            )
                                        )}
                                    </ScrollView>
                                }
                            </RBSheet>
                            {/*=======================================referee button===========================================*/}
                            {renderRefereeButton}
                            <RBSheet
                                ref={refereeRef}
                                height={Dimensions.get("window").height * 0.7}
                                closeOnDragDown={true}
                                animationType = {'fade'}
                                dragFromTopOnly = {true}
                                customStyles={{
                                    container: {
                                        alignItems: "center",
                                        borderTopRightRadius: 30,
                                        borderTopLeftRadius: 30,
                                    },
                                    draggableIcon: {
                                        width: 60,
                                    }
                                }}
                            >
                                    {appList.length <= 0
                                                ? noApplications
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
                            </RBSheet>

                        </View>
                    </View>
                        {/*========================================Bottom Section==================================================*/}
                    <View style = {{width: '90%', alignSelf: 'center', marginTop: 30, marginBottom: 30, }}>
                        <Text style = {{color: '#3b3b3b', fontWeight: 'bold', fontSize: 30,}}>
                            Upcoming Events
                        </Text>
                        <View style = {style.tabContainer}>
                            <View style = {{height: '15%', flexDirection: 'row', backgroundColor: 'transparent', marginTop: 10, }}>
                                <TouchableOpacity style = {{height: '100%', width: '50%',
                                                            backgroundColor: isGameTab ? 'white' : '#cbcbcb',
                                                            justifyContent: 'center',
                                                            borderTopWidth: isGameTab ? 2 : 0,
                                                            borderColor: 'orange',
                                }}
                                                  activeOpacity={1}
                                                  onPress={() => changeTab(true)}
                                >
                                    <Text style = {{ color: isGameTab ? '#FF8C00' : '#5a5959', fontSize: 20, textAlign: 'center'}}>
                                        Games
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style = {{height: '100%', width: '50%',
                                                            backgroundColor: isGameTab ? '#cbcbcb' : 'white',
                                                            justifyContent: 'center',
                                                            borderTopWidth: isGameTab ? 0 : 2,
                                                            borderColor: 'orange',
                                }}
                                                  activeOpacity={1}
                                                  onPress={() => changeTab(false)}
                                >
                                    <Text style = {{ color: isGameTab ? '#5a5a59' : '#FF8C00', fontSize: 20, textAlign: 'center'}}>
                                        Referee
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style = {{width: '100%', height: '85%', backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                                {isGameTab ? gameTab : refereeTab}
                            </View>
                        </View>

                    </View>
                    </ImageBackground>
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
    logoutButtonStyle : {
        backgroundColor: 'white',
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    orangeImageContainer: {
        height: 150,
        width: '100%',
        borderBottomLeftRadius: 40,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    orangeImage: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    noApplication: {
        fontSize: 33,
        alignSelf: 'center',
        color: '#5a5959',
        top: 20,
        textAlign:'center'
    },
    middleButton: {
        height: '100%',
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.27,
    },
    tabContainer: {
        height: 300,
        elevation: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.27, }
})

export default HomeScreen;
