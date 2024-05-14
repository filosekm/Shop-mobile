import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { sendMessage } from '../services/contactService';
import styles from '../styles/ContactFormScreenStyles';

const ContactFormScreen = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        try {
            const responseMessage = await sendMessage(subject, message);
            Alert.alert('Success', responseMessage);
        } catch (error) {
            Alert.alert('Error', 'Failed to send message. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Subject"
                placeholderTextColor="white"
            />
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Message"
                placeholderTextColor="white"
                multiline
            />
            <Button
                title="Send Message"
                onPress={handleSubmit}
                type="outline"
                titleStyle={{ color: '#fff' }}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer}
            />
        </View>
    );
};

export default ContactFormScreen;
