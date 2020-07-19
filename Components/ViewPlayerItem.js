import React from 'react';
import {Text, Modal, View, ScrollView, Image, StyleSheet, ImageBackground, TouchableOpacity, FlatList} from 'react-native';

import firebase from 'firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from "react-native-vector-icons/Ionicons";

const ViewPlayerItem = props => {


    return (<Modal visible={props.visible} animationType="slide">
            <ImageBackground source={props.backGround} style={{width:"100%", height:"100%"}}>
                <View style ={{flexDirection:"column", justifyContent:"flex-start", alignItems:"center"}}>
                    <View style={{flexDirection:"row", height:50, width:"100%", elevation:10, justifyContent:"flex-start", alignItems:"center", backgroundColor:props.sportColor}}>
                        <TouchableOpacity activeOpacity={0.6} style={{flexDirection:"row",justifyContent:"center", alignItems:"center", marginLeft:5}} onPress={props.closePlayer}>
                            <Ionicons name="ios-arrow-back" size={40} style={{color:props.lightColor}}/>
                            <Text style = {{fontSize: 30, marginLeft: 6, color: props.lightColor}}>Back</Text>
                        </TouchableOpacity>
                        {props.typeCheck === "Player"
                        ?
                            <Text style={{fontSize:30, color:props.lightColor, marginLeft:"15%"}}>PLAYERS</Text>
                        :
                            <Text style={{fontSize:30, color:props.lightColor, marginLeft:"15%"}}>REFEREES</Text>
                        }

                    </View>

                    <View style = {{width:"100%"}}>
                        { props.playerDetails.length !== 0
                            ?
                            <FlatList
                                      contentContainerStyle={{width:"100%"}}
                                      keyExtractor={( item ) => {item.toString()}}
                                      data={props.playerDetails}
                                      renderItem={({ item,index}) =>
                                          <View
                                              key={index}
                                              style={{
                                              flexDirection:"row",
                                              borderBottomWidth:0.5,
                                              justifyContent:"flex-start",
                                              alignItems:"center",
                                              width:"100%",
                                              height:80,
                                              paddingHorizontal:5
                                          }}>
                                              <View style = {{...styles.photoFrame}}>
                                                  <Image style = {{height: 65, width: 65, borderRadius: 170}} source = {{
                                                      uri: item.uri
                                                  }}/>
                                              </View>
                                              <Text key ={item.id} style={{fontSize:30, marginLeft:35}}>{item.username}</Text>
                                          </View>
                                      }
                            >

                            </FlatList>
                            : props.typeCheck === "Player"
                                ?
                                <View style={{justifyContent:"center", alignItems:"center", marginTop:150}}>
                                    <FontAwesome name="hourglass-half" size={150}/>
                                    <Text style ={{fontSize:20}}>Seems like there</Text>
                                    <Text style ={{fontSize:20}}>are currently no </Text>
                                    <Text style ={{fontSize:20}}>players in this game!</Text>
                                </View>

                                :
                                <View style={{justifyContent:"center", alignItems:"center", marginTop:150}}>
                                    <FontAwesome name="hourglass-half" size={150}/>
                                    <Text style ={{fontSize:20}}>Seems like there</Text>
                                    <Text style ={{fontSize:20}}>are currently no </Text>
                                    <Text style ={{fontSize:20}}>referees for this game!</Text>
                                </View>



                        }

                    </View>


                </View>
            </ImageBackground>


        </Modal>

    )
}

const styles = StyleSheet.create({
    photoFrame: {
        height: 65,
        width: 65,
        borderRadius: 170,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    title: {
        flexDirection:"row",
        height:50,
        width:"100%",
        elevation:10,
        justifyContent:"flex-start",
        alignItems:"center"
    }
})


export default ViewPlayerItem;
