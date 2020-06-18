import React,{useState} from 'react';
import {Text,TextInput, StyleSheet, Picker, Modal, View, ScrollView} from 'react-native';

import GradientButton from "./GradientButton";
import Background from "../views/Background";
import Styles from "../styling/Styles";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import CustButton from "./CustButton";
import firebaseDb from "../firebaseDb";


const HostGameItem = props => {

    const [location, setLocation] = useState("")
    const sgLocations = ["Select","Tampines", "Hougang", "Seng Kang", "Punggol", "Pasir Ris", "Jurong","Clementi",]

    const[sport, setSport] = useState("");
    const sports = ["Select", "Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"]

    const [price, setPrice] = useState(0.00);
    const changePrice = (some) => {
        setPrice(parseFloat(some));
    }
    const [slots, setSlots] = useState( 0);
    const changeSlots = (num) => {
        setSlots(parseInt(num));
    }
    const [notes, setNotes] = useState("");
    const changeNotes = (value) => {
        setNotes(value);
    }


    const[date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false)
    const [showDate, setShowDate] = useState(false)

    const onChangeTime = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowTime(Platform.OS !== 'android');
        setDate(currentDate);
    };

    const showTimePicker = () =>{
        setShowTime(true);
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS !== 'android');
        setDate(currentDate);
    };

    const showDatePicker = () =>{
        setShowDate(true);
    }

    const handleCreateGame = () => firebaseDb.firestore()
        .collection('game_details')
        .add({
            price: price,
            sport: sport,
            location: location,
            notes: notes,
            availability : slots,
            date: date,
            host: props.username


        })
        .then(() => {
            setPrice(0);
            setLocation("");
            setDate(new Date());
            setNotes("");
            setSlots(0);
            setSport("")
        })
        .catch(err => console.error(err))

    return(
        <Modal visible={props.visible}>
            <Background style={{position:"absolute", right:0, top:0}}/>

            <View style={styles.header}>
                <Text style={{fontSize:22, color:"white"}}>GAME DETAILS</Text>
            </View>

            <ScrollView>
                <View style={styles.selectionItem}>
                    <Text style={{fontSize:15, marginLeft:8}}>LOCATION:</Text>
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

                <View style={styles.selectionItem}>
                    <Text style={{fontSize:15, marginLeft:8}}>SPORT :</Text>
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

                <View style={styles.selectionItem}>
                    <Text style={{fontSize:15, marginLeft:8}}>DATE :</Text>
                    <CustButton onPress = {showDatePicker}
                                style = {styles.dropDown}>
                        <Text style = {{color: 'black', }}>{date.toLocaleDateString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                    </CustButton>
                </View>
                {showDate && (<RNDateTimePicker  value={date} display="spinner" mode="date" onChange={onChangeDate}/>)}

                <View style={styles.selectionItem}>
                    <Text style={{fontSize:15, marginLeft:8}}>TIME :</Text>
                    <CustButton onPress = {showTimePicker}
                                style = {styles.dropDown}>
                        <Text style = {{color: 'black', }}>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).slice(0,5)}</Text>
                    </CustButton>
                </View>

                {showTime && (<RNDateTimePicker  value={date} display="spinner" mode="time" onChange={onChangeTime}/>)}

                <View style={styles.selectionItem}>
                    <Text style={{fontSize:15, marginLeft:8}}>PRICE :</Text>
                    <TextInput keyboardType={"number-pad"}
                               style={{...styles.dropDown, fontSize:16}}
                               onChangeText={changePrice}
                               value={price}
                    />
                </View>

                <View style={styles.selectionItem}
                >
                    <Text style={{fontSize:15, marginLeft:8}}>PLAYERS :</Text>
                    <TextInput keyboardType={"number-pad"}
                               style={{...styles.dropDown, fontSize:16}}
                               onChangeText = {changeSlots}
                               value = {slots}
                    />
                </View>

                <View style={styles.selectionItem}>
                    <Text style={{fontSize:15, marginLeft:8}}>NOTES      :</Text>
                    <TextInput  style={{...styles.dropDownNotes, fontSize:16}}
                                onChangeText = {changeNotes}
                                value = {notes}
                    />
                </View>

                <View style={{...Styles.horizontalbuttonContainer, right:-150}}>
                    <GradientButton style={{...Styles.buttonSize, marginRight:75}}
                                    onPress={props.closeHost}
                                    colors={["red", "maroon"]}>
                        <Text>Cancel</Text>
                    </GradientButton>

                    <GradientButton onPress={() => {props.closeHost();
                                                    handleCreateGame().then(r => {})}}
                                    colors={['#30cfd0','#330867']}
                                    style={{...Styles.buttonSize}}>
                        <Text>Host</Text>
                    </GradientButton>
                </View>
            </ScrollView>


        </Modal>
    )
}

const styles = StyleSheet.create({
    header:{
        width:"100%",
        height:"10%",
        backgroundColor:"rgba(78,121,255,0.85)",
        justifyContent:"flex-end",
        alignItems:"flex-start",
        elevation: 5
    },
    dropDown: {
        flexDirection:"row",
        marginTop: 5,
        justifyContent: 'center',
        alignItems:"center",
        backgroundColor: 'ghostwhite',
        height: 40,
        borderWidth: 1,
        borderRadius:4,
        width: "97%",
    },
    dropDownNotes: {
        flexDirection:"row",
        marginTop: 5,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'ghostwhite',
        height: 200,
        borderWidth: 1,
        borderRadius:4,
        width: '97%',
        textAlignVertical: 'top'
    },
    selectionItem:{
        flexDirection:"column",
        alignItems:"flex-start",
        justifyContent:"center",
        marginLeft:8,
        marginTop:10
    }
})

export default HostGameItem;
