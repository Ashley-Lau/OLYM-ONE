import React from 'react';
import {StyleSheet} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';


const statusBarHeight = getStatusBarHeight(true)

const Styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#fff"

    },
    login:{
        marginTop: 20,
        width: "80%",
        fontSize: 20,
        borderWidth: 1,
        borderRadius: 6,
        textAlign: 'center'
    },
    textContainer:{
        paddingHorizontal:10,
        width:"100%",
        height:"20%",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center"

    },
    logo:{
        width:125,
        height:125,
    },
    buttonContainer:{
        width:100,
        height:100,
        marginTop:20,
        flexDirection:"column",
        justifyContent:"space-around",
        alignItems:"center",

    },
    horizontalbuttonContainer:{
        width:100,
        height:100,
        marginTop:20,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    },
    buttonSize:{
        width:"100%",
        height:"45%",
        backgroundColor: '#c0c0c0',
        opacity: 3,
    },
    animatedHeaderStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 45 + statusBarHeight,
        zIndex: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.34,
        shadowRadius: 3.27,
    },
    innerHeaderStyle: {
        width: '100%',
        height: 45 + statusBarHeight,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        bottom: 5
    },
    statusBarHeight: {
        height: statusBarHeight
    }
})

export default Styles

