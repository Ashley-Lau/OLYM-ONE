import React from 'react';
import {Text,Modal, View, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';

import GradientButton from "./GradientButton";
import Background from "../views/Background";

const ViewPlayerItem = props => {

    return (<Modal visible={props.visible} animationType="slide">
            <Background style={{top:0, right:-25, position:"absolute"}}/>
            <View style ={{flex:1}}>
                <View style ={{flex:0.1, justifyContent:"flex-end", alignItems:"flex-start", backgroundColor:"maroon"}}>
                    <Text style={{fontSize:22, color:"white"}}>PLAYERS</Text>
                </View>

                <ScrollView style={{flex:3}}>
                    {props.username.map(names => (
                        <View key={names} style={{
                            flexDirection:"row",
                            borderBottomWidth:1,
                            justifyContent:"space-between",
                            alignItems:"center",
                            height:50
                        }}>
                            <MaterialCommunityIcons name="account" size={35}/>
                            <Text key ={names} style={{fontSize:35, marginLeft:35}}>{names}</Text>
                        </View>
                    ))}
                </ScrollView>

                <GradientButton style={{width:"100%", height:"10%", alignItem:"center", justifyContent: "center"}}
                                onPress={() => {
                                    // console.log(props.username)
                                    props.closePlayer();
                                }}
                                colors={["red", "maroon"]}>
                    <Text style={{fontSize:40}}>Go Back</Text>
                </GradientButton>
            </View>

        </Modal>

    )
}


export default ViewPlayerItem;
