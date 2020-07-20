import React from 'react'
import {Text, TextInput, View} from 'react-native'

const SignUpComponent = props => {
    return <View style = {{marginTop: 10, width: 300,}}>
        <Text style = {{fontSize: 15, fontWeight: 'bold'}}>{props.title}</Text>
        <TextInput style = {{ color: '#3b3b3b', marginTop: 0, fontSize:20, borderBottomWidth: 2, borderBottomColor: 'black' }}
                   placeholderTextColor ="#8599ab" {...props}/>
    </View>
}

export default SignUpComponent;