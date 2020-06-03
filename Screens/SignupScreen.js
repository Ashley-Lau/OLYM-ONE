import React, {useState} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    Picker,
    Alert,
    ImageBackground,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import { useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Formik} from 'formik';
import * as yup from 'yup';

import Styles from "../styling/Styles";
import GradientButton from "../Components/GradientButton";
import CustButton from "../Components/CustButton";

const SignUpComponent = props => {
    return <View style = {{marginTop: 10, width: 300}}>
                <Text style = {{fontSize: 15, fontWeight: 'bold'}}>{props.title}</Text>
                <TextInput  style = {{marginTop: 0, fontSize:20, borderBottomWidth: 2, borderBottomColor: 'black' }}
                            placeholderTextColor = '#708090' {...props}/>
            </View>
}

const reviewSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    username: yup.string().required().min(6).max(16),
    password: yup.string().required().min(6).max(16),
    confirmPassword: yup.string().required()
        .oneOf([yup.ref('password'), null], 'password must match'),
    gender: yup.string().test('gender selector', 'Please select a gender', (val) => val === 'Male' || val === 'Female'),
    birthDate: yup.date().test('birthdate test', 'Birth date cannot be later than current date!', (val) => val < Date.now())

})
const SignupScreen = props => {
    const navigation = useNavigation()
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        gender: '',
        birthDate: new Date(),
        showTime: false,
    })

    const handleData = values => {
        setData({
            ...data,
            values,
        })
    }

    const registeredAlert = () => {
        Alert.alert(
            "Account Registered!",
            "Fuck You!"
        )
    }

    const registeredPress = () => {
        registeredAlert();
        navigation.goBack();
    }

    return (
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <ImageBackground source = {require('../assets/sunset_running_newstyle.png')} style={Styles.container}>
                <View style = {style.empty}/>
                <Animatable.View style = {style.popout} animation = "fadeInUpBig">
                    <Text style = {{fontSize: 30, borderBottomWidth: 2, borderBottomColor: 'black'}}>
                        Sign Up
                    </Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Formik
                            initialValues = {{ firstName: '', lastName: '', username: '', password: '', confirmPassword: '', gender: '', birthDate: data.birthDate, showTime: data.showTime}}
                            validationSchema = {reviewSchema}
                            onSubmit={(values, actions) => {
                                handleData(values)
                                actions.resetForm()
                                registeredPress()
                            }}
                        >
                            {(props) => (
                                <View>
                                    <SignUpComponent title = 'First Name:'
                                                     placeholder = "First Name"
                                                     onChangeText = {props.handleChange('firstName')}
                                                     value = {props.values.firstName}
                                                     onBlur = {props.handleBlur('firstName')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.firstName && props.errors.firstName}</Text>
                                    <SignUpComponent title = 'Last Name:'
                                                     placeholder = "Last Name"
                                                     onChangeText = {props.handleChange('lastName')}
                                                     value = {props.values.lastName}
                                                     onBlur = {props.handleBlur('lastName')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.lastName && props.errors.lastName}</Text>
                                    <SignUpComponent title = 'Username:'
                                                     placeholder = "6 - 16 characters"
                                                     onChangeText = {props.handleChange('username')}
                                                     value = {props.values.username}
                                                     onBlur = {props.handleBlur('username')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.username && props.errors.username}</Text>
                                    <SignUpComponent title = 'Password:'
                                                     placeholder = "Password"
                                                     secureTextEntry = {true}
                                                     onChangeText = {props.handleChange('password')}
                                                     value = {props.values.password}
                                                     onBlur = {props.handleBlur('password')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.password && props.errors.password}</Text>
                                    <SignUpComponent title = 'Confirm Passwords:'
                                                     placeholder = "Re-Enter Password"
                                                     secureTextEntry = {true}
                                                     onChangeText = {props.handleChange('confirmPassword')}
                                                     value = {props.values.confirmPassword}
                                                     onBlur = {props.handleBlur('confirmPassword')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.confirmPassword && props.errors.confirmPassword}</Text>
                                    <View style = {{flexDirection: 'row', marginRight: 105,}}>
                                        <Text style = {{fontSize: 20, fontWeight: 'bold',marginTop: 20}}>Gender: </Text>
                                        <View style = {style.dropDown}>
                                            <Picker
                                                selectedValue={props.values.gender}
                                                style={{ height: 50, width: 130, }}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    props.setFieldValue('gender', itemValue)
                                                    props.setFieldTouched('gender')
                                                }}
                                            >
                                                <Picker.Item label="Select" value=""/>
                                                <Picker.Item label="Male" value="Male" />
                                                <Picker.Item label="Female" value="Female" />
                                            </Picker>
                                        </View>
                                    </View>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.gender && props.errors.gender}</Text>
                                    <View style = {{flexDirection: 'row', marginRight: 30,}}>
                                        <Text style = {{fontSize: 20, fontWeight: 'bold',marginTop: 20}}> Date of Birth: </Text>
                                        <CustButton onPress = {() => {  props.setFieldValue('showTime', true)}}
                                                    style = {{borderRadius: 0, width: 150, backgroundColor: 'ghostwhite', borderWidth: 1, marginTop:10}}>
                                            <Text style = {{color: 'black'}}>{props.values.birthDate.toLocaleDateString()}</Text>
                                        </CustButton>
                                    </View>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.birthDate && props.errors.birthDate}</Text>

                                    {props.values.showTime && <DateTimePicker value={props.values.birthDate}
                                                                 mode={'date'}
                                                                 display="spinner"
                                                                 onChange={(event, selectedDate) => {
                                                                     const currentDate = selectedDate || props.values.birthDate;
                                                                     props.setFieldValue('showTime',Platform.OS !== 'android');
                                                                     props.setFieldValue('birthDate', currentDate);
                                                                     props.setFieldTouched('birthDate');}}/>}

                                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, paddingBottom: 20}}>
                                        <GradientButton onPress={() => {
                                            registeredPress()
                                            props.handleReset()}}
                                                        style={style.button}
                                                        colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
                                            Cancel
                                        </GradientButton>
                                        <GradientButton onPress={props.handleSubmit}
                                                        style={style.button}
                                                        colors={['rgb(3,169,177)', 'rgba(1,44,109,0.85)']}>
                                            Register
                                        </GradientButton>
                                    </View>
                            </View>
                            )}
                        </Formik>
                    </ScrollView>
                </Animatable.View>
            </ImageBackground>
        </TouchableWithoutFeedback>
    )
};

export default SignupScreen;

const style = StyleSheet.create({
    popout: {
        flex: 6,
        width: '100%',
        backgroundColor: '#FFFFFF80',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        alignItems: 'center',
        opacity: 0.6,
    },
    empty: {
        flex: 1,
    },
    dropDown: {
        marginTop: 18,
        justifyContent: 'center',
        backgroundColor: 'ghostwhite',
        height: 33,
        borderWidth: 1,
        width: 120,
    },
    button: {
        width: 100,
    }
})
