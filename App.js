import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

import LoginScreen from "./Screens/LoginScreen";
import BottomTabs from "./Components/BottomTabs";
import SignupScreen from "./Screens/SignupScreen";

import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import AnimatedSplash from "react-native-animated-splash-screen";


const Stack = createStackNavigator();

export default function App() {
  const [data, setData] = useState({
    loading: false
  })

  useEffect(() => {
    setTimeout(() => setData({loading: true}), 1000)
  })

  return (
      <AnimatedSplash
          translucent={false}
          isLoaded={data.loading}
          logoImage={require("./assets/OLYMONE_load.png")}
          backgroundColor={"black"}
          logoHeight={300}
          logoWidht={300}
      >
        <View style={{flex: 1}}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen" headerMode={false}>
              <Stack.Screen name='LoginScreen' component={LoginScreen}/>
              <Stack.Screen name='BottomTabs' component={BottomTabs}/>
              <Stack.Screen name='SignupScreen' component={SignupScreen}/>
            </Stack.Navigator>
          </NavigationContainer>
        </View>

      </AnimatedSplash>
  )
}
