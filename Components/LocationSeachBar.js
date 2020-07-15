import React, { useState } from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import { Autocomplete, AutocompleteItem } from '@ui-kitten/components';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {mrtStations} from "./SearchBarFunctions";

const filter = (item, query) => item.title.toLowerCase().includes(query.toLowerCase());

const LocationSearchBar = (props) => {
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

    const alertMessage = () => Alert.alert(
        "Invalid zone!",
        "Please select a valid zone from the list.",
        [
            {text:"Confirm", onPress: () => {},  style:'cancel'}
        ],
        {cancelable: false}
    )

    const renderIcon = () => (
        <TouchableOpacity style={{elevation:5}} onPress={() => {
            if (mrtStations.filter(item => item.title === value).length === 1) {
                props.onPress()
                return;
            }
            if(value === '') {
                props.onPress()
                return;
            }
            alertMessage()
        }}>
            <MaterialCommunityIcons name="magnify" size={25} style={{color:"#414141"}}/>
        </TouchableOpacity>
    )


    return <Autocomplete
                placeholder='Select a zone'
                placement = {'bottom start'}
                value={value}
                accessoryRight={renderIcon}
                onChangeText={onChangeText}
                onSelect={onSelect}
    >
                {data.map(renderOption)}
            </Autocomplete>
}

export default LocationSearchBar;