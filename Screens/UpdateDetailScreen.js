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
            <Background>
                <View style = {{alignItems: 'center', marginTop: 30}}>
                    <Text style = {style.titleStyle} >Update Details</Text>
                </View>
                <View style = {{marginTop: 20, marginHorizontal: 52}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Formik
                            initialValues = {{
                                uri: props.route.params.data.uri,
                                firstName: props.route.params.data.firstName,
                                lastName: props.route.params.data.lastName,
                                username: props.route.params.data.username,
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                                referee:props.route.params.data.referee
                            }}
                            validationSchema = {reviewSchema(props.route.params.data.password)}
                            onSubmit={(values, actions) => {
                                props.route.params.handler({
                                    firstName: values.firstName,
                                    lastName: values.lastName,
                                    username: values.username,
                                    password: values.confirmPassword,
                                    uri: values.uri,
                                    referee: values.referee
                                })
                                actions.resetForm()
                                registeredPress()
                            }}
                        >
                            {(props) => (
                                <View style = {{justifyContent: 'center'}}>
                                    <View style = {{...style.photoFrame, marginBottom: 15}}>
                                        <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {{
                                            uri: props.values.uri
                                        }}/>
                                    </View>
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
                                                                  console.log(result)
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
                                    <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold', marginBottom: 10,}}>Fill in this section if you want to receive offers to referee games(Optional).</Text>
                                    <View style = {{marginTop: 10, width: 300,}}>
                                        <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Receive Offers?</Text>
                                        <View style ={style.dropDownCopy}>
                                            <Select
                                                style = {{width: "98%", justifyContent:"space-between"}}
                                                placeholder= ' '
                                                value ={refereeOption[refereeIndex - 1]}
                                                onSelect={index => {
                                                    setIndex(index)
                                                    props.setFieldValue('referee[0]', refereeOption[index.row])
                                                }}
                                                selectedIndex={refereeIndex}>
                                                <SelectItem title='No'/>
                                                <SelectItem title='Yes'/>

                                            </Select>
                                        </View>
                                    </View>
                                    {props.values.referee[0] === "Yes"
                                    ?
                                        <View style = {{marginTop: 10, width: 300,}}>
                                            <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Select Refereeing Sport:</Text>
                                            <View style ={style.dropDownCopy}>
                                                <Select
                                                    style = {{width: "98%", justifyContent:"space-between"}}
                                                    placeholder= 'Sport'
                                                    value ={sports[sportIndex - 1]}
                                                    onSelect={index => {
                                                        setSportIndex(index)
                                                        props.setFieldValue('referee[1]', sports[index.row])
                                                    }}
                                                    selectedIndex={sportIndex}
                                                >
                                                    {sports.map(game => (
                                                            <SelectItem key={game} title={game}/>
                                                        )
                                                    )}
                                                </Select>
                                                {/*<Picker*/}
                                                {/*    mode="dropdown"*/}
                                                {/*    selectedValue={props.values.referee[1]}*/}
                                                {/*    style={{ height: "100%", width: "100%", justifyContent:"space-between"}}*/}
                                                {/*    onValueChange={(itemValue, itemIndex) => {*/}
                                                {/*        props.setFieldValue('referee[1]', itemValue)*/}
                                                {/*        props.setFieldTouched('referee[1]')*/}
                                                {/*    }}*/}
                                                {/*>*/}



                                                {/*</Picker>*/}
                                            </View>
                                        </View>
                                    :
                                        <View></View>
                                    }
                                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 15, paddingBottom: 100}}>
                                        <GradientButton onPress={() => { registeredPress(); props.handleReset();}}
                                                        style={style.button}
                                                        colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
                                            Cancel
                                        </GradientButton>
                                        <GradientButton onPress={() => {
                                            console.log(props.values.referee)
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
