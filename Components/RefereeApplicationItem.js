import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    ImageBackground, Image
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import firebaseDb from "../firebaseDb";
import GameItemBackGround from "../views/GameItemBackGround";
import Styles from "../styling/Styles";


// const refItem = <View>
//     <View style = {{flexDirection: 'row', justifyContent: 'space-around', paddingTop: 5,}}>
//         <View style = {styles.photoFrame}>
//             <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {{
//                 uri: data.uri
//             }}/>
//         </View>
//         <GradientButton style={{width: 120, height:37, marginTop: 20,}}
//                         colors = {['#1bb479','#026c45']}
//                         textStyle = {{fontSize: 15}}
//             // onPress = {() => navigation.navigate('UpdateDetailScreen', {data: data, handler: handleData.bind(this)})}
//         >
//             Decline
//         </GradientButton>
//         <GradientButton style={{width: 120, height:37, marginTop: 20,}}
//                         colors = {["red", "maroon"]}
//             // onPress = {logout}
//                         textStyle = {{fontSize: 15}}>
//             Accept
//         </GradientButton>
//     </View>
//
//     <View style = {{paddingLeft: 30, marginTop: 10}}>
//         <Text style = {{fontSize: 20}}> Name: {data.firstName} {data.lastName}</Text>
//         <Text style = {{fontSize: 20}}> Username: {data.username} </Text>
//         <Text style = {{fontSize: 20}}> Email: {data.email}</Text>
//         <Text style = {{fontSize: 20}}> DOB: {data.birthDate.toDate().toString().slice(4,15)}</Text>
//     </View>
//
//
// </View>

const RefereeApplicationItem = props => {
    return (
        <View>
            {/*{refItem}*/}
            <TouchableOpacity>

            </TouchableOpacity>
        </View>


    )
}


const styles = StyleSheet.create({
    photoFrame: {
        height: 85,
        width: 85,
        borderRadius: 170,
        elevation: 10,
        justifyContent: 'center',
        alignItems:'center',
        borderWidth: 2,
        backgroundColor: 'white',
    }
})

export default RefereeApplicationItem;
