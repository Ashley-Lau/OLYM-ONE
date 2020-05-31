import React from 'react';

import LoginScreen from "./Screens/LoginScreen";
import BottomTabs from "./Components/BottomTabs";
import SignupScreen from "./Screens/SignupScreen";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return <NavigationContainer>
    <Stack.Navigator initialRouteName = "LoginScreen" headerMode = {false} >
      <Stack.Screen name = 'LoginScreen' component = {LoginScreen}/>
      <Stack.Screen name = 'BottomTabs' component = {BottomTabs}/>
      <Stack.Screen name = 'SignupScreen' component = {SignupScreen}/>
    </Stack.Navigator>
  </NavigationContainer>
}
