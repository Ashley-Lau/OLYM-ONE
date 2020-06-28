import React,{useState} from 'react';
import {Text,TextInput, StyleSheet, Picker, Modal, View, ScrollView} from 'react-native';

import {useNavigation} from "@react-navigation/native";
import GradientButton from "./GradientButton";
import Background from "../views/Background";
import Styles from "../styling/Styles";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from '@react-native-community/datetimepicker';
import {Formik} from 'formik';
import * as Animatable from 'react-native-animatable';
import * as yup from 'yup'
import CustButton from "./CustButton";
import firebaseDb from "../firebaseDb";
import { Select, SelectItem } from '@ui-kitten/components';



const reviewSchema = yup.object({
    location: yup.string().label('Location').test('selectLocation', 'Please select a location!', (location) => location != ''),
    sport: yup.string().label('Sport').test('selectSport', 'Please select a sport!', (sport) => sport != ''),
    date: yup.date().label('Date').test('test date', 'The Game Cannot Be Earlier Than Now!', (val) => val > Date.now()),
    time: yup.date().label('Time'),
    price: yup.string().label('Price')
        .test('Valid Price', 'Please enter a valid price!', (val) => parseInt(val) >= 0 && !(val).includes(",")),
    slots: yup.string().label('Slots')
        .test('Valid Slots', 'Please enter a valid number of players!',  (val) => parseInt(val) > 0 && !(val).includes(",")),
    notes: yup.string(),

})


const HostGameItem = props => {

    //NAVIGATION ===================================================================================================
    const navigation = useNavigation()

    const registeredPress = () => {
        navigation.navigate('ProfileScreen');
    }

    //CHECKS FOR IOS PLATFORM ========================================================================================================================
    const isIos = Platform.OS === 'ios'

    const [selectedIndex, setSelectedIndex] = useState();

    const genderData = ['Male', 'Female']


    //FUNCTION TO CONVERT TIME TO SINGAPORE TIME ==============================================================================================
    const sgTime = (date) => {
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        const sgTime = new Date(utc + (3600000*8));
        return sgTime;
    }


    //ARRAY FOR PICKER ==============================================================================================================

    const sgLocations = ["Tampines", "Hougang", "Seng Kang", "Punggol", "Pasir Ris", "Jurong","Clementi",]
    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"]

    const [locationIndex, setLocationIndex] = useState();
    const [sportsIndex, setSportsIndex] = useState()
    //CLOSING HOST GAME ITEM ==============================================================================================================

    // UPDATING THE GAMEITEM AND DETAIL ==============================================================================================================
    const handleCreateGame = values => {
        firebaseDb.firestore()
            .collection('game_details')
            .add({
                sport: values.sport,
                location: values.location,
                notes: values.notes,
                availability : values.slots,
                date: sgTime(values.date),
                host: props.username,
                price: values.price,
                players: [props.uid],
                hostId: props.uid
            })
            .then(() => {registeredPress()})
            .catch(err => console.error(err))

    }

    return(
        <View>
            <Background style={{position:"absolute", right:0, top:0}}/>

            <View style={styles.header}>
                <Text style={{fontSize:22, color:"white"}}>GAME DETAILS</Text>
            </View>

            <ScrollView>
                <Formik initialValues={{
                    location: 'Select',
                    sport:'Select',
                    price:'',
                    slots:'',
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
                                <View style={styles.dropDownCopy}>

                                    <Select
                                        style = {{width: "100%", justifyContent:"space-between"}}
                                        placeholder='Location'
                                        value ={sgLocations[locationIndex - 1]}
                                        onSelect={index => {
                                            setLocationIndex(index)
                                            props.setFieldValue('location', sgLocations[index.row])
                                        }}
                                        selectedIndex={locationIndex}>
                                        {sgLocations.map(locations => (
                                            <SelectItem key={locations} title={locations}/>
                                        ))}

                                    </Select>

                                </View>
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.location && props.errors.location}</Text>
                            </View>


                            {/*// SPORT ------------------------------------------------------------------------*/}
                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>LOCATION:</Text>
                                <View style={styles.dropDownCopy}>

                                    <Select
                                        style = {{width: "100%", justifyContent:"space-between"}}
                                        placeholder='Sports'
                                        value ={sports[sportsIndex - 1]}
                                        onSelect={index => {
                                            setSportsIndex(index)
                                            props.setFieldValue('sport', sgLocations[index.row])
                                        }}
                                        selectedIndex={sportsIndex}>
                                        {sports.map(sport => (
                                            <SelectItem key={sport} title={sport}/>
                                        ))}

                                    </Select>

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
                                <Text style={{fontSize: 15, color: 'red'}}>{ props.touched.date && props.errors.date}</Text>
                            </View>
                            {props.values.showDate &&
                            (isIos
                                ?
                                (
                                    <Modal visible={props.values.showDate} animationType="slide"
                                           transparent={true}>
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <View style={{
                                                borderRadius: 10,
                                                borderWidth: '1',
                                                width: 300,
                                                height: 300,
                                                backgroundColor: 'white'}}>
                                                <DateTimePicker value={props.values.date}
                                                                mode={'date'}
                                                                display="spinner"
                                                                onChange={(event, selectedDate) => {
                                                                    const currentDate = selectedDate || props.values.date;
                                                                    props.setFieldValue('date', currentDate);
                                                                    props.setFieldTouched('date');}}/>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, paddingBottom: 20}}>
                                                    <GradientButton onPress={() => props.setFieldValue('showDate',false)}
                                                                    style={style.button}
                                                                    colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
                                                        Cancel
                                                    </GradientButton>
                                                    <GradientButton onPress={() => props.setFieldValue('showDate',false)}
                                                                    style={style.button}
                                                                    colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                                                        Confirm
                                                    </GradientButton>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                )



                                :
                                <RNDateTimePicker  value={props.values.date}
                                                                          display="spinner"
                                                                          mode="date"
                                                                          onChange={(event, selectedDate) => {
                                                                              const currentDate = selectedDate || props.values.date;
                                                                              props.setFieldValue('showDate',Platform.OS !== 'android');
                                                                              props.setFieldValue('date', currentDate);
                                                                              props.setFieldTouched('date');}}
                            />)
                            }

                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>TIME :</Text>
                                <CustButton onPress = {() => props.setFieldValue('showTime', true)}
                                            style = {styles.dropDown}>
                                    <Text style = {{color: 'black', }}>{props.values.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).slice(0,5)}</Text>
                                </CustButton>

                            </View>

                            {props.values.showTime &&
                            (isIos
                                ?
                                (<Modal visible={props.values.showTime} animationType="slide"
                                           transparent={true}>
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <View style={{
                                                borderRadius: 10,
                                                borderWidth: '1',
                                                width: 300,
                                                height: 300,
                                                backgroundColor: 'white'}}>
                                                <DateTimePicker value={props.values.date}
                                                                mode={'date'}
                                                                display="spinner"
                                                                onChange={(event, selectedDate) => {
                                                                    const currentDate = selectedDate || props.values.date;
                                                                    props.setFieldValue('date', currentDate);
                                                                    props.setFieldTouched('date');}}/>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, paddingBottom: 20}}>
                                                    <GradientButton onPress={() => props.setFieldValue('showTime',false)}
                                                                    style={style.button}
                                                                    colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
                                                        Cancel
                                                    </GradientButton>
                                                    <GradientButton onPress={() => props.setFieldValue('showTime',false)}
                                                                    style={style.button}
                                                                    colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                                                        Confirm
                                                    </GradientButton>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                )

                                :

                                <RNDateTimePicker  value={props.values.date} display="spinner"
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
                                               placeholder={"0.00"}
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
                                               placeholder={"0"}
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
                                                    registeredPress();}}
                                                colors={["red", "maroon"]}>
                                    <Text>Cancel</Text>
                                </GradientButton>

                                <GradientButton onPress={props.handleSubmit}
                                                colors={['#30cfd0','#330867']}
                                                style={{...Styles.buttonSize}}>
                                    <Text>Host</Text>
                                </GradientButton>
                            </View>
                            <View style={{backgroundColor:"transparent", height:50}}>
                            </View>

                        </View>

                    )}

                </Formik>

            </ScrollView>

        </View>
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
    dropDownCopy:{
        flexDirection:"row",
        marginTop: 5,
        alignItems:"center",
        width: "97%",
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
        borderColor:"rgba(106,120,146,0.98)",
        width: "97%",
    },
    dropDownText: {
        flexDirection:"row",
        justifyContent: 'center',
        alignItems:"center",
        height: 40,
        width: "97%",
        borderColor:"rgba(106,120,146,0.98)",
    },
    dropDownNotesText: {
        flexDirection:"row",
        justifyContent: 'center',
        alignItems:"center",
        width: "97%",
        textAlignVertical: 'top',
        fontSize:16,
        height:200,
        marginTop:5,
        borderColor:"rgba(106,120,146,0.98)",
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
        borderColor:"rgba(106,120,146,0.98)",

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
