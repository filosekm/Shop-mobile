import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Picker, Text, ScrollView, Alert } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';

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
            title: `Zgłoszenie od ${name}`, // or use category
            description: `Email: ${email}\n\n${description}`
        };

        try {
            const response = await fetch('http://your-api-url/report_issue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
                throw new Error('Network response was not ok.');
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
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <Text style={styles.label}>Kategoria:</Text>
            <Picker
                selectedValue={category}
                onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Wybierz kategorię" value="" />
                <Picker.Item label="Problem techniczny" value="tech" />
                <Picker.Item label="Sugestia" value="suggestion" />
                <Picker.Item label="Inne" value="other" />
            </Picker>

            <Text style={styles.label}>Opis:</Text>
            <PaperTextInput
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                style={styles.inputMultiline}
            />

            <Button title="Wyślij" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        marginBottom: 5,
        marginTop: 20,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    inputMultiline: {
        backgroundColor: 'white',
        textAlignVertical: 'top',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    picker: {
        marginBottom: 20,
    },
});

export default ReportFormScreen;
