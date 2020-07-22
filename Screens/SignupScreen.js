import React, {useState} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    Modal,
    KeyboardAvoidingView
} from 'react-native';

import { useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Formik} from 'formik';
import * as yup from 'yup';
import { Select, SelectItem, Icon, Datepicker} from '@ui-kitten/components';

import GradientButton from "../Components/GradientButton";
import CustButton from "../Components/CustButton"
import SkyscrapperBackground from "../views/SkyscrapperBackground";

import firebaseDb from "../firebaseDb"

const SignUpComponent = props => {
    return <View style = {{marginTop: 10, width: 300}}>
                <Text style = {{fontSize: 15, fontWeight: 'bold'}}>{props.title}</Text>
                <TextInput  style = {{marginTop: 0, fontSize:20, borderBottomWidth: 2, borderBottomColor: 'black' }}
                            placeholderTextColor = '#708090' {...props}/>
            </View>
}

const reviewSchema = yup.object({
    firstName: yup.string().label('First Name').required(),
    lastName: yup.string().label('Last Name').required(),
    email: yup.string().label('Email').email('Email is not valid').required()
        .test('check if email is in use', 'Email has been registered',
                val => {
                    const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    let isValidEmail = emailRegex.test(val);
                    if(isValidEmail) {
                        return firebaseDb.auth().fetchSignInMethodsForEmail(val.toLowerCase()).then(array => array.length === 0).catch((error) => {})
                    }
                    return true
                }),
    username: yup.string().label('Username').required().min(6).max(16),
    password: yup.string().label('Password').required().min(6).max(16),
    confirmPassword: yup.string().label('Confirm Password').required()
        .oneOf([yup.ref('password'), null], 'Password must match'),
    gender: yup.string().test('gender selector', 'Please select a gender', (val) => val === 'Male' || val === 'Female'),
    birthDate: yup.date().test('birthdate test', 'Birth date cannot be later than current date!', (val) => val < Date.now())

})
const SignupScreen = props => {

    const navigation = useNavigation();
    const [selectedIndex, setSelectedIndex] = useState();

    const genderData = ['Male', 'Female']

    const handleCreateUser = values => {
        firebaseDb.auth().createUserWithEmailAndPassword(values.email, values.password)
            .then((response) => {
            const uid = response.user.uid
            const data = {
                id: uid,
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username.toLowerCase(),
                email: values.email,
                gender: values.gender,
                password: values.password,
                birthDate: values.birthDate,
                uri: 'https://i.dlpng.com/static/png/6542357_preview.png',
                upcoming_games: [],
                referee: false,
            };
            const usersRef = firebaseDb.firestore().collection('users')
            usersRef
                .doc(uid)
                .set(data)
                .then(() => {
                    response.user
                        .sendEmailVerification()
                        .then((doc) => {})
                        .catch((error) => alert(error));
                    emailNotVerified(response.user.email)
                    firebaseDb.auth().signOut().then(() => {})
                })
                .catch((error) => {
                    alert(error)
                });
        })
            .catch((error) => {
                alert(error)
            });
    }

    const emailNotVerified = (user) => {
        Alert.alert(
            "Account has registered successfully!",
            "Please follow the instructions sent to " + user.email + " to verify your account",
            [
                {
                    text: "Confirm",
                    onPress: () => {}
                }
            ]
        )
    }

    const cancelledPress = () => {
        navigation.goBack();
    }

    const CalendarIcon = (props) => (
        <Icon {...props} name='calendar'/>
    );

    return (<SkyscrapperBackground>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                                  keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
                                  enabled={true}
            style = {{flex: 1}}>
                <View style = {{flex: 1}}/>
                <Animatable.View style = {style.popout} animation = "fadeInUpBig">
                    <ScrollView showsVerticalScrollIndicator={false}
                                scrollEventThrottle={16}>
                        <Formik
                            initialValues = {{ firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: '', gender: '', birthDate: new Date()}}
                            validationSchema = {reviewSchema}
                            onSubmit={(values, actions) => {
                                handleCreateUser(values)
                                navigation.navigate('LoginScreen')
                            }}
                        >
                            {(props) => (
                                <View>
                                    <Text style = {{fontSize: 30, fontWeight: 'bold', marginTop: 20, }}>
                                        Create Account,
                                    </Text>
                                    <Text style = {{fontSize: 17, fontWeight: 'bold', marginTop: 0, marginBottom: 30, color: '#4e4e4e'}}>
                                        Sign up to get started!
                                    </Text>
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

                                    {/*================================================New picker that caters to ios==============================*/}
                                    <Select
                                            label ={() => <Text style = {{fontSize: 15, fontWeight: 'bold', marginTop: 10,}}>Gender: </Text>}
                                            style = {{width: '100%'}}
                                            placeholder='Select'
                                            value ={genderData[selectedIndex - 1]}
                                            onSelect={index => {
                                                        setSelectedIndex(index)
                                                        props.setFieldValue('gender', genderData[index.row])
                                            }}
                                            selectedIndex={selectedIndex}>
                                        <SelectItem title='Male'/>
                                        <SelectItem title='Female'/>
                                    </Select>

                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.gender && props.errors.gender}</Text>
                                    <Datepicker
                                        label= {() => <Text style = {{fontSize: 15, fontWeight: 'bold', marginTop: 10,}}>Birth Date: </Text>}
                                        placeholder='Pick Date'
                                        date={props.values.birthDate}
                                        onSelect={nextDate => {
                                            props.setFieldValue('birthDate', nextDate);
                                            props.setFieldTouched('birthDate');
                                        }}
                                        accessoryRight={CalendarIcon}
                                    />
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.birthDate && props.errors.birthDate}</Text>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 15, paddingBottom: 60}}>
                                        <GradientButton onPress={() => {
                                                            cancelledPress()
                                                            props.handleReset()}}
                                                        style={style.button}
                                                        colors={['#e52d27', '#b31217']}>
                                            Cancel
                                        </GradientButton>
                                        <GradientButton onPress={props.handleSubmit}
                                                        style={style.button}
                                                        colors={['#ff8400','#e56d02']}>
                                            Register
                                        </GradientButton>
                                    </View>
                            </View>
                            )}
                        </Formik>
                    </ScrollView>
                </Animatable.View>
            </KeyboardAvoidingView>
            </SkyscrapperBackground>
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

    button: {
        width: 120,
        height: 50,
        borderRadius: 25,
    }
})
