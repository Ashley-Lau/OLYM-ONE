import React from 'react';

import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ChatScreen from "../../OLYM-ONE/Screens/ChatScreen";
import GameScreen from "../../OLYM-ONE/Screens/GameScreen";
import ProfileScreen from "../../OLYM-ONE/Screens/ProfileScreen";
import RefereeScreen from "../../OLYM-ONE/Screens/RefereeScreen";
import UpdateDetailScreen from "../Screens/UpdateDetailScreen";
import ChatDetailScreen from "../Screens/ChatDetailScreen";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => {
    return  <Stack.Navigator initialRouteName={ProfileScreen} headerMode={false}>
                <Stack.Screen name = "ProfileScreen" component = {ProfileScreen}/>
                <Stack.Screen name = "UpdateDetailScreen" component = {UpdateDetailScreen}/>
            </Stack.Navigator>
}

const ChatStack = () => {
    return  <Stack.Navigator initialRouteName={ChatDetailScreen} headerMode={false}>
                <Stack.Screen name = "ChatDetailScreen" component = {ChatDetailScreen}/>
                <Stack.Screen name = "ChatScreen" component = {ChatScreen}/>
            </Stack.Navigator>
}

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
            name="ProfileStack"
            children={ProfileStack}
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
            name="ChatStack"
            children={ChatStack}
            options={{
                tabBarLabel: 'CHATS',
                tabBarColour: 'rgb(71,51,121)',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="chat" color={color} size={26} />
                ),
            }}
        />
    </Tab.Navigator>


}


export default BottomTabs;
