import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity,
    Animated,
    StatusBar
} from 'react-native'

import {useNavigation} from "@react-navigation/native";
import Styles from '../styling/Styles';
import DateTimePicker from "@react-native-community/datetimepicker";

import {Formik} from 'formik';
import * as yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {setFormikInitialValue} from "react-native-formik";
import { Select, SelectItem, Spinner} from '@ui-kitten/components';

import {Ionicons, MaterialCommunityIcons} from "react-native-vector-icons";
// import MaterialCommunityIcons

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import SignUpComponent from "../Components/SignUpComponent";

const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight


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

const ProfileScreen = (props) => {
    const navigation = useNavigation()
    const [isProfile, setIsProfile] = useState(true)
    const [changingPicture, setChangingPicture] = useState(false)
    const email = props.route.params.data.email

    // Animation for the header
    const HEADER_MAX_HEIGHT = 45
    const scrollY = new Animated.Value(0)
    const diffClamp = Animated.diffClamp(scrollY, 0, HEADER_MAX_HEIGHT * 10)
    const headerHeight = diffClamp.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT / 2,HEADER_MAX_HEIGHT],
        outputRange: ['rgba(226,147,73,0)', 'rgba(226,147,73,0.5)' ,'rgba(226,147,73, 1.0)'],
    })


    const registeredPress = () => {
        navigation.navigate('HomeScreen');
    }

    return (
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
                setIsProfile(!isProfile)
            }}
        >
            {(props) => (
            <View >
                {/*======================================== Header ===================================================*/}
                <Animated.View style = {{
                    ...Styles.animatedHeaderStyle,
                    backgroundColor: headerHeight,
                }}>
                    <View style = {{...Styles.innerHeaderStyle,}}>
                        {/*==================================================back button==========================================*/}
                        <TouchableOpacity style = {{alignItems: 'center', flexDirection: 'row',position: 'absolute', left: 10, bottom: Platform.OS === 'ios'? -2 : 0}}
                                          onPress = {() => registeredPress()}
                                          activeOpacity= {0.8}>
                            <Ionicons name="ios-arrow-back" color={'white'} size={27} />
                            <Text style = {{fontSize: 20, marginLeft: 6, color: 'white'}}>Back</Text>
                        </TouchableOpacity>
                        <Text style = {{...style.titleStyle,}}> {isProfile ? 'Profile': 'Edit Profile'} </Text>
                        <TouchableOpacity style = {{alignItems: 'center', position: 'absolute', right: 10}}
                                          activeOpacity= {0.8}
                                          onPress={() => {
                                              if (!isProfile) {
                                                  props.handleReset()
                                              }
                                              setIsProfile(!isProfile)
                                          }}>
                            {isProfile
                                ? <MaterialCommunityIcons name = "account-edit" color={'white'} size={28} />
                                : <Text style = {{fontSize: 20, color: 'white'}}>Cancel</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <ScrollView showsVerticalScrollIndicator={false}
                            bounces = {false}
                            style = {{height: '100%', }}
                            onScroll={Animated.event(
                                [{nativeEvent: {contentOffset: {y: scrollY}}}]
                            )}
                            scrollEventThrottle={16}
                >
                    <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
                        <Background >
                            <View style = {{alignItems: 'center', flex: 1, top: statusBarHeight + 90}}>
                                <View style = {{width: 300,}}>
                                    <View style = {{...style.photoFrame, marginBottom: 5}}>
                                            <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {{
                                                uri: props.values.uri
                                            }}/>
                                    </View>
                                    {/*======================================change profile picture button=========================*/}
                                    {isProfile ? <Text style = {{height: 30}}> </Text> :
                                    <TouchableOpacity style={{height: 30, justifyContent: 'center', alignSelf: 'center',}}
                                                      onPress={ async () => {
                                                          let result = await ImagePicker.launchImageLibraryAsync({
                                                              mediaTypes: ImagePicker.MediaTypeOptions.All,
                                                              allowsEditing: true,
                                                              aspect: [4, 3],
                                                              quality: 1,
                                                              base64: true,
                                                          });

                                                          if (!result.cancelled) {
                                                              setChangingPicture(true)
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
                                                                  setChangingPicture(false)
                                                              }).catch(err=>console.log(err))
                                                          }
                                                      }}
                                                      activeOpacity={.9}>
                                        <Text style={{fontSize: 15, color: 'orange', fontWeight: 'bold', textAlign: 'center'}}>
                                            {!changingPicture ? 'Edit': <Spinner status='warning' size = 'small'/>}
                                        </Text>
                                    </TouchableOpacity>}
                                    <Text style = {{fontSize: 27, fontWeight: 'bold', marginBottom: 20}}>Account Information </Text>
                                    <SignUpComponent title = 'First Name:'
                                                     placeholder = "First Name"
                                                     onChangeText = {props.handleChange('firstName')}
                                                     value = {props.values.firstName}
                                                     editable= {!isProfile}
                                                     onBlur = {props.handleBlur('firstName')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.firstName && props.errors.firstName}</Text>
                                    <SignUpComponent title = 'Last Name:'
                                                     placeholder = "Last Name"
                                                     onChangeText = {props.handleChange('lastName')}
                                                     value = {props.values.lastName}
                                                     editable= {!isProfile}
                                                     onBlur = {props.handleBlur('lastName')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.lastName && props.errors.lastName}</Text>
                                    <SignUpComponent title = 'Username:'
                                                     placeholder = "6 - 16 characters"
                                                     onChangeText = {props.handleChange('username')}
                                                     value = {props.values.username}
                                                     editable= {!isProfile}
                                                     onBlur = {props.handleBlur('username')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.username && props.errors.username}</Text>
                                    {isProfile ?
                                        <SignUpComponent title = 'Email:'
                                                     editable = {false}
                                                     value = {email}
                                                     /> : null}
                                    {isProfile ? null : <>
                                    <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold', marginBottom: 10, marginTop: 10}}>Fill in this section to update your password(Optional)</Text>
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

                                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 15, paddingBottom: statusBarHeight + 130}}>
                                        <GradientButton onPress={() => {
                                            props.handleSubmit()
                                        }}
                                                        style={style.button}
                                                        colors ={['#ff8400','#e56d02']}>
                                            Update
                                        </GradientButton>
                                    </View></>
                                    }
                                </View>
                            </View>
                        </Background>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
            )}
        </Formik>
    )
}

const style = StyleSheet.create({
    titleStyle: {
        color: 'white',
        justifyContent: 'center',
        fontSize: 21,
        fontWeight: "bold",
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
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 25
    }
})

export default ProfileScreen;
