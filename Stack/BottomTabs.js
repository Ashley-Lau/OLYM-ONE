import React from 'react';
import {Dimensions, StatusBar,} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from "@react-navigation/stack";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeArea } from "react-native-safe-area-context";


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
                <Stack.Screen name = "HomeScreen" component = {HomeScreen} initialParams={{user: props.extraData}}/>
                <Stack.Screen name = "ProfileScreen" component = {ProfileScreen}/>
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
    let gameSize = 22
    let refereeSize = 24

    return <Tab.Navigator
        initialRouteName= "ProfileStack"
        tabBarOptions={{
            activeTintColor: '#ff7134',
            inactiveTintColor: '#8F9BB3',
            keyboardHidesTabBar: true,
            tabStyle: {

            },
            labelStyle:{
                bottom:5,
                labelPosition:"below-icon"
            },
            style : {
                justifyContent:"center",
                height:60 + useSafeArea().bottom,
                borderTopColor: 'transparent',
                shadowColor: 'rgba(58,55,55,0.1)',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 15,
                // elevation: 10,
            }

        }}
    >
        <Tab.Screen
            name="ProfileStack"
            children={ProfileStack}
            options={{
                tabBarLabel: 'HOME',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="home" color={color} size={refereeSize + 2} />
                ),
            }}
        >
            {prop => <ProfileStack {...prop}  extraData = {props.extraData}/>}
        </Tab.Screen>
        <Tab.Screen
            name="GameStack"
            children={GameStack}
            initialParams={{user: props.extraData}}
            options={{
                tabBarLabel: 'GAMES',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="ios-american-football" color={color} size={gameSize} />
                ),
            }}
        >
            {prop => <GameStack {...prop}  extraData = {props.extraData}/>}
        </Tab.Screen>
        <Tab.Screen
            name="RefereeStack"
            children={RefereeStack}
            initialParams={{user: props.extraData}}
            options={{
                tabBarLabel: 'REFEREE',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name= "whistle" color={color} size={refereeSize} style={{bottom:2}}/>
                ),
            }}
        >
            {prop => <RefereeStack {...prop}  extraData = {props.extraData}/>}
        </Tab.Screen>
        <Tab.Screen
            name="ChatStack"
            children={ChatStack}
            options={{
                tabBarLabel: 'CHATS',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="chat" color={color} size={refereeSize} />
                ),
            }}
        >
            {prop => <ChatStack {...prop}  extraData = {props.extraData}/>}
        </Tab.Screen>
    </Tab.Navigator>


}


export default BottomTabs;
