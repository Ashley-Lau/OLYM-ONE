import React from 'react';
import {View, StyleSheet, Image, Dimensions,} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

const Background = props => {
    return (<SafeAreaView style={{flex:1, justifyContent:"flex-start", alignItems:"flex-start"}}>
            <View style={[styles.container, props.style]}>

                <View style={styles.topView}>
                    <Image source={require('../assets/OrangeBackground.jpg')}
                           style = {{height: "30%", width: '100%', borderBottomLeftRadius: 40}}
                           imageStyle={{borderBottomLeftRadius: 40}}
                    />
                </View>

                    {props.children}
            </View>
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
        width:winWidth * 1.2,
        height:winWidth * 1.2,
        // backgroundColor:"rgb(239,239,239)",
        position:"absolute",
        backgroundColor:"transparent"
        // top:-5 * heightRatio,
        // right: -25 * widthRatio,

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
