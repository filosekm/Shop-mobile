import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, ScrollView, Alert, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINT } from '@env';

const ReportFormScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (!name || !email || !category || !description) {
            Alert.alert("Błąd", "Proszę wypełnić wszystkie pola.");
            return;
        }

        const payload = {
            title: `Zgłoszenie od ${name}`,
            description: `Email: ${email}\n\n${description}`,
            category: category
        };

        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_ENDPOINT}/report_issue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                Alert.alert("Zgłoszenie wysłane", "Dziękujemy za Twoje zgłoszenie.");
                // Clear the form
                setName('');
                setEmail('');
                setCategory('');
                setDescription('');
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            Alert.alert("Błąd", "Nie udało się wysłać zgłoszenia, spróbuj ponownie.");
            console.error('Failed to send report:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Imię:</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Wpisz swoje imię"
                placeholderTextColor="#888"
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Wpisz swój email"
                placeholderTextColor="#888"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Kategoria:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Wybierz kategorię" value="" />
                    <Picker.Item label="Problem techniczny" value="technical_issue" />
                    <Picker.Item label="Błąd w treści" value="content_error" />
                </Picker>
            </View>

            <Text style={styles.label}>Opis:</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                multiline
                numberOfLines={4}
                placeholder="Opisz swój problem"
                placeholderTextColor="#888"
                testID="description-input"
            />

            <Button
                title="Wyślij"
                onPress={handleSubmit}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#303030'
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'white'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        color: 'white'
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#424242'
    },
    picker: {
        color: 'white',
        padding: 10,
    },
    buttonContainer: {
        marginTop: 15,
        width: '100%',
    },
    buttonStyle: {
        backgroundColor: "#424242",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
    }
});

export default ReportFormScreen;
