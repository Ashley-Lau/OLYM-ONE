import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BackgroundTrial = props => {
    return (
        <View style={[styles.container, props.style]}>
            {/*    <LinearGradient style={styles.circle}*/}
            {/*                    colors ={["rgba(132,110,1,0.73)",*/}
            {/*                        // "rgba(255,255,255,0.37)",*/}
            {/*                        "rgb(0,0,0)"]}>*/}

            {/*    </LinearGradient>*/}
            <LinearGradient style={{...styles.circle}}
                            colors ={["rgba(255,212,0,0.71)",
                                // "rgba(255,255,255,0.37)",
                                "rgb(0,0,0)"]}>

            </LinearGradient>

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
            backgroundColor:'black',
        },
        circle:{
            width:winWidth * 1.2,
            height:winWidth * 1.2,
            borderRadius:winWidth * 0.6,
            // backgroundColor:"rgb(239,239,239)",
            position:"absolute",
            // top:-5 * heightRatio,
            // right: -25 * widthRatio,
            left:130 * heightRatio,
            bottom:400 * widthRatio,
            transform:[{rotate:"45deg"}]



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

export default BackgroundTrial;
