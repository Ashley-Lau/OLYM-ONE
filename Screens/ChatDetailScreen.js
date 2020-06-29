import React, {useState, useEffect}from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    FlatList,
    SafeAreaView
} from 'react-native'

import {useNavigation} from "@react-navigation/native";

import SearchButtons from "../Components/SearchButtons";
import firebaseDb from "../firebaseDb";
import {messageSorter} from "../Components/SearchBarFunctions";

const ChatDetailScreen = (props) => {
    const navigation = useNavigation()
    const userId = props.route.params.user.id
    const userData = {username: 'donkey', uri: 'fker'}
    const messagesRef = firebaseDb.firestore().collection('messages')


    const [chatList, setChatList] = useState([])
    const [tempChatList, setTempChatList] = useState([])
    const [keywords, setKeywords] = useState('')

    useEffect(() => {
        const unsubscribe = messagesRef
                                .where('messageCount', '==', 1)
                                .where('idArray', 'array-contains', userId)
                                .orderBy('lastMessageTime', 'desc')
                                .limit(10)
                                .onSnapshot(
                                    querySnapshot => {
                                        const newChat= []
                                        querySnapshot.forEach(doc => {
                                            newChat.push({key: doc.id, value: doc.data(),})
                                        });
                                        setChatList(newChat)
                                        setTempChatList(newChat)
                                    },
                                    error => {
                                        console.log(error)
                                    }
                                )
        return () => unsubscribe()
    }, [])

    // function to calculate the time to display in each flatlist / chat component
    const displayTime = (timestamp) => {
        if (timestamp === '') {
            return ''
        }
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
        if(timestampDiff < 604800) {
            return timestampToDate.toString().slice(0, 3)
        }
        return timestampToDate.toLocaleDateString()
    }

    //function to get the keywords pertaining to the items from firebase in order of the lastest message time
    const getKeywordsChatList = () => {
        if (keywords === '' ) {
            setChatList(tempChatList)
            return;
        }

        messagesRef
            .where('smallId', '==', userId)
            .where('keywords', 'array-contains', keywords)
            .orderBy('lastMessageTime', 'desc')
            .get()
            .then(
                documents => {
                    const newChat= []
                    documents.forEach(doc => {
                        newChat.push({key: doc.id, value: doc.data()})
                    });
                    messagesRef
                        .where('largeId', '==', userId)
                        .where('keywords', 'array-contains', keywords)
                        .orderBy('lastMessageTime', 'desc')
                        .get()
                        .then(
                            documents => {
                                const newChat2 = []
                                documents.forEach(doc => {
                                    newChat2.push({key: doc.id, value: doc.data()})
                                });
                                setChatList(messageSorter(newChat, newChat2))
                            })
                        .catch(error => console.log(error))
                })
            .catch(error => console.log(error))
    }
    return <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
                <SafeAreaView style = {{backgroundColor: '#fafafa'}}>
                <View style = {{justifyContent: 'center',height: 50, width: '100%', backgroundColor: '#fafafa'}}>
                    <Text style = {style.text}> Chats</Text>
                </View>
                <View style={{...style.searchBar, }}>
                    <View style = {{left: 10, width: '5%'}}>
                    <SearchButtons style={{flex: 1, elevation: 5}}
                                   searchMe={() => {
                                       Keyboard.dismiss()
                                       getKeywordsChatList()
                                   }}/>
                    </View>
                    <TextInput style={{...style.searchInput, }}
                               placeholder= "Username, Group"
                               placeholderTextColor="#414141"
                               onChangeText={(value) => {setKeywords(value.toLowerCase())}}
                               value={keywords}
                    />
                </View>
                <FlatList
                    contentContainerStyle={{width: '100%', height: '100%',borderTopWidth: 0.3, borderColor: 'grey', backgroundColor: 'white'}}
                    keyExtractor={(item) => item.key.toString()}
                    data={chatList}
                    renderItem={({item}) =>
                        <TouchableOpacity style = {{alignItems: 'center', width: '100%', height: 75, flexDirection: 'row',}}
                                          activeOpacity = {0.85}
                                          onPress={() => navigation.navigate('ChatScreen', {chat: item.value, userId: userId})}>
                            {/*========================================image of the other user===========================================*/}
                            <View style = {{width: '20%'}}>
                                <Image source = {{uri: item.value.smallerId[0] === userId ? item.value.largerId[2] : item.value.smallerId[2]}}
                                       style = {style.image}/>
                            </View>

                            <View style = {{alignItems: 'center', width: '80%', height: 75, flexDirection: 'row', borderBottomWidth: 0.3, borderColor: 'grey',justifyContent: 'space-between',}}>
                                {/*=======================================Name and last message============================================*/}
                                <View style = {{flexDirection: 'column',}}>
                                    <Text style = {{fontSize: 20, fontWeight: 'bold'}}>
                                        {item.value.smallerId[0] === userId ? item.value.largerId[1] : item.value.smallerId[1]}
                                    </Text>
                                    <Text style = {{fontSize: 15,}}>
                                        {item.value.lastMessage.toString().length > 20
                                            ? item.value.lastMessage.slice(0,19) + '...'
                                            : item.value.lastMessage.toString().length === 0
                                                ? ''
                                                : item.value.lastMessage.slice(0,19)
                                        }
                                    </Text>
                                </View>
                                {/*======================================unread messages and time============================================*/}
                                <View style = {{color: 'black', justifyContent: 'center', marginRight: 9, alignItems: 'flex-end'}}>
                                    <Text style = {{fontSize: 16}}>{displayTime(item.value.lastMessageTime)}</Text>
                                    {item.value.lastMessageFrom === userId || item.value.notificationStack === 0
                                        ? <View>
                                            <Text style = {{color: 'white', borderRadius: 60}}> </Text>
                                            </View>
                                        : <View style = {{borderRadius: 60, backgroundColor: '#1F45FC'}}>
                                            <Text style = {{color: 'white', fontWeight: 'bold'}}>
                                                  {'  ' + item.value.notificationStack + '  '}
                                            </Text>
                                            </View>
                                    }
                                </View>
                            </View>

                        </TouchableOpacity>}
                />
            </SafeAreaView>
            </TouchableWithoutFeedback>
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection:"column"
    },
    text: {
        top: 10,
        color: '#232323',
        justifyContent: 'center',
        fontSize: 27,
        fontWeight: "bold",
        marginLeft: 4
    },
    searchBar:{
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center",
        borderRadius:4,
        width:'96%',
        height: 40,
        marginTop:10,
        marginBottom:10,
        alignSelf: 'center',
        backgroundColor: '#E5E4E2',
    },
    searchInput:{
        width:"95%",
        height:45,
        fontSize:17,
        marginLeft: 13,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 120,
        marginLeft: 12,
        borderWidth: 0.5,
        borderColor: 'grey'
    }
})

export default ChatDetailScreen;