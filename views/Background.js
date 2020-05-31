import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

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

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white',
    },
    circle:{
        width:500,
        height:500,
        borderRadius:250,
        backgroundColor:"rgb(239,239,239)",
        position:"absolute",
        top:-15,
        right: -20,
    },
    image: {
        opacity:0.15,
        width:360,
        height:360,
        top: 55,
        left:80,
    }
})

;

export default Background;
