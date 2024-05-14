import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';

const SettingsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.buttonRow} >
                <Button
                    title="Send Issue Report"
                    onPress={() => navigation.navigate('ReportFormScreen')}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.buttonContainer2}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#303030'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',

    },
    buttonContainer2: {
        marginTop : 15,
        width: '90%',



    },
    buttonStyle: {
        backgroundColor: "#424242",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
    }
});

export default SettingsScreen;
