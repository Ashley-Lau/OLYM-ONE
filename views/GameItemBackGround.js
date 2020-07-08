import React from 'react';
import {StyleSheet, ImageBackground} from 'react-native';


const GameItemBackGround = props => {
    let icon = require("../assets/other_games.png")
    let style = styles.imageBack
    if(props.iconName === "basketball"){
        icon = require("../assets/basketball_coloured.png")
    } else if(props.iconName === 'badminton'){
        icon = require("../assets/badminton_coloured.png")
    } else if(props.iconName === 'tennis'){
        icon = require("../assets/tennis_coloured.png")
    } else if(props.iconName === 'floorball'){
        icon = require("../assets/floorball_coloured.png")
    } else if(props.iconName === 'soccer'){
        icon = require("../assets/soccer_coloured.png")
    }
    return (

        <ImageBackground source={icon} style={style}>
            {props.children}
        </ImageBackground>

    )
}

const styles = StyleSheet.create({
    background:{
        position:"absolute",
        top:-200,
        right:-150

    },
    imageBack:{
        width:200,
        height:78,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
    }

})
export default GameItemBackGround;
