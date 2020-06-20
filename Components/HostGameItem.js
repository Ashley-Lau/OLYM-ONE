import React,{useState} from 'react';
import {Text,TextInput, StyleSheet, Picker, Modal, View, ScrollView} from 'react-native';

import GradientButton from "./GradientButton";
import Background from "../views/Background";
import Styles from "../styling/Styles";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {Formik} from 'formik';
import * as yup from 'yup'
import CustButton from "./CustButton";
import firebaseDb from "../firebaseDb";



const reviewSchema = yup.object({
    location: yup.string().label('Location').test('selectLocation', 'Please select a location!', (location) => location != 'Select'),
    sport: yup.string().label('Sport').test('selectSport', 'Please select a sport!', (sport) => sport != 'Select'),
    date: yup.date().label('Date').test('test date', 'The Game Cannot Be Earlier Than Now!', (val) => val > Date.now()),
    time: yup.date().label('Time'),
    price: yup.string().label('Price')
        .test('Valid Price', 'Please enter a valid price!', (val) => parseInt(val) >= 0 && !(val).includes(",")),
    slots: yup.string().label('Slots')
        .test('Valid Slots', 'Please enter a valid number of players!',  (val) => parseInt(val) > 0 && !(val).includes(",")),
    notes: yup.string(),

})


const HostGameItem = props => {

    const sgLocations = ["Select","Tampines", "Hougang", "Seng Kang", "Punggol", "Pasir Ris", "Jurong","Clementi",]
    const sports = ["Select", "Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"]

    const closeHost = () => {props.closeHost()}


    const handleCreateGame = values => {
        firebaseDb.firestore()
            .collection('game_details')
            .add({
                sport: values.sport,
                location: values.location,
                notes: values.notes,
                availability : values.slots,
                date: values.date,
                host: props.userName,
                price: values.price,
                players: [props.userName]
            })
            .then(() => {closeHost()})
            .catch(err => console.error(err))

    }

    return(
        <Modal visible={props.visible}>
            <Background style={{position:"absolute", right:0, top:0}}/>

            <View style={styles.header}>
                <Text style={{fontSize:22, color:"white"}}>GAME DETAILS</Text>
            </View>

            <ScrollView>
                <Formik initialValues={{
                    location: '',
                    sport:'',
                    price:'0.00',
                    slots:'0',
                    date:new Date(),
                    notes:'',
                    showDate: false,
                    showTime: false}}
                        validationSchema={reviewSchema}
                        onSubmit={(values, actions) => {
                            handleCreateGame(values);
                            actions.resetForm();
                        }
                        }
                >
                    {/*// LOCATION ------------------------------------------------------------------------*/}
                    {(props) => (

                        <View>
                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>LOCATION:</Text>
                                <View style={styles.dropDown}>
                                    <Picker
                                        mode="dropdown"
                                        selectedValue={props.values.location}
                                        style={{ height: "100%", width: "100%", justifyContent:"space-between"}}
                                        onValueChange={(itemValue, itemIndex) => {
                                            props.setFieldValue('location', itemValue)
                                            props.setFieldTouched('location')
                                        }}
                                    >
                                        {sgLocations.map(locations => (
                                            <Picker.Item key={locations} label={locations} value={locations}/>
                                        ))}
                                    </Picker>


                                </View>
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.location && props.errors.location}</Text>
                            </View>

                            {/*// SPORT ------------------------------------------------------------------------*/}

                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>SPORT :</Text>
                                <View style={styles.dropDown}>
                                    <Picker
                                        mode="dropdown"
                                        selectedValue={props.values.sport}
                                        style={{ height: "100%", width: "100%", justifyContent:"space-between"}}
                                        onValueChange={(itemValue, itemIndex) => {
                                            props.setFieldValue('sport', itemValue)
                                            props.setFieldTouched('sport')
                                        }}
                                    >
                                        {sports.map(game => (
                                            <Picker.Item key={game} label={game} value={game}/>
                                        ))}
                                    </Picker>

                                </View>
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.sport && props.errors.sport}</Text>
                            </View>

                            {/*// DATE AND TIME ------------------------------------------------------------------------*/}

                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>DATE :</Text>
                                <CustButton onPress = {() => props.setFieldValue('showDate', true)}
                                            style = {styles.dropDown}>
                                    <Text style = {{color: 'black', }}>{props.values.date.toLocaleDateString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                                </CustButton>
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.date && props.errors.date}</Text>
                            </View>
                            {props.values.showDate && (<RNDateTimePicker  value={props.values.date}
                                                                          display="spinner"
                                                                          mode="date"
                                                                          onChange={(event, selectedDate) => {
                                                                              const currentDate = selectedDate || props.values.date;
                                                                              props.setFieldValue('showDate',Platform.OS !== 'android');
                                                                              props.setFieldValue('date', currentDate);
                                                                              props.setFieldTouched('date');}}
                            />)}

                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>TIME :</Text>
                                <CustButton onPress = {() => props.setFieldValue('showTime', true)}
                                            style = {styles.dropDown}>
                                    <Text style = {{color: 'black', }}>{props.values.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).slice(0,5)}</Text>
                                </CustButton>

                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.time && props.errors.time}</Text>
                            </View>

                            {props.values.showTime && (<RNDateTimePicker  value={props.values.date} display="spinner"
                                                                          mode="time"
                                                                          onChange={(event, selectedDate) => {
                                                                              const currentDate = selectedDate || props.values.date;
                                                                              props.setFieldValue('showTime',Platform.OS !== 'android');
                                                                              props.setFieldValue('date', currentDate);
                                                                              props.setFieldTouched('date');}}
                            />)}

                            {/*// PRICE ------------------------------------------------------------------------*/}

                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>PRICE :</Text>
                                <View style={{...styles.dropDown, padding:5}}>
                                    <TextInput keyboardType={"number-pad"}
                                               placeholder={"Price to be paid per Player"}
                                               style={{...styles.dropDownText, fontSize:16}}
                                               onChangeText={props.handleChange('price')}
                                               value={props.values.price}
                                               onBlur = {props.handleBlur('price')}
                                    />
                                </View>

                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.price && props.errors.price}</Text>

                            </View>

                            {/*// SLOTS LEFT ------------------------------------------------------------------------*/}

                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>NO. OF PLAYERS  :</Text>
                                <View style={{...styles.dropDown, padding:5}}>
                                    <TextInput keyboardType={"number-pad"}
                                               placeholder={"Number of Available Slots"}
                                               style={{...styles.dropDownText, fontSize:16}}
                                               onChangeText={props.handleChange('slots')}
                                               value={props.values.slots}
                                               onBlur = {props.handleBlur('slots')}
                                    />
                                </View>
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.slots && props.errors.slots}</Text>
                            </View>

                            {/*//NOTES----------------------------------------------------------------------------*/}
                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>NOTES      :</Text>
                                <View style ={{...styles.dropDownNotes}}>
                                    <TextInput
                                        multiline={true}
                                        placeholder={"Things You Want the Players to Take Note of"}
                                        style={{...styles.dropDownNotesText}}
                                        onChangeText = {props.handleChange('notes')}
                                        value = {props.values.notes}
                                    />
                                </View>

                            </View>


                            {/*//BUTTONS at the Bottom------------------------------------------------------------------------*/}

                            <View style={{...Styles.horizontalbuttonContainer, right:-150}}>
                                <GradientButton style={{...Styles.buttonSize, marginRight:75}}
                                                onPress={() => {props.handleReset();
                                                    closeHost();}}
                                                colors={["red", "maroon"]}>
                                    <Text>Cancel</Text>
                                </GradientButton>

                                <GradientButton onPress={props.handleSubmit}
                                                colors={['#30cfd0','#330867']}
                                                style={{...Styles.buttonSize}}>
                                    <Text>Host</Text>
                                </GradientButton>
                            </View>

                        </View>

                    )}

                </Formik>



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
    dropDownText: {
        flexDirection:"row",
        justifyContent: 'center',
        alignItems:"center",
        height: 40,
        width: "97%",
    },
    dropDownNotesText: {
        flexDirection:"row",
        justifyContent: 'center',
        alignItems:"center",
        width: "97%",
        textAlignVertical: 'top',
        fontSize:16,
        height:200,
        marginTop:5
    },
    dropDownNotes: {
        flexDirection:"row",
        marginTop: 5,
        justifyContent: 'center',
        alignItems:'flex-start',
        backgroundColor: 'ghostwhite',
        height: 200,
        borderWidth: 1,
        borderRadius:4,
        width: '97%',

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
