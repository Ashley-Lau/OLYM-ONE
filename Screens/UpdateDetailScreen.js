import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    Image,
    TouchableOpacity,
    Picker, TextInput
} from 'react-native'

import {useNavigation} from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import {Formik} from 'formik';
import * as yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import SignUpComponent from "../Components/SignUpComponent";
import {setFormikInitialValue} from "react-native-formik";
import { Select, SelectItem } from '@ui-kitten/components';


const reviewSchema = (password) => yup.object({
    firstName: yup.string().label('First Name').required(),
    lastName: yup.string().label('Last Name').required(),
    username: yup.string().label('Username').required().min(6).max(16),
    newPassword: yup.string().label('Password').min(6).max(16),
    confirmPassword: yup.string().label('Confirm Password')
        .oneOf([yup.ref('newPassword'), null], 'New Passwords must match'),
    currentPassword: yup.string().label('Current Password')
        .when('confirmPassword', {
            is: val=> val !== undefined ,
            then: yup.string().required().test("Checker", 'Current Password does not match', val => val === password),
            otherwise: yup.string().notRequired(),
        }),
})

const UpdateDetailScreen = (props) => {
    //ARRAY FOR SPORTS ==========================================================================================
    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"];
    const refereeOption = ["Yes", "No"];
    const [refereeIndex, setIndex] = useState();
    const [sportIndex, setSportIndex] = useState();
    //===================================================================================================
    const navigation = useNavigation()

    const registeredPress = () => {
        navigation.navigate('ProfileScreen');
    }

    return (
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <Background>
                <View style = {{marginTop: 20, alignItems: 'center'}}>
                            <Text style = {style.titleStyle} >Update Details</Text>
                        <Formik
                            initialValues = {{
                                uri: props.route.params.data.uri,
                                firstName: props.route.params.data.firstName,
                                lastName: props.route.params.data.lastName,
                                username: props.route.params.data.username,
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                            }}
                            validationSchema = {reviewSchema(props.route.params.data.password)}
                            onSubmit={(values, actions) => {
                                props.route.params.handler({
                                    firstName: values.firstName,
                                    lastName: values.lastName,
                                    username: values.username,
                                    password: values.confirmPassword,
                                    uri: values.uri,
                                })
                                actions.resetForm()
                                registeredPress()
                            }}
                        >
                            {(props) => (
                                <View style = {{width: 300}}>
                                    <View style = {{...style.photoFrame, marginBottom: 15}}>
                                        <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {{
                                            uri: props.values.uri
                                        }}/>
                                    </View>
                                    {/*======================================change profile picture button=========================*/}
                                    <View style = {{alignSelf: 'center', justifyContent: 'center'}}>
                                        <TouchableOpacity style={{width: 75, height: 25, justifyContent: 'center', alignSelf: 'center'}}
                                                          onPress={ async () => {
                                                              let result = await ImagePicker.launchImageLibraryAsync({
                                                                  mediaTypes: ImagePicker.MediaTypeOptions.All,
                                                                  allowsEditing: true,
                                                                  aspect: [4, 3],
                                                                  quality: 1,
                                                                  base64: true,
                                                              });

                                                              if (!result.cancelled) {
                                                                  let base64Img = `data:image/jpg;base64,${result.base64}`

                                                                  let apiUrl = 'https://api.cloudinary.com/v1_1/ashley451/image/upload';

                                                                  let data = {
                                                                      "file": base64Img,
                                                                      "upload_preset": "tv5hjb8n",
                                                                  }

                                                                  fetch(apiUrl, {
                                                                      body: JSON.stringify(data),
                                                                      headers: {
                                                                          'content-type': 'application/json'
                                                                      },
                                                                      method: 'POST',
                                                                  }).then(async r => {
                                                                      let data = await r.json()
                                                                      props.setFieldValue('uri', data.url);
                                                                  }).catch(err=>console.log(err))
                                                              }
                                                          }}
                                                          activeOpacity={.9}>
                                            <LinearGradient style = {{borderRadius: 4, flex: 1, justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 10,}} colors ={['#1bb479','#026c45']}>
                                                <Text style={{fontSize: 15, color: 'white', }}>Change</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
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
                                    <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold', marginBottom: 10,}}>Fill in this section to update your password(Optional).</Text>
                                    <SignUpComponent title = 'Current Password:'
                                                     placeholder = "Current Password"
                                                     secureTextEntry = {true}
                                                     onChangeText = {props.handleChange('currentPassword')}
                                                     value = {props.values.currentPassword}
                                                     onBlur = {props.handleBlur('password')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.currentPassword && props.errors.currentPassword}</Text>
                                    <SignUpComponent title = 'New Password:'
                                                     placeholder = "New Password"
                                                     secureTextEntry = {true}
                                                     onChangeText = {props.handleChange('newPassword')}
                                                     value = {props.values.newPassword}
                                                     onBlur = {props.handleBlur('password')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.newPassword && props.errors.newPassword}</Text>
                                    <SignUpComponent title = 'Confirm New Password:'
                                                     placeholder = "Re-Enter Password"
                                                     secureTextEntry = {true}
                                                     onChangeText = {props.handleChange('confirmPassword')}
                                                     value = {props.values.confirmPassword}
                                                     onBlur = {props.handleBlur('confirmPassword')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.confirmPassword && props.errors.confirmPassword}</Text>

                                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 15, paddingBottom: 100}}>
                                        <GradientButton onPress={() => { registeredPress(); props.handleReset();}}
                                                        style={style.button}
                                                        colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
                                            Cancel
                                        </GradientButton>
                                        <GradientButton onPress={() => {
                                            props.handleSubmit()
                                        }}
                                                        style={style.button}
                                                        colors={['#1bb479','#026c45']}>
                                            Update
                                        </GradientButton>
                                    </View>
                                </View>
                            )}
                            </Formik>

                </View>
            </Background>
            </ScrollView>
        </TouchableWithoutFeedback>)
}

const style = StyleSheet.create({
    titleStyle: {
        fontWeight: "bold",
        fontSize: 30,
        color: 'white',
        alignSelf: 'center',
        marginBottom: 20,
    },
    photoFrame: {
        height: 85,
        width: 85,
        borderRadius: 170,
        elevation: 30,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.34,
        shadowRadius: 3.27,
        justifyContent: 'center',
        backgroundColor: 'white',
        alignSelf: 'center'
    },
    dropDownCopy:{
        flexDirection:"row",
        marginTop: 5,
        alignItems:"center",
        width: "97%",
    },
    dropDown: {
        flexDirection: "row",
        marginTop: 5,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: 'transparent',
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        width: "95%",
    }
})

export default UpdateDetailScreen;
