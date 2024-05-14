import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SortOption = ({ item, sortOption, sortByOption }) => (
    <TouchableOpacity onPress={() => sortByOption(item.value)}>
        <Text style={[styles.sortOption, sortOption === item.value && styles.selectedOption]}>{item.label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    sortOption: {
        fontSize: 16,
        marginRight: 20,
        margin: 10,
        color: 'white',
    },
    selectedOption: {
        fontWeight: 'bold',
    },
});

export default SortOption;
