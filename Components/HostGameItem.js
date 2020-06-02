import React,{useState} from 'react';
import {Text,TextInput, StyleSheet, Picker, Modal, View} from 'react-native';

import GradientButton from "./GradientButton";
import Background from "../views/Background";
import Styles from "../styling/Styles";

const HostGameItem = props => {

    const [location, setLocation] = useState("")
    const sgLocations = ["Tampines", "Hougang", "Seng Kang", "Punggol", "Pasir Ris", "Jurong","Clementi",]

    const[sport, setSport] = useState("");
    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"]

    return(
        <Modal visible={props.visible}>
            <Background style={{position:"absolute", right:0, top:0}}/>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:30, }}>LOCATION:</Text>
                <View style={styles.dropDown}>
                    <Picker
                        selectedValue={location}
                        style={{ height: "100%", width: "100%", justifyContent:"space-between"}}
                        onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}
                    >
                        {sgLocations.map(locations => (
                            <Picker.Item key={locations} label={locations} value={locations}/>
                        ))}
                    </Picker>

                </View>
            </View>

            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:30, }}>SPORT      :</Text>
                <View style={styles.dropDown}>
                    <Picker
                        selectedValue={sport}
                        style={{ height: "100%", width: "100%", justifyContent:"space-between"}}
                        onValueChange={(itemValue, itemIndex) => setSport(itemValue)}
                    >
                        {sports.map(game => (
                            <Picker.Item key={game} label={game} value={game}/>
                        ))}
                    </Picker>

                </View>
            </View>

            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:30, }}>PRICE       :$</Text>
                <TextInput keyboardType={"number-pad"} style={{...styles.dropDown, fontSize:16}}/>
            </View>




            <View style={{...Styles.horizontalbuttonContainer, right:-150}}>
                <GradientButton style={{...Styles.buttonSize, marginRight:75}}
                                onPress={props.closeHost}
                                colors={['#30cfd0','#330867']}>
                    <Text>Join</Text>
                </GradientButton>

                <GradientButton onPress={props.closeHost}
                                colors={["rgba(155,113,170,0.84)", "rgba(229,29,62,0.6)"]}
                                style={{...Styles.buttonSize}}>
                    <Text>Cancel</Text>
                </GradientButton>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    dropDown: {
        flexDirection:"row",
        marginTop: 18,
        justifyContent: 'center',
        alignItems:"center",
        backgroundColor: 'ghostwhite',
        height: 40,
        borderWidth: 1,
        borderRadius:4,
        width: "60%",
    }
})

export default HostGameItem;
