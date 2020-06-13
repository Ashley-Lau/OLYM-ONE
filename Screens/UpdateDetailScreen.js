import React, {useState} from 'react';
import {View, Text, StyleSheet, Picker, Keyboard, TouchableWithoutFeedback, Alert, ScrollView} from 'react-native'

import {useNavigation} from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import {Formik} from 'formik';
import * as yup from 'yup';


import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import CustButton from "../Components/CustButton";
import SignUpComponent from "../Components/SignUpComponent";

const reviewSchema = yup.object({
    firstName: yup.string().label('First Name').required(),
    lastName: yup.string().label('Last Name').required(),
    email: yup.string().label('Email').email('Email is not valid').required(),
    username: yup.string().label('Username').required().min(6).max(16),
    password: yup.string().label('Password').required().min(6).max(16),
    confirmPassword: yup.string().label('Confirm Password').required()
        .oneOf([yup.ref('password'), null], 'Password must match'),
})

const UpdateDetailScreen = (props) => {
    const navigation = useNavigation()

    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    })

    const handleData = values => {
        setData({
            ...data,
            values,
        })
    }

    const registeredPress = () => {
        navigation.goBack();
    }

    return (
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <Background>
                <View style = {{alignItems: 'center', marginTop: 30}}>
                    <Text style = {style.titleStyle} >Update Details</Text>
                </View>
                <View style = {{marginTop: 20, marginHorizontal: 52}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Formik
                            initialValues = {{ firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: ''}}
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
                                    <SignUpComponent title = 'Email:'
                                                     placeholder = "Email"
                                                     onChangeText = {props.handleChange('email')}
                                                     value = {props.values.email}
                                                     onBlur = {props.handleBlur('email')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.email && props.errors.email}</Text>
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
                                    <SignUpComponent title = 'Confirm Password:'
                                                     placeholder = "Re-Enter Password"
                                                     secureTextEntry = {true}
                                                     onChangeText = {props.handleChange('confirmPassword')}
                                                     value = {props.values.confirmPassword}
                                                     onBlur = {props.handleBlur('confirmPassword')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.confirmPassword && props.errors.confirmPassword}</Text>

                                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, paddingBottom: 100}}>
                                        <GradientButton onPress={() => { registeredPress(); props.handleReset();}}
                                                        style={style.button}
                                                        colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
                                            Cancel
                                        </GradientButton>
                                        <GradientButton onPress={props.handleSubmit}
                                                        style={style.button}
                                                        colors={['#1bb479','#026c45']}>
                                            Register
                                        </GradientButton>
                                    </View>
                                </View>
                            )}
                            </Formik>
                        </ScrollView>
                </View>
            </Background>
        </TouchableWithoutFeedback>)
}

const style = StyleSheet.create({
    titleStyle: {
        fontWeight: "bold",
        fontSize: 30,
        borderBottomWidth: 4,
        borderBottomColor: 'black'
    }
})

export default UpdateDetailScreen;