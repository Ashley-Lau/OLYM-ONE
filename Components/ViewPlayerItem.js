import React from 'react';
import {Text, Modal, View, ScrollView, Image, StyleSheet, ImageBackground, TouchableOpacity, FlatList} from 'react-native';

import firebase from 'firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from "react-native-vector-icons/Ionicons";
import Styles from '../styling/Styles'

const ViewPlayerItem = props => {


    return (<Modal visible={props.visible} animationType="slide">
            <ImageBackground source={props.backGround} style={{width:"100%", height:"100%"}}>
                <View >
                    <View style={{...styles.title,  backgroundColor:props.sportColor}}>
                        <TouchableOpacity activeOpacity={0.8} style={{flexDirection:"row",justifyContent:"center", alignItems:"center", position: 'absolute', left: 10, paddingBottom: 5}}
                                          onPress={props.closePlayer}>
                            <Ionicons name="ios-arrow-back" size={27} style={{color:props.lightColor}}/>
                            <Text style = {{fontSize: 20, marginLeft: 6, color: props.lightColor,  }}>Back</Text>
                        </TouchableOpacity>
                        {props.typeCheck === "Player"
                        ?
                            <Text style={{...styles.titleStyle, color:props.lightColor, }}>Players</Text>
                        :
                            <Text style={{...styles.titleStyle, color:props.lightColor, }}>Referees</Text>
                        }

                    </View>

                    <View style = {{width:"100%"}}>
                        { props.playerDetails.length !== 0
                            ?
                            <FlatList
                                      contentContainerStyle={{width:"100%"}}
                                      keyExtractor={( item,index ) => index.toString()}
                                      data={props.playerDetails}
                                      renderItem={({ item}) =>
                                          <View
                                              style={{
                                              flexDirection:"row",
                                              borderBottomWidth:0.5,
                                              justifyContent:"center",
                                              alignItems:"center",
                                              width:"100%",
                                              height:70,
                                              paddingHorizontal:5
                                          }}>
                                              <View style = {{...styles.photoFrame}}>
                                                  <Image style = {{height: 50, width: 50, borderRadius: 100}} source = {{
                                                      uri: item.uri
                                                  }}/>
                                              </View>
                                              <Text key ={item.id} style={{fontSize:20,}}>{item.username}</Text>
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
        height: 50,
        width: 50,
        borderRadius: 100,
        justifyContent: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        left: 15
    },
    title: {
        flexDirection:"row",
        height:45 + Styles.statusBarHeight.height,
        width:"100%",
        paddingBottom: 5,
        elevation:10,
        justifyContent:"center",
        alignItems:"flex-end",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.34,
        shadowRadius: 3.27,
    },
    titleStyle: {
        color: 'white',
        justifyContent: 'center',
        fontSize: 21,
        fontWeight: "bold",
    },
})


export default ViewPlayerItem;
