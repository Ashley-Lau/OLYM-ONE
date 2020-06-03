import React,{useState} from 'react';
import {Text,TextInput, StyleSheet, Picker, Modal, View, Button} from 'react-native';

import GradientButton from "./GradientButton";
import Background from "../views/Background";
import Styles from "../styling/Styles";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import CustButton from "./CustButton";

const HostGameItem = props => {

    const [location, setLocation] = useState("")
    const sgLocations = ["Tampines", "Hougang", "Seng Kang", "Punggol", "Pasir Ris", "Jurong","Clementi",]

    const[sport, setSport] = useState("");
    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"]

    const[date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false)
    const [showDate, setShowDate] = useState(false)

    const onChangeTime = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowTime(Platform.OS === 'android');
        setDate(currentDate);
    };

    const showTimePicker = () =>{
        setShowTime(true);
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'android');
        setDate(currentDate);
    };

    const showDatePicker = () =>{
        setShowDate(true);
    }

    return(
        <Modal visible={props.visible}>
            <Background style={{position:"absolute", right:0, top:0}}/>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:30, }}>LOCATION:</Text>
                <View style={styles.dropDown}>
                    <Picker
                        mode="dropdown"
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
                        mode="dropdown"
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
                <Text style={{fontSize:30, }}>DATE         :</Text>
                <CustButton onPress = {showDatePicker}
                            style = {{borderRadius:4, width: "60%", backgroundColor: 'ghostwhite', marginTop:10, borderWidth:1}}>
                    <Text style = {{color: 'black', }}>{date.toLocaleDateString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                </CustButton>
            </View>
            {showTime && (<RNDateTimePicker  value={date} display="spinner" mode="date" onChange={onChangeDate}/>)}

            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:30, }}>TIME         :</Text>
                <CustButton onPress = {showTimePicker}
                            style = {{borderRadius:4, width: "60%", backgroundColor: 'ghostwhite', marginTop:10, borderWidth:1}}>
                    <Text style = {{color: 'black', }}>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).slice(0,5)}</Text>
                </CustButton>
            </View>

            {showTime && (<RNDateTimePicker  value={date} display="spinner" mode="time" onChange={onChangeTime}/>)}
            {/*<TextInput keyboardType={"number-pad"} style={{...styles.dropDown, fontSize:16}}/>*/}



            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:30, }}>PRICE       :$</Text>
                <TextInput keyboardType={"number-pad"} style={{...styles.dropDown, fontSize:16}}/>
            </View>

            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontSize:30, }}>PLAYERS  :</Text>
                <TextInput keyboardType={"number-pad"} style={{...styles.dropDown, fontSize:16}}/>
            </View>




            <View style={{flexDirection:"row", alignItems:"flex-start", justifyContent:"space-between"}}>
                <Text style={{fontSize:30, marginTop:20}}>NOTES      :</Text>
                <TextInput keyboardType={"number-pad"} style={{...styles.dropDownNotes, fontSize:16}}/>
            </View>




            <View style={{...Styles.horizontalbuttonContainer, right:-150}}>
                <GradientButton style={{...Styles.buttonSize, marginRight:75}}
                                onPress={props.closeHost}
                                colors={["rgba(155,113,170,0.84)", "rgba(229,29,62,0.6)"]}>
                    <Text>Cancel</Text>
                </GradientButton>

                <GradientButton onPress={props.closeHost}
                                colors={['#30cfd0','#330867']}
                                style={{...Styles.buttonSize}}>
                    <Text>Host</Text>
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
    },
    dropDownNotes: {
        flexDirection:"row",
        marginTop: 18,
        justifyContent: 'center',
        alignItems:"center",
        backgroundColor: 'ghostwhite',
        height: 200,
        borderWidth: 1,
        borderRadius:4,
        width: "60%",
    }
})

export default HostGameItem;
