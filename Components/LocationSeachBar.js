import React, { useState } from 'react';
import {View, TouchableOpacity} from 'react-native';
import { Autocomplete, AutocompleteItem } from '@ui-kitten/components';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {mrtStations} from "./SearchBarFunctions";

const renderIcon = () => (
    <TouchableOpacity style={{elevation:5}} onPress={props.searchMe}>
        <MaterialCommunityIcons name="magnify" size={25} style={{color:"#414141"}}/>
    </TouchableOpacity>
)

const filter = (item, query) => item.title.toLowerCase().includes(query.toLowerCase());

const LocationSearchBar = (props) => {
    const [value, setValue] = useState(null);
    const [data, setData] = useState(mrtStations);

    const onSelect = (index) => {
        setValue(data[index].title);
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
                placeholder='Place your Text'
                value={value}
                accessoryRight={renderIcon}
                onChangeText={onChangeText}
                onSelect={onSelect}>
                {data.map(renderOption)}
            </Autocomplete>
}

export default LocationSearchBar;