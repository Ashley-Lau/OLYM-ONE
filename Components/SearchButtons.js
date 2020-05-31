import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const SearchButtons = props => {
    return (
        <View style={{elevation:5}}>
            <TouchableOpacity style={{elevation:5}} onPress={props.searchMe}>
                <MaterialCommunityIcons name="magnify" size={45}/>
            </TouchableOpacity>
        </View>
    )
}


export default SearchButtons