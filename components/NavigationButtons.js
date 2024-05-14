import React from 'react';
import { View } from 'react-native';
import { Button } from '@rneui/themed';
import styles from '../styles/AdminPanelStyles';

const NavigationButtons = ({ navigation }) => (
    <View>
        <Button
            title="Create Post"
            onPress={() => navigation.navigate('CreatePost')}
            type="outline"
            titleStyle={{ color: '#fff' }}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.buttonContainer}
        />
        <Button
            title="View Comments"
            onPress={() => navigation.navigate('Comments')}
            buttonStyle={styles.buttonStyle}
            type="outline"
            titleStyle={{ color: '#fff' }}
        />
        <Button
            title="View Rating"
            onPress={() => navigation.navigate('Rating')}
            buttonStyle={styles.buttonStyle}
            type="outline"
            titleStyle={{ color: '#fff' }}
        />
        <Button
            title="Show Reports"
            onPress={() => navigation.navigate('Reports')}
            buttonStyle={styles.buttonStyle}
            type="outline"
            titleStyle={{ color: '#fff' }}
        />
    </View>
);

export default NavigationButtons;
