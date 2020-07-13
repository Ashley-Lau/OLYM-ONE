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
import BottomSheet from 'reanimated-bottom-sheet'

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

    //GETTING REFEREE APPLICATIONS AND ITS DETAILS ========================================================================================
    const [appList, setAppList] = useState([]);
    const appRef = firebaseDb.firestore().collection('application_details')
    const [refereeAppVisible, setRefereeAppVisible] = useState(false)
    const refereeRef = useRef(null)
    const refereeRefInner = useRef()

    const renderRefereeButton = (
        <TouchableOpacity style = {style.middleButton} activeOpacity={0.8}
                          onPress = {() => {setRefereeAppVisible(true);
                              refereeRef.current.open()
                              // refereeRefInner.current.snapTo(0)
                          }}>
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
            ?<View>
                <Text style = {style.noApplication}>No Upcoming Games!</Text>
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
    )

    const refereeTab = (
        upcomingRefList.length <= 0
                ?<View>
                    <Text style = {style.noApplication}>No Upcoming Refereeing!</Text>
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
                            <TouchableOpacity style = {style.middleButton} activeOpacity={0.8}>
                                <View style = {{alignItems: 'flex-end', }}>
                                    <View style = {{borderRadius: 60, backgroundColor: 'orange', left: 12, top: 5, zIndex: 1 }}>
                                        <Text style = {{color: 'white', fontWeight: 'bold'}}>
                                            {'  ' + '1' + '  '}
                                        </Text>
                                    </View>

                                    <FontAwesome name="group" color={'#5a5959'} size={50} />
                                </View>
                                <Text style = {{ color: '#5a5959', fontSize: 20, marginTop: 6, textAlign: 'center'}}>
                                    Players
                                </Text>
                            </TouchableOpacity>
                            {/*=======================================referee button===========================================*/}
                            {renderRefereeButton}
                            <RBSheet
                                ref={refereeRef}
                                height={400}
                                minClosingHeight = {100}
                                closeOnDragDown={true}
                                animationType = {'fade'}
                                dragFromTopOnly = {true}
                                customStyles={{
                                    container: {
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderTopRightRadius: 30,
                                        borderTopLeftRadius: 30,
                                    },
                                    // draggableIcon: {
                                    //     backgroundColor: "#000"
                                    // }
                                }}
                            >
                                {/*<Text> donkey </Text>*/}
                                {/*<BottomSheet*/}
                                {/*    ref={refereeRefInner}*/}
                                {/*    overdragResistanceFactor={8}*/}
                                {/*    enabledInnerScrolling={false}*/}
                                {/*    snapPoints={[400, 0]}*/}
                                {/*    renderContent={() => (*/}
                                {/*        <View>*/}
                                {/*            <Text>*/}
                                {/*                donkey*/}
                                {/*            </Text>*/}
                                {/*        </View>)}*/}
                                {/*    // renderHeader={this.renderHeader}*/}
                                {/*    initialSnap={1}*/}
                                {/*    // callbackNode={this.sheetOpenValue}*/}
                                {/*/>*/}
                                    {appList.length <= 0
                                                ?<View>
                                                    <Text style = {style.noApplication}>No Applications!</Text>
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
                            </RBSheet>
                            {/*<Modal*/}
                            {/*    visible={refereeAppVisible}*/}
                            {/*    backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)',position: 'absolute',*/}
                            {/*        bottom:0}}*/}
                            {/*    onBackdropPress={() => setRefereeAppVisible(false)}*/}
                            {/*    style = {{*/}
                            {/*        height: Dimensions.get('window').height * 0.6,*/}
                            {/*        width: Dimensions.get('window').width * 0.8,*/}
                            {/*        backgroundColor: 'white',*/}
                            {/*        alignSelf: 'stretch',*/}
                            {/*        borderRadius: 10*/}
                            {/*        }}*/}
                            {/*>*/}
                            {/*    {appList.length <= 0*/}
                            {/*                ?<View>*/}
                            {/*                    <Text style = {style.noApplication}>No Applications!</Text>*/}
                            {/*                </View>*/}

                            {/*                :*/}
                            {/*                <ScrollView nestedScrollEnabled={true}>*/}
                            {/*                    {appList.map(appl =>*/}
                            {/*                        (*/}
                            {/*                            <RefereeApplicationItem*/}
                            {/*                                              key={appl.key}*/}
                            {/*                                              refDetails={appl.value}*/}
                            {/*                                              appId={appl.key}*/}
                            {/*                                              user={user.id}*/}
                            {/*                            />*/}

                            {/*                        )*/}
                            {/*                    )}*/}
                            {/*                </ScrollView>*/}
                            {/*            }*/}
                            {/*</Modal>*/}
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
        fontSize: 35,
        alignSelf: 'center',
        color: '#5a5959'
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

export default ProfileScreen;
