import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";


const RefereeItem = props => {

    const[openItem ,setOpenItem] = useState(false);

    const refereeItem = <Modal visible={openItem}>
        <Background>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style = {{alignItems: 'center', paddingBottom: 30,}}>
                    <View style = {{...styles.elevatedComponent, height: 200, justifyContent: 'space-evenly'}}>
                        <View style = {{flexDirection: 'column', justifyContent: 'space-around', paddingTop: 5,}}>
                            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-start", marginLeft:20}}>
                                <View style = {styles.photoFrame}>
                                    <MaterialCommunityIcons name='account' size={50}/>
                                </View>
                                <View style = {{alignItems: 'center'}}>
                                    <Text style = {{fontSize: 20}}> Name: {props.title[1]} </Text>
                                    <Text style = {{fontSize: 20}}> Sport: {props.title[0]} </Text>
                                </View>
                            </View>

                            <View style={{flexDirection:"row", justifyContent:"space-around"}}>
                                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                                colors = {["red", "maroon"]}
                                                textStyle = {{fontSize: 15}}
                                                onPress={() => setOpenItem(false)}>
                                    CANCEL
                                </GradientButton>
                                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                                colors = {['#1bb479','#026c45']}
                                                onPress = {() => setOpenItem(false)}
                                                textStyle = {{fontSize: 15}}>
                                    HIRE
                                </GradientButton>
                            </View>
                        </View>

                    </View>
                    <View style = {{...styles.elevatedComponent, marginTop: 20, height: 400}}>
                        <View style = {styles.titleBackground} >
                            <Text style ={styles.titleText}>
                                Upcoming Games
                            </Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </Background>

    </Modal>

    return(
        <View>
            {refereeItem}
            <TouchableOpacity style={styles.games}
                              onPress={() => {setOpenItem(true);}}>
                {/*to replace icon with the profile picture of the referee*/}
                <MaterialCommunityIcons name="account" size={35}/>
                <View style={{flexDirection:"column", marginLeft:15}}>
                    <Text style={{fontSize:18}}> Name: {props.title[1]}</Text>
                    <Text style={{fontSize:18, color: "black"}}> {props.title[0]} </Text>
                </View>
            </TouchableOpacity>
        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: "bold",
    },
    elevatedComponent: {
        width: '90%',
        height: 150,
        elevation: 10,
        backgroundColor: 'white',
        marginTop: 40,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    titleBackground: {
        backgroundColor: 'green',
        height: 40,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    titleText: {
        textDecorationLine: 'underline',
        fontSize: 25,
        marginTop: 2,
        marginLeft: 4,
        fontWeight: '500',
        color: 'white',
    },
    photoFrame: {
        height: 85,
        width: 85,
        borderRadius: 170,
        elevation: 10,
        justifyContent: 'center',
        alignItems:'center',
        borderWidth: 2,
        backgroundColor: 'white',
    },
    games:{
        flexDirection:"row",
        borderBottomWidth:1,
        padding:5,
        justifyContent:"flex-start",
        alignItems:"center",
        backgroundColor:"transparent",
    },

})

export default RefereeItem;
