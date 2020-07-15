import React from 'react';
import {View, StyleSheet, Image, Dimensions, ImageBackground, SafeAreaView} from 'react-native';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const Background = props => {
    return (<SafeAreaView style = {{flex: 1, minHeight: Platform.OS === 'android' ? hp("97%") : hp("100%"),}}>
            <ImageBackground style={[styles.container, props.style]} source={require('../assets/whiteBackground.jpg')}>
                <View style={styles.topView}>
                    <Image source={require('../assets/OrangeBackground.jpg')}
                           style = {{flex: 1, borderBottomLeftRadius: 40,}}
                           imageStyle={{borderBottomLeftRadius: 40,}}
                    />
                </View>
                {props.children}
            </ImageBackground>
        </SafeAreaView>
    );
}

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;
const heightRatio = winHeight/ 497;
const widthRatio = winWidth/ 477;

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    topView:{
        // width:winWidth * 1.2,
        // height:winWidth * 1.2,
        // backgroundColor:"rgb(239,239,239)",
        // top:-5 * heightRatio,
        // right: -25 * widthRatio,
        height: 150,
        // width: '100%',
        position:"absolute",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    image: {
        opacity:0.15,
        width:winWidth * 0.9,
        height:360,
        top: 40 * heightRatio,
        left:90 * widthRatio,
    }
})

;

export default Background;
