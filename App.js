import React, {useEffect, useState} from 'react';
import {View, YellowBox} from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from "./Screens/LoginScreen";
import BottomTabs from "./Stack/BottomTabs";
import SignupScreen from "./Screens/SignupScreen"
import ResetPasswordScreen from "./Screens/ResetPasswordScreen";

import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import AnimatedSplash from "react-native-animated-splash-screen";
import firebaseDb from "./firebaseDb";
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import {set} from "react-native-reanimated";
import ChatScreen from "./Screens/ChatScreen";
import {Asset} from "expo-asset";
import {AppLoading} from "expo";

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
    'Cannot update during a existing state transition'
]);


const Stack = createStackNavigator();

const cacheImages = (images) => {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

export default function App() {
  console.disableYellowBox = true;
  const [isReady, setIsReady] = useState(false);
  const [data, setData] = useState({
    loading: false,
    user: null
  });

  const loadAssetAsync = async () => {
    const imageAssets = cacheImages([
      //BADMINTON
      require("./assets/badminton_coloured.png"),
      require("./assets/badminton_icon.png"),
      require("./assets/BadmintonApp.png"),
      require("./assets/BadmintonBG.png"),
      require("./assets/BadmintonRefereeApp.png"),
      require("./assets/BadmintonRefereeBG.png"),
      // BBALL
      require("./assets/BballApp.png"),
      require("./assets/BballBG.png"),
      require("./assets/BballRefereeApp.png"),
      require("./assets/BballRefereeBG.png"),
      require("./assets/basketball_coloured.png"),
      // floorball
      require("./assets/floorball_coloured.png"),
      require("./assets/floorball_icon.png"),
      require("./assets/floorballApp.png"),
      require("./assets/floorballBG.png"),
      require("./assets/floorballRefereeApp.png"),
      require("./assets/floorballRefereeBG.png"),
      //BG and Icon
      require("./assets/icon.png"),
      require("./assets/OLYMONE.png"),
      require("./assets/OLYMONE_load.png"),
      require("./assets/OLYMONE_login.png"),
      require("./assets/OrangeBackground.jpg"),
      require("./assets/BrownSkyline.png"),
      require("./assets/BrownSkylineChat.png"),
      require("./assets/whiteBackground.jpg"),
      //other games
      require("./assets/other_games.png"),
      require("./assets/other_games_icon.png"),
      require("./assets/OthersApp.png"),
      require("./assets/OthersApp2.png"),
      require("./assets/OthersApp3.png"),
      require("./assets/OthersBG.png"),
      require("./assets/OthersBG2.png"),
      require("./assets/OthersBG3.png"),
      // Soccer
      require("./assets/soccer_coloured.png"),
      require("./assets/SoccerApp.png"),
      require("./assets/SoccerBG.png"),
      require("./assets/SoccerRefereeApp.png"),
      require("./assets/SoccerRefereeBG.png"),
      // Tennis
      require("./assets/tennis_coloured.png"),
      require("./assets/TennisApp.png"),
      require("./assets/TennisBG.png"),
      require("./assets/TennisRefereeApp.png"),
      require("./assets/TennisRefereeBG.png"),

    ]);
  }

    useEffect(() => {
      const usersRef = firebaseDb.firestore().collection('users');
      firebaseDb.auth().onAuthStateChanged(user => {
        if (user && !user.emailVerified) {
          setData({loading: true})
        } else if (user) {
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

    if(isReady){
        return (

            <AnimatedSplash
                translucent={false}
                isLoaded={data.loading}
                logoImage={require("./assets/OLYMONE_load.png")}
                backgroundColor={"black"}
                logoHeight={300}
                logoWidht={300}
            >
              <SafeAreaProvider>
                <View style={{flex: 1}}>
                  <IconRegistry icons={EvaIconsPack}/>
                  <ApplicationProvider {...eva} theme={eva.light}>
                    <NavigationContainer>
                      <Stack.Navigator headerMode={false}>
                        {data.user ? (
                            <>
                              <Stack.Screen name='BottomTabs'>
                                {props => <BottomTabs {...props} extraData={data.user}/>}
                              </Stack.Screen>
                              <Stack.Screen name="ChatScreen" component={ChatScreen}/>
                            </>
                        ) : (
                            <>
                              <Stack.Screen name='LoginScreen' component={LoginScreen}/>
                              <Stack.Screen name='SignupScreen' component={SignupScreen}/>
                              <Stack.Screen name='ResetPasswordScreen' component={ResetPasswordScreen}/>
                            </>
                        )
                        }
                      </Stack.Navigator>
                    </NavigationContainer>
                  </ApplicationProvider>
                </View>
              </SafeAreaProvider>
            </AnimatedSplash>

        )
      } else {
        return(
            <AppLoading
                startAsync={loadAssetAsync}
                onFinish={() => setIsReady(true)}
            />
        )
    }

}
