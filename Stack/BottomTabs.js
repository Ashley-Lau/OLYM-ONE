import React from 'react';
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ChatScreen from "../../OLYM-ONE/Screens/ChatScreen";
import GameScreen from "../../OLYM-ONE/Screens/GameScreen";
import ProfileScreen from "../../OLYM-ONE/Screens/ProfileScreen";
import RefereeScreen from "../../OLYM-ONE/Screens/RefereeScreen";

const Tab = createMaterialBottomTabNavigator();

const BottomTabs = () => {
    return <Tab.Navigator
        initialRouteName= "ProfileScreen"
        activeColor="#fff"
        inactiveColor="#888888"
        barStyle={{
            backgroundColor: 'rgba(71,51,121,0.76)',
            justifyContent: 'center',
            borderTopWidth: 2,
            elevation: 0,
            borderColor: '#696969',
        }}
    >
        <Tab.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
                tabBarLabel: 'PROFILE',
                tabBarColor: '#026c45',
                tabBarIcon: ({ color }) => (
                    <AntDesign name="user" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen
            name="GameScreen"
            component={GameScreen}
            options={{
                tabBarLabel: 'GAMES',
                tabBarColor: '#7b0303',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="ios-football" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen
            name="RefereeScreen"
            component={RefereeScreen}
            options={{
                tabBarLabel: 'Referee',
                tabBarColor: '#0f2471',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name= "whistle" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{
                tabBarLabel: 'CHATS',
                tabBarColour: 'rgba(71,51,121,0.76)',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="chat" color={color} size={26} />
                ),
            }}
        />
    </Tab.Navigator>
}


export default BottomTabs;