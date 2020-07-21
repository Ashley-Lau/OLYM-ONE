import React from 'react';
import {Dimensions, StatusBar,} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from "@react-navigation/stack";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


import GameScreen from "../../OLYM-ONE/Screens/GameScreen";
import HomeScreen from "../Screens/HomeScreen";
import RefereeScreen from "../../OLYM-ONE/Screens/RefereeScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import ChatDetailScreen from "../Screens/ChatDetailScreen";
import HostGameScreen from "../Screens/HostGameScreen";
import GameDetailsModal from "../Components/GameDetailsModal";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = (props) => {
    return  <Stack.Navigator headerMode={false}>
                <Stack.Screen name = "ProfileScreen" component = {HomeScreen} initialParams={{user: props.extraData}}/>
                <Stack.Screen name ="GameDetailsModal" component = {GameDetailsModal}/>

            </Stack.Navigator>
}

const GameStack = (props) => {
    return  <Stack.Navigator headerMode={false}>
        <Stack.Screen name = "GameScreen" component = {GameScreen} initialParams={{user: props.extraData}}/>
        <Stack.Screen name = "HostGameScreen" component = {HostGameScreen}/>
        <Stack.Screen name = "GameDetailsModal" component = {GameDetailsModal}/>
    </Stack.Navigator>
}

const RefereeStack = (props) => {
    return  <Stack.Navigator initialRouteName={RefereeScreen} headerMode={false}>
        <Stack.Screen name = "RefereeScreen" component = {RefereeScreen} initialParams={{user: props.extraData}}/>
        <Stack.Screen name = "GameDetailsModal" component ={GameDetailsModal}/>
    </Stack.Navigator>
}

const ChatStack = (props) => {
    return  <Stack.Navigator initialRouteName={ChatDetailScreen} headerMode={false}>
                <Stack.Screen name = "ChatDetailScreen" component = {ChatDetailScreen} initialParams={{user: props.extraData}}/>
            </Stack.Navigator>
}



const BottomTabs = (props) => {
    // if (Platform.OS === "android") {
    //     StatusBar.setBackgroundColor("rgba(0,0,0,0)");
    //     StatusBar.setBarStyle("dark-content");
    //     StatusBar.setTranslucent(true);
    // }
    return <Tab.Navigator
        initialRouteName= "ProfileStack"
        activeColor="#fff"
        inactiveColor="#888888"
        tabBarOptions={{
            activeTintColor: '#ff7134',
            keyboardHidesTabBar: true,
            tabStyle: {
                paddingTop: 7,
                paddingBottom: 5,
            },
            style : {
                height: Dimensions.get('window').height * 0.09,
                borderTopColor: 'transparent',
                shadowColor: 'rgba(58,55,55,0.1)',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 15,
                elevation: 10,
            }

        }}
    >
        <Tab.Screen
            name="ProfileStack"
            children={ProfileStack}
            options={{
                tabBarLabel: 'HOME',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
            }}
        >
            {prop => <ProfileStack {...prop}  extraData = {props.extraData}/>}
        </Tab.Screen>
        <Tab.Screen
            name="GameScreen"
            children={GameStack}
            initialParams={{user: props.extraData}}
            options={{
                tabBarLabel: 'GAMES',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="ios-football" color={color} size={26} />
                ),
            }}
        >
            {prop => <GameStack {...prop}  extraData = {props.extraData}/>}
        </Tab.Screen>
        <Tab.Screen
            name="RefereeScreen"
            children={RefereeStack}
            initialParams={{user: props.extraData}}
            options={{
                tabBarLabel: 'REFEREE',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name= "whistle" color={color} size={26} />
                ),
            }}
        />
            {prop => <RefereeStack {...prop}  extraData = {props.extraData}/>}
        <Tab.Screen
            name="ChatStack"
            children={ChatStack}
            options={{
                tabBarLabel: 'CHATS',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="chat" color={color} size={26} />
                ),
            }}
        >
            {prop => <ChatStack {...prop}  extraData = {props.extraData}/>}
        </Tab.Screen>
    </Tab.Navigator>


}


export default BottomTabs;
