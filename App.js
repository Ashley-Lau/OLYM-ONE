import React, {useEffect, useState} from 'react';
import {View, YellowBox} from 'react-native';

import LoginScreen from "./Screens/LoginScreen";
import BottomTabs from "./Stack/BottomTabs";
import SignupScreen from "./Screens/SignupScreen"

import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import AnimatedSplash from "react-native-animated-splash-screen";
import firebaseDb from "./firebaseDb";

import {set} from "react-native-reanimated";

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);


const Stack = createStackNavigator();

export default function App() {
  const [data, setData] = useState({
    loading: false,
    user: null
  })

  useEffect(() => {

    const usersRef = firebaseDb.firestore().collection('users');
    firebaseDb.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
            .doc(user.uid)
            .get()
            .then((document) => {
              const userData = document.data()
              setData({user: userData, loading: true})
            })
            .catch((error) => error);
      } else {
        setData({loading: true})
      }
    });
  }, [])

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
            <Stack.Navigator headerMode={false}>
              {data.user ? (
                  <Stack.Screen name='BottomTabs'>
                    {props => <BottomTabs {...props} extraData={data.user} />}
                  </Stack.Screen>
                ) : (
                  <>
                  <Stack.Screen name='LoginScreen' component={LoginScreen}/>
                  <Stack.Screen name='SignupScreen' component={SignupScreen}/>
                  </>
                )
              }
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </AnimatedSplash>
  )
}
