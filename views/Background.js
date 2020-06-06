import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';

const Background = props => {
    return (
        <View style={[styles.container, props.style]}>
            <View style={styles.circle}>
                <Image source={require("../assets/OLYMONE.png")} style={styles.image}/>
            </View>
                {props.children}
        </View>

    );
}

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;
const heightRatio = winHeight/ 497;
const widthRatio = winWidth/ 477;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white',
    },
    circle:{
        // width:500,
        // height:500,
        // borderRadius:250,
        // backgroundColor:"rgb(239,239,239)",
        // position:"absolute",
        // top:-15,
        // right: -20,
        width:winWidth * 1.2,
        height:winWidth * 1.2,
        borderRadius:winWidth * 0.6,
        backgroundColor:"rgb(239,239,239)",
        position:"absolute",
        top:-5 * heightRatio,
        right: -25 * widthRatio,

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
