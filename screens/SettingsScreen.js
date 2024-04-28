import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const SettingsScreen = ({ navigation }) => {
    return (
        <View style={styles.cards}>
            <Button
                title="Wyślij formularz"
                onPress={() => navigation.navigate('ReportFormScreen')}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postCard: {
        marginLeft:10,
    },
});

export default SettingsScreen;
