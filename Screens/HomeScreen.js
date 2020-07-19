import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    ScrollView,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    Animated,

} from 'react-native';
import {Popover} from '@ui-kitten/components';
import {useNavigation} from "@react-navigation/native";

import * as Animatable from 'react-native-animatable';
import {FontAwesome, FontAwesome5, Ionicons, Fontisto, MaterialCommunityIcons} from 'react-native-vector-icons'


import RBSheet from "react-native-raw-bottom-sheet";


import RefereeApplicationItem from "../Components/RefereeApplicationItem";
import firebaseDb from "../firebaseDb";
import GameItem from "../Components/GameItem";
import {keywordsMaker} from "../Components/SearchBarFunctions";
import PlayerApplicationItem from "../Components/PlayerApplicationItem";
import Styles from "../styling/Styles";
import {noApplications, noNotifications, noUpcomingReferee, noUpcomingGame} from "../Components/NoDataMessages";

const sHeight = Dimensions.get('window').height

const HomeScreen = props => {
    const navigation = useNavigation();

    // Animation for the header
    const HEADER_MAX_HEIGHT = 45
    const scrollY = new Animated.Value(0)
    const diffClamp = Animated.diffClamp(scrollY, 0, HEADER_MAX_HEIGHT * 10)
    const headerHeight = diffClamp.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT / 2,HEADER_MAX_HEIGHT],
        outputRange: ['rgba(226,147,73,0)', 'rgba(226,147,73,0.5)' ,'rgba(226,147,73, 1.0)'],
    })

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

    //GETTING UPCOMING GAMES =========================================================================================================
    const [upcomingGameList, setList] = useState([]);
    const [upcomingRefList, setRefList] = useState([]);
    const gameRef = firebaseDb.firestore().collection('game_details')


    useEffect(() => {

        // for player application
        const unsubscribe = appRef
            .where("hostId", "==", data.id)
            .onSnapshot( snapshot => {
                    let apps = [];
                    snapshot.forEach(doc => {
                        apps.push({key:doc.id, value:doc.data()});
                    })
                    setAppList(apps);
                },error => {
                    console.log("Player applications " + error.message)
                })

        // referee applications
        const unsubscribe2 = gameAppRef
            .where("hostId", "==", data.id)
            .onSnapshot(snapshot => {
                let gameApps = [];
                snapshot.forEach(doc => {
                    gameApps.push({key:doc.id, value:doc.data()});
                })
                setGameAppList(gameApps);
            },error => {
                console.log("Referee applications" + error.message)
            })

        // for upcoming games for players
        const unsubscribe3 = gameRef
            .where("players", "array-contains", data.id)
            .orderBy('date', "asc")
            .onSnapshot(
                snapshot => {
                    let gameList = [];
                    snapshot.forEach(doc => {
                        gameList.push({key:doc.id, value:doc.data()});
                    })
                    setList(gameList)
                }, error => {
                    console.log("Upcoming Games " + error.message)
                })

        // for upcoming refereeing games
        const unsubscribe4 = gameRef
            .where("refereeList", "array-contains", data.id)
            .orderBy('date', "asc")
            .onSnapshot(
                snapshot => {
                    let refList = [];
                    snapshot.forEach( doc => {
                        refList.push({key:doc.id, value:doc.data()});
                    })
                    setRefList(refList);
                }, error => {
            console.log("Upcoming refereeing Games " + error.message)
                })

        // for notifications
        const unsubscribe5 = firebaseDb.firestore().collection('notifications')
            .where("playerId", "==", data.id)
            .orderBy('timeStamp', 'desc')
            .onSnapshot(snapshot => {
                let notifications = [];
                snapshot.forEach(doc => {
                    const now = new Date().getTime() / 1000;
                    const data = doc.data()
                    // deleting documents that are read more than 2 days ago ==== prevents overloading of notifications
                    if (data.readTime !== undefined && now - data.readTime > 172800) {
                        doc.ref.delete().then(()=>{});
                    }
                    notifications.push({key: doc.id, value: data});
                })
                setNotificationList(notifications);
            },error => {
                console.log("Notifications" + error.message)
            })

        return () => {
            unsubscribe2();
            unsubscribe();
            unsubscribe3();
            unsubscribe4();
            unsubscribe5();
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
    //for logout and change profile picture buttons ==================================================================
    const [color, setColor] = useState('#5a5959')
    const [buttonVisible, setButtonVisible] = React.useState(false);

    const logout = () => {
        Alert.alert("Confirm Log Out",
            "Do you want to log out?",
            [
                {text:"Cancel", onPress: () => {setColor('#5a5959')}},
                {
                text: "Confirm",
                onPress: () => firebaseDb.auth().signOut()}
            ],
            {cancelable: false}
        )
    }

    const renderToggleButton = () => (
        <TouchableOpacity style = {{backgroundColor: 'transparent', alignItems: 'center', top: 3}}
                          activeOpacity= {0.9}
                          onPress={() => {setButtonVisible(true); setColor('white');}}>
            <Ionicons name = "ios-menu" color={color} size={40} />
        </TouchableOpacity>
    );
    // notifications button ===============================================================================
    const [notificationColor, setNotificationColor] = useState('#5a5959')
    const [notificationButtonVisible, setNotificationButtonVisible] = React.useState(false);
    const [notificationList, setNotificationList] = useState([])

    const displayTime = (timestamp) => {
        const temp = new Date();
        const sgTimestamp = temp.getTime() + (temp.getTimezoneOffset() * 60000) + (3600000*8)
        const sgTime = new Date(sgTimestamp)
        const timestampToDate = timestamp.toDate()
        const timestampDiff = sgTimestamp / 1000  - timestamp.seconds
        const dayDiff = sgTime.getDate() - timestampToDate.getDate()
        if(dayDiff === 0) {
            const time = timestampToDate.toString().slice(16, 21)
            // 24 hours
            const fullHours = parseInt(time.slice(0,2), 10)
            // conversion to 12 hours
            const hours = fullHours > 12 ? fullHours % 12 : fullHours
            const nicerHours = hours === 0 ? '0' + hours : hours
            const suffix = (fullHours >= 12)? ' PM' : ' AM';
            return nicerHours + time.slice(2,5) + suffix
        }
        if(dayDiff === 1 || ((sgTime.getMonth() - timestampToDate.getMonth() === 1) && timestampDiff < 172800)) {
            return "Yesterday"
        }

        return timestampToDate.toLocaleDateString()
    }

    const NotificationComponent = props => (
        <TouchableOpacity style = {{width: '100%', height: 100,
            backgroundColor: props.value.unread ? 'white' : '#e0e0e0',
            flexDirection: 'row', borderBottomWidth: 0.7, borderColor: '#868686'
        }}
                          activeOpacity= {1}
                          onPress = {() => {readNotification(props.id, props.value.unread, props.value.gameId)}}
        >
            <View style = {{width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                {props.value.isPlayer
                        ? <Ionicons name="ios-football" color={color} size={35} />
                        : <MaterialCommunityIcons name= "whistle" color={color} size={35} />}
            </View>
            <View style = {{width: '80%', height: '100%', justifyContent: 'center', paddingRight: 6}}>
                <Text>You have joined the game hosted by {props.value.host} as a {props.value.isPlayer ? 'player' : 'referee'}! Refer to upcoming events for more details.</Text>
                <Text style = {{fontWeight: 'bold'}}>{displayTime(props.value.timeStamp)}</Text>
            </View>
        </TouchableOpacity>
    )

    const readNotification = (notificationId, unread, gameId) => {
        if (unread) {
            firebaseDb.firestore().collection('notifications')
                .doc(notificationId)
                .update({unread: false, readTime: new Date()})
                .then(() => {
                })
                .catch(error => console.log(error))
        }

        // wanted to navigate user to the game details page but cannot be done coze too many nested modals
        // do for extension
        // const upcomingGameItem.filter(doc => doc.key === gameId) ?
    }

    const calcUnreadMessages = () => {
        return notificationList.filter(doc => doc.value.unread).length
    }

    const renderNotificationButton = () => {
        const unreadMessages = calcUnreadMessages()
        return (
        <TouchableOpacity style={{backgroundColor: 'transparent', alignItems: 'center'}}
                          activeOpacity={0.9}
                          onPress={() => {
                              setNotificationButtonVisible(true);
                              setNotificationColor('white');
                          }}>
            {unreadMessages === 0 ?
                <Text style={{color: 'transparent', fontWeight: 'bold', fontSize: 10, position: 'absolute'}}>
                    {'  ' + 1 + '  '}
                </Text>
                :
                <View style={{
                    borderRadius: 60,
                    backgroundColor: 'red',
                    zIndex: 1,
                    position: 'absolute',
                    right: -5,
                    top: -4
                }}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 10,}}>
                        {'  ' + unreadMessages + '  '}
                    </Text>
                </View>}
            <Fontisto name='bell' size={30} color={notificationColor}/>
        </TouchableOpacity>
        )};

    // for game and referee tab =======================================================================
    const [isGameTab, setIsGameTab] = useState('true')

    const changeTab = (gameTab) => {
        if (gameTab === isGameTab) {
            return;
        }
        setIsGameTab(!isGameTab)
    }

    const gameTab = (
        upcomingGameList.length <= 0
            ? noUpcomingGame
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
                ? noUpcomingReferee
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

    return  (
        <View>
            <Animated.View style = {{
                ...Styles.animatedHeaderStyle,
                backgroundColor: headerHeight,
                height: Styles.statusBarHeight.height
            }}>
            </Animated.View>
            <ScrollView showsVerticalScrollIndicator={false}
                        bounces = {false}
                        style = {{height: '100%', }}
                        onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: scrollY}}}]
                        )}
                        scrollEventThrottle={16}>
                <ImageBackground source={require('../assets/whiteBackground.jpg')}
                                         style = {{flex: 1}}>
                    {/*============================================== orange thing at the top=========================================*/}
                    <Animatable.View style = {style.orangeImageContainer} animation = "fadeInDown">
                        <ImageBackground source={require('../assets/OrangeBackground.jpg')}
                                         style = {style.orangeImage}
                                         imageStyle={{borderBottomLeftRadius: 40,}}
                        >
                            <View style = {{marginTop: -30, height: '100%', justifyContent: 'space-evenly', width: '65%', left: 15}}>
                                <View>
                                    <Text style = {{color: 'white', fontWeight: 'bold', fontSize: 30, }}>
                                        Welcome back,
                                    </Text>
                                    <Text style = {{color: 'white', fontWeight: 'bold', fontSize: 25,}}>
                                        {data.username}!
                                    </Text>
                                </View>
                                <Text style = {{color: 'white', fontWeight: 'bold', fontSize: 15, position: 'absolute', bottom: 0}}>
                                    Your upcoming events...
                                </Text>
                            </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '35%', right: 15, top: 10}}>
                                {/*===notifications button when player is accepted into a game or referee game====*/}
                                <Popover
                                    backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                                    visible={notificationButtonVisible}
                                    anchor={renderNotificationButton}
                                    onBackdropPress={() => {setNotificationButtonVisible(false); setNotificationColor('#5a5959')}}>
                                    <View style = {{width: Dimensions.get('window').width * 0.65, height: sHeight * 0.6, backgroundColor: '#eeecec' }}>
                                        <View style = {{borderBottomWidth: 0.7, borderColor: '#3b3b3b',}}>
                                            <Text style = {{textAlign: 'center', color: '#3b3b3b', fontWeight: 'bold', fontSize: 27, paddingBottom: 10}}>
                                                Notifications
                                            </Text>
                                        </View>
                                        {notificationList.length === 0? noNotifications
                                        :<ScrollView nestedScrollEnabled={true}>
                                            {notificationList.map(doc =>
                                                (
                                                    <NotificationComponent
                                                        id = {doc.key}
                                                        value = {doc.value}
                                                    />

                                                )
                                            )}
                                        </ScrollView>}
                                    </View>
                                </Popover>
                                {/*====================================================Profile Picture================================*/}
                                <View style = {{...style.photoFrame, }}>
                                    <Image style = {{height: 50, width: 50, borderRadius: 170}} source = {{
                                        uri: data.uri
                                    }}/>
                                </View>

                                {/*==========================================Button on the right of profile picture============================*/}
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
                                            <Text style = {{fontWeight: 'bold'}}> Profile </Text>
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
                                    <ScrollView nestedScrollEnabled={true} style ={{flex: 1}}>
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
        </View>
    )}

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
        height: 150 + Styles.statusBarHeight.height,
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
