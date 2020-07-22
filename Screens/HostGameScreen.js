import React,{useState, useEffect} from 'react';
import {
    Text,
    StyleSheet,
    Modal,
    View,
    ScrollView,
    Dimensions,
    Alert,
    TouchableOpacity,
    Animated,
} from 'react-native';

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
import {Autocomplete, AutocompleteItem, Select, SelectItem, Input, Datepicker, Icon} from '@ui-kitten/components';
import {mrtStations} from "../Components/SearchBarFunctions";
import Ionicons from "react-native-vector-icons/Ionicons";
import {MaterialCommunityIcons} from "react-native-vector-icons";

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

    // Animation for the header
    const HEADER_MAX_HEIGHT = 45
    const scrollY = new Animated.Value(0)
    const diffClamp = Animated.diffClamp(scrollY, 0, HEADER_MAX_HEIGHT * 10)
    const headerHeight = diffClamp.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT / 2,HEADER_MAX_HEIGHT],
        outputRange: ['rgba(226,147,73,0)', 'rgba(226,147,73,0.5)' ,'rgba(226,147,73, 1.0)'],
    })

    //NAVIGATION ===================================================================================================
    const navigation = useNavigation()

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
    const referee =["No", "Yes"]

    const [sportsIndex, setSportsIndex] = useState();
    const [refIndex, setRefIndex] = useState();

    // UPDATING THE GAME ITEM AND DETAIL ==============================================================================================================
    const handleCreateGame = values => {
        values.sport === "Others"
        ?

        firebaseDb.firestore()
            .collection('game_details')
            .add({
                sport: values.specificSport,
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
            .then(successfullyHostedGame)
            .catch(err => console.error(err))
        :
            firebaseDb.firestore()
                .collection('game_details')
                .add({
                    sport: values.sport,
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
                .then(() => {successfullyHostedGame()})
                .catch(err => console.error(err))
    }

    const successfullyHostedGame= () => {
        navigation.goBack()
        Alert.alert("Game has been hosted successfully",
            "Refer to upcoming games section in Home page to view hosted game.",
            [
                {
                    text: "Confirm",
                    onPress: () => {}
                }
            ],
            {cancelable: false}
        )
    }

    const header = (title) => (
        <Text style = {{fontSize: 15, fontWeight: 'bold', marginTop: 10,}}>{title} </Text>
    )

    const timeConverter = (date) => {
        const fullHours = date.getHours()
        const hours = fullHours > 12 ? fullHours % 12 : fullHours
        const nicerHours = hours === 0 ? '0' + hours : hours
        const suffix = (fullHours >= 12)? ' PM' : ' AM';
        const minutes = date.getMinutes()
        return nicerHours + ':' + (minutes > 10 ? minutes : '0' + minutes) + suffix
    }

    return(
    <View>
            {/*=================================header ===============================================*/}
        <Animated.View style = {{
            ...Styles.animatedHeaderStyle,
            backgroundColor: headerHeight,
        }}>
            <View style = {{...Styles.innerHeaderStyle,}}>
                {/*==================================================back button==========================================*/}
                <TouchableOpacity style = {{alignItems: 'center', flexDirection: 'row',position: 'absolute', left: 10, bottom: Platform.OS === 'ios'? -2 : 0}}
                                  onPress = {navigation.goBack}
                                  activeOpacity= {0.8}>
                    <Ionicons name="ios-arrow-back" color={'white'} size={27} />
                    <Text style = {{fontSize: 20, marginLeft: 6, color: 'white'}}>Back</Text>
                </TouchableOpacity>
                <Text style = {{...styles.titleStyle, }}> Host Game </Text>
            </View>
        </Animated.View>
        <ScrollView showsVerticalScrollIndicator={false}
                    bounces = {false}
                    style = {{height: '100%', }}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: scrollY}}}]
                    )}
                    scrollEventThrottle={16}>
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
                        }
                        }
                >
                    {(props) => (
                        <View style = {{top: Styles.statusBarHeight.height + 60, paddingBottom: Styles.statusBarHeight.height + 60, alignItems: 'center'}}>
                            {/*// LOCATION ------------------------------------------------------------------------*/}
                            <View style={styles.inputContainer}>
                                <LocationSearch
                                    label = {() => header('Zone: ')}
                                    placeholder='Select a zone'
                                    select = {(val) => props.setFieldValue('location', val)}
                                    onBlur = {props.handleBlur('location')}
                                    accessoryRight={(props) => (
                                        <Icon {...props} name='map-outline'/>
                                    )}
                                />
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.location && props.errors.location}</Text>
                            </View>

                            {/*// SPECIFIC LOCATION ------------------------------------------------------------------------*/}

                            <View style={styles.inputContainer}>
                                <Input placeholder={"Eg. Hougang Stadium,"}
                                       onChangeText={props.handleChange('specificLocation')}
                                       value={props.values.specificLocation}
                                       onBlur = {props.handleBlur('specificLocation')}
                                       label = {() => header('Specific Location: ')}
                                       accessoryRight={(props) => (
                                           <Icon {...props} name='pin-outline'/>
                                       )}
                                />
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.specificLocation && props.errors.specificLocation}</Text>
                            </View>

                            {/*// SPORT ------------------------------------------------------------------------*/}
                            <View style={styles.inputContainer}>
                                <Select
                                    label = {() => header('Sport: ')}
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
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.sport && props.errors.sport}</Text>
                            </View>

                            {/*// OTHER SPORTS ------------------------------------------------------------------------*/}

                            {props.values.sport === "Others"
                            ?
                                <View style={styles.inputContainer}>
                                    <Input
                                        label = {() => header('Specific Sport: ')}
                                           placeholder={"Please fill in if your chose 'Others' for sport"}
                                           onChangeText={props.handleChange('specificSport')}
                                           value={props.values.specificSport}
                                           onBlur = {props.handleBlur('specificSport')}
                                    />
                                    {props.touched.specificSport && props.values.specificSport === ''
                                        ?
                                        <Text style={{color:"red", fontSize:15}}>Please enter a sport!</Text>
                                        :
                                        <View/>
                                    }
                                </View>
                            :
                               null
                            }
                            <View style = {{...styles.inputContainer,}}>
                                <View style = {{flexDirection:'row', justifyContent: 'space-between' }}>

                                    {/*// DATE ------------------------------------------------------------------------------*/}
                                    <View style={{...styles.inputContainer, width: '45%'}}>
                                        <Datepicker
                                            label= {() => <Text style = {{fontSize: 15, fontWeight: 'bold', marginTop: 10,}}>Date: </Text>}
                                            placeholder='Pick Date'
                                            date={props.values.date}
                                            onSelect={nextDate => {
                                                props.setFieldValue('birthDate', nextDate);
                                                props.setFieldTouched('birthDate');
                                            }}
                                            accessoryRight={(props) => (
                                                <Icon {...props} name='calendar'/>
                                            )}
                                        />
                                    </View>

                                    {/*//TIME ------------------------------------------------------------------------*/}

                                    <View style={{...styles.inputContainer, width: '45%'}}>
                                        {header('Time: ')}
                                        <CustButton onPress = {() => props.setFieldValue('showTime', true)}
                                                    style = {styles.dropDown}>
                                            <Text style = {{color: '#8F9BB3', fontSize: 16, flexDirection: 'row'}}>
                                                {timeConverter(props.values.date)}
                                            </Text>
                                        </CustButton>
                                    </View>
                                </View>
                                <Text style={{fontSize: 15, color: 'red'}}>{ props.touched.date && props.errors.date }</Text>
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
                                                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, paddingBottom: 20, flex: 1}}>
                                                    <GradientButton onPress={() => props.setFieldValue('showTime',false)}
                                                                    style={styles.button}
                                                                    colors={['#e52d27', '#b31217']}>
                                                        Cancel
                                                    </GradientButton>
                                                    <GradientButton onPress={() => props.setFieldValue('showTime',false)}
                                                                    style={styles.button}
                                                                    colors={['#ff8400','#e56d02']}>
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


                            <View style={styles.inputContainer}>
                                <Input keyboardType={"number-pad"}
                                       placeholder={"0.00"}
                                       onChangeText={props.handleChange('price')}
                                       value={props.values.price}
                                       onBlur = {props.handleBlur('price')}
                                       label = {() => header('Price: ')}
                                       accessoryRight={(props) => (
                                           <Icon {...props} name='pricetags-outline'/>
                                       )}
                                />
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.price && props.errors.price}</Text>
                            </View>

                            {/*// NUMBER OF PLAYERS REQUIRED ------------------------------------------------------------------------*/}

                            <View style = {styles.inputContainer}>
                                <Input keyboardType={"number-pad"}
                                       placeholder={"0"}
                                       onChangeText={props.handleChange('slots')}
                                       value={props.values.slots}
                                       onBlur = {props.handleBlur('slots')}
                                       label = {() => header('Number of players required: ')}
                                       accessoryRight={(props) => (
                                           <Icon {...props} name='people-outline'/>
                                       )}
                                />
                                <Text style={{fontSize: 15, color: 'red'}}>{props.touched.slots && props.errors.slots}</Text>
                            </View>

                            {/*//NOTES----------------------------------------------------------------------------*/}
                            <View style = {styles.inputContainer}>
                                <Input
                                    multiline={true}
                                    placeholder={"Additional information for players"}
                                    // textStyle={{height: 60, alignItems: 'flex-start'}}
                                    onChangeText = {props.handleChange('notes')}
                                    value = {props.values.notes}
                                    label = {() => header('Notes: ')}
                                    accessoryRight={(props) => (
                                        <Icon {...props} name='edit-outline'/>
                                    )}
                                />
                            </View>

                            {/*REFEREE OPTION =========================================================================*/}

                            <View style={{...styles.inputContainer, marginTop: 15}}>
                                <Select
                                    style = {{width: "100%", justifyContent:"space-between"}}
                                    placeholder='No'
                                    value ={referee[refIndex - 1]}
                                    onSelect={index => {
                                        setRefIndex(index)
                                        props.setFieldValue('referee', referee[index.row])
                                    }}
                                    selectedIndex={refIndex}
                                    label = {() => header('Do you need a referee? ')}
                                >
                                    {referee.map(opt => (
                                        <SelectItem key={opt} title={opt}/>
                                    ))}
                                </Select>
                            </View>

                            {props.values.referee === "Yes"
                            ?
                                <View style ={{...styles.inputContainer, marginTop: 15}}>
                                    <Input
                                               keyboardType={"number-pad"}
                                               placeholder={"1"}
                                               onChangeText={props.handleChange('refereeSlots')}
                                               value={props.values.refereeSlots}
                                               onBlur = {props.handleBlur('refereeSlots')}
                                               label = {() => header('Number of referees required: ')}
                                               accessoryRight={(props) => (
                                                   <Icon {...props} name='people-outline'/>
                                               )}
                                    />
                                </View>
                            :
                                <View/>
                            }




                            {/*//BUTTONS at the Bottom------------------------------------------------------------------------*/}
                            <GradientButton onPress={props.handleSubmit}
                                            colors ={['#ff8400','#e56d02']}
                                            style={{...styles.button, width: '80%'}}>
                                <Text>Host</Text>
                            </GradientButton>
                        </View>
                    )}
                </Formik>
            </Background>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleStyle: {
        color: 'white',
        justifyContent: 'center',
        fontSize: 21,
        fontWeight: "bold",
    },
    inputContainer:{
        width: "92%",
    },
    dropDown: {
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'ghostwhite',
        width: '100%',
        height: 39,
        borderWidth: 1,
        borderRadius:4,
        borderColor:"#e3e3e3",
    },
    selectionItem:{
        flexDirection:"column",
        alignItems:"flex-start",
        justifyContent:"center",
        marginLeft:8,
        marginTop:10
    },
    button: {
        width: '40%',
        height: 50,
        borderRadius: 25,
        marginTop: 30,
        marginBottom: 50,
    }
})

export default HostGameScreen;
