import React,{useState, useEffect} from 'react';
import {Text, TextInput, StyleSheet, Modal, View, ScrollView, Dimensions, Alert, TouchableOpacity, SafeAreaView} from 'react-native';

import {useNavigation} from "@react-navigation/native";
import GradientButton from "../Components/GradientButton";
import Background from "../views/Background";
import Styles from "../styling/Styles";

import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from '@react-native-community/datetimepicker';
import {Formik} from 'formik';
import * as yup from 'yup'
import CustButton from "../Components/CustButton";
import firebaseDb from "../firebaseDb";
import {Autocomplete, AutocompleteItem, Select, SelectItem, Input} from '@ui-kitten/components';
import {mrtStations} from "../Components/SearchBarFunctions";
import Ionicons from "react-native-vector-icons/Ionicons";

const sHeight = Dimensions.get('window').height

const filter = (item, query) => item.title.toLowerCase().includes(query.toLowerCase());

const LocationSearch = (props) => {
    const [value, setValue] = useState('');
    const [data, setData] = useState(mrtStations);

    const onSelect = (index) => {
        setValue(data[index].title);
        props.select(data[index].title)
    };

    const onChangeText = (query) => {
        setValue(query);
        setData(mrtStations.filter(item => filter(item, query)));
    };

    const renderOption = (item, index) => (
        <AutocompleteItem
            key={index}
            title={item.title}
        />
    );

    return <Autocomplete
        placement = {'bottom start'}
        value={value}
        onChangeText={onChangeText}
        onSelect={onSelect}
        {...props}
    >
        {data.map(renderOption)}
    </Autocomplete>
}

const reviewSchema = yup.object({
    location: yup.string().label('Zone')
        .test('InputZone', 'Please select a valid zone!', (location) => location === undefined ? false :
            mrtStations.filter(item => item.title === location).length === 1)
    ,
    specificLocation: yup.string().label('Specific Location').required(),
    sport: yup.string().label('Sport').test('selectSport', 'Please select a sport!', (sport) => sport != ''),
    date: yup.date().label('Date').test('test date', 'The Game Cannot Be Earlier Than Now!', (val) => val > Date.now()),
    time: yup.date().label('Time'),
    price: yup.string().label('Price')
        .test('Valid Price', 'Please enter a valid price!', (val) => parseInt(val) >= 0 && !(val).includes(",")),
    slots: yup.string().label('Slots')
        .test('Valid Slots', 'Please enter a valid number of players!',  (val) => parseInt(val) > 0 && !(val).includes(",")),
    notes: yup.string(),

})


const HostGameScreen = props => {

    const [data, setData] = useState({})


    useEffect(() => {
            firebaseDb.firestore().collection('users').doc(props.route.params.uid).get()
                .then((doc) => {
                    const newData = doc.data()
                    setData(newData)
                    // console.log(newData)
                    // console.log(0)
                })
                .catch(error => console.log(error))
        }
    , [])

    //NAVIGATION ===================================================================================================
    const navigation = useNavigation()

    const registeredPress = () => {
        navigation.goBack();
    }

    //CHECKS FOR IOS PLATFORM ========================================================================================================================
    const isIos = Platform.OS === 'ios'

    //FUNCTION TO CONVERT TIME TO SINGAPORE TIME ==============================================================================================
    const sgTime = (date) => {
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        const sgTime = new Date(utc + (3600000*8));
        return sgTime;
    }

    //ARRAY FOR PICKER ==============================================================================================================

    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"]
    const referee =["NO", "YES"]

    const [sportsIndex, setSportsIndex] = useState();
    const [refIndex, setRefIndex] = useState();

    // UPDATING THE GAME ITEM AND DETAIL ==============================================================================================================
    const handleCreateGame = values => {
        values.sport === "Others"
        ?

        firebaseDb.firestore()
            .collection('game_details')
            .add({
                sport: values.specificSport.toLowerCase(),
                location: values.location,
                specificLocation: values.specificLocation,
                notes: values.notes,
                availability : values.slots,
                date: sgTime(values.date),
                host: data.username,
                price: values.price,
                players: [data.id],
                hostId: data.id,
                referee: values.referee,
                refereeSlots:values.refereeSlots,
                refereeList: [],
                applicants:[]
            })
            .then(() => {registeredPress()})
            .catch(err => console.error(err))
        :
            firebaseDb.firestore()
                .collection('game_details')
                .add({
                    sport: values.sport.toLowerCase(),
                    location: values.location,
                    specificLocation: values.specificLocation,
                    notes: values.notes,
                    availability : values.slots,
                    date: sgTime(values.date),
                    host: data.username,
                    price: values.price,
                    players: [data.id],
                    hostId: data.id,
                    referee: values.referee,
                    refereeSlots:values.refereeSlots,
                    refereeList: [],
                    applicants:[]
                })
                .then(() => {registeredPress()})
                .catch(err => console.error(err))

    }

    return( <SafeAreaView>
        <ScrollView>
        <Background >
                <Formik initialValues={{
                    location: '',
                    specificLocation: '',
                    sport:'Select',
                    specificSport:'',
                    price:'',
                    slots:'',
                    date:new Date(),
                    notes:'',
                    showDate: false,
                    showTime: false,
                    referee:"NO",
                    refereeSlots:'1'
                }}
                        validationSchema={reviewSchema}
                        onSubmit={(values, actions) => {
                            handleCreateGame(values);
                            actions.resetForm();
                        }
                        }
                >
                    {(props) => (
                        <View>
                            <View style = {{width: '100%', height: 50, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom:15}}>
                                {/*==================================================back button==========================================*/}
                                <TouchableOpacity style = {{alignItems: 'center', height: '100%', flexDirection: 'row', left: 10, position: 'absolute'}}
                                                  onPress={() => {
                                                      props.handleReset();
                                                      registeredPress();}}
                                                  activeOpacity= {0.8}>
                                    <Ionicons name="ios-arrow-back" color={'white'} size={30} />
                                    <Text style = {{fontSize: 22, marginLeft: 6, color: 'white'}}>Back</Text>
                                </TouchableOpacity>
                                <Text style = {{...styles.titleStyle, }}> Host Game </Text>
                                {/*=============================================profile picture of other user====================================================*/}
                            </View>

                            {/*// LOCATION ------------------------------------------------------------------------*/}
                            <View style={{...styles.selectionItem, marginTop: 0}}>
                                <Text style={{fontSize:15, marginLeft:8}}>ZONE :</Text>
                                <View style={{width: '97%',marginTop: 5}}>
                                    <LocationSearch
                                        placeholder='Select a zone'
                                        select = {(val) => props.setFieldValue('location', val)}
                                        onBlur = {props.handleBlur('location')}
                                    />
                                </View>
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.location && props.errors.location}</Text>
                            </View>

                            {/*// SPECIFIC LOCATION ------------------------------------------------------------------------*/}

                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>SPECIFIC LOCATION  :</Text>
                                <View style={{...styles.dropDown, padding:5}}>
                                    <TextInput placeholder={"Input the specific location"}
                                               style={{...styles.dropDownText, fontSize:16}}
                                               onChangeText={props.handleChange('specificLocation')}
                                               value={props.values.specificLocation}
                                               onBlur = {props.handleBlur('specificLocation')}
                                    />
                                </View>
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.specificLocation && props.errors.specificLocation}</Text>
                            </View>


                            {/*// SPORT ------------------------------------------------------------------------*/}
                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>SPORT :</Text>
                                <View style={styles.dropDownCopy}>

                                    <Select
                                        style = {{width: "100%", justifyContent:"space-between"}}
                                        placeholder='Sports'
                                        value ={sports[sportsIndex - 1]}
                                        onSelect={index => {
                                            setSportsIndex(index)
                                            props.setFieldValue('sport', sports[index.row])
                                        }}
                                        selectedIndex={sportsIndex}>
                                        {sports.map(sport => (
                                            <SelectItem key={sport} title={sport}/>
                                        ))}

                                    </Select>

                                </View>
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.sport && props.errors.sport}</Text>
                            </View>

                            {/*// OTHER SPORTS ------------------------------------------------------------------------*/}

                            {props.values.sport === "Others"
                            ?

                                <View style={{...styles.selectionItem, marginTop: 5}}>
                                    <Text style={{fontSize:15, marginLeft:8}}>SPECIFIC SPORT :</Text>
                                    <View style={{...styles.dropDown, padding:5}}>
                                        <TextInput
                                                   placeholder={"Please fill in if your chose 'Others' for sport"}
                                                   style={{...styles.dropDownText, fontSize:16}}
                                                   onChangeText={props.handleChange('specificSport')}
                                                   value={props.values.specificSport}
                                                   onBlur = {props.handleBlur('specificSport')}
                                        />
                                    </View>
                                    {props.touched.specificSport && props.values.specificSport === ''
                                    ?
                                        <Text style={{color:"red", fontSize:15}}>Please enter a sport!</Text>
                                    :
                                        <View/>
                                    }


                                </View>
                            :
                               <View></View>

                            }

                            {/*// DATE AND TIME ------------------------------------------------------------------------*/}

                            <View style={{...styles.selectionItem, marginTop:15}}>
                                <Text style={{fontSize:15, marginLeft:8}}>DATE :</Text>
                                <CustButton onPress = {() => props.setFieldValue('showDate', true)}
                                            style = {styles.dropDown}>
                                    <Text style = {{color: 'black', }}>{props.values.date.toLocaleDateString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                                </CustButton>
                                <Text style={{fontSize: 15, color: 'red'}}>{ props.touched.date && props.errors.date }</Text>
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
                                                                    style={styles.button}
                                                                    colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
                                                        Cancel
                                                    </GradientButton>
                                                    <GradientButton onPress={() => props.setFieldValue('showDate',false)}
                                                                    style={styles.button}
                                                                    colors={['#1bb479','#026c45']}>
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
                                                                mode={'time'}
                                                                display="spinner"
                                                                onChange={(event, selectedDate) => {
                                                                    const currentDate = selectedDate || props.values.date;
                                                                    props.setFieldValue('date', currentDate);
                                                                    props.setFieldTouched('date');}}/>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, paddingBottom: 20}}>
                                                    <GradientButton onPress={() => props.setFieldValue('showTime',false)}
                                                                    style={styles.button}
                                                                    colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
                                                        Cancel
                                                    </GradientButton>
                                                    <GradientButton onPress={() => props.setFieldValue('showTime',false)}
                                                                    style={styles.button}
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
                                        placeholder={"Additional information for players"}
                                        style={{...styles.dropDownNotesText}}
                                        onChangeText = {props.handleChange('notes')}
                                        value = {props.values.notes}
                                    />
                                </View>

                            </View>

                            {/*REFEREE OPTION =========================================================================*/}

                            <View style={styles.selectionItem}>
                                <Text style={{fontSize:15, marginLeft:8}}>DO YOU NEED A REFEREE:</Text>
                                <View style={styles.dropDownCopy}>

                                    <Select
                                        style = {{width: "100%", justifyContent:"space-between"}}
                                        placeholder='No'
                                        value ={referee[refIndex - 1]}
                                        onSelect={index => {
                                            setRefIndex(index)
                                            props.setFieldValue('referee', [referee[index.row]])
                                        }}
                                        selectedIndex={refIndex}>
                                        {referee.map(opt => (
                                            <SelectItem key={opt} title={opt}/>
                                        ))}

                                    </Select>

                                </View>
                            </View>

                            {props.values.referee == "YES"
                            ?
                                <View style={styles.selectionItem}>
                                    <Text style={{fontSize:15, marginLeft:8}}>NO. OF REFEREES :</Text>
                                    <View style ={{...styles.dropDown}}>
                                        <TextInput
                                                   keyboardType={"number-pad"}
                                                   placeholder={"1"}
                                                   style={{...styles.dropDownText, fontSize:16}}
                                                   onChangeText={props.handleChange('refereeSlots')}
                                                   value={props.values.refereeSlots}
                                                   onBlur = {props.handleBlur('refereeSlots')}
                                        />
                                    </View>

                                </View>
                            :
                                <View/>
                            }




                            {/*//BUTTONS at the Bottom------------------------------------------------------------------------*/}
                            <GradientButton onPress={props.handleSubmit}
                                            colors ={['#ff8400','#e56d02']}
                                            style={{...styles.button,}}>
                                <Text>Host</Text>
                            </GradientButton>
                        </View>
                    )}
                </Formik>
            </Background>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    titleStyle: {
        color: 'white',
        justifyContent: 'center',
        fontSize: 25,
        fontWeight: "bold",
        marginRight: 2
    },
    dropDownCopy:{
        flexDirection:"row",
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
    },
    button: {
        width: '80%',
        height: 50,
        borderRadius: 25,
        marginTop: 20,
        marginBottom: 50,
    }
})

export default HostGameScreen;
