import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../styles/SortOptionStyles';

const SortOption = ({ item, sortOption, sortByOption }) => (
    <TouchableOpacity onPress={() => sortByOption(item.value)} testID={`sort-${item.value}`}>
        <Text style={[styles.sortOption, sortOption === item.value && styles.selectedOption]}>{item.label}</Text>
    </TouchableOpacity>
);

export default SortOption;
