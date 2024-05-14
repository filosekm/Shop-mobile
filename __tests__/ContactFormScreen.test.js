import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ContactFormScreen from '../screens/ContactFormScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_ENDPOINT } from '@env';

jest.mock('@env', () => ({
    API_ENDPOINT: 'https://example.com'
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

jest.mock('@rneui/themed', () => {
    const React = require('react');
    const { View, Text, TextInput } = require('react-native');
    const MockInput = (props) => <TextInput {...props} />;
    const MockButton = ({ title, onPress }) => (
        <View onClick={onPress}>
            <Text>{title}</Text>
        </View>
    );
    return {
        Input: MockInput,
        Button: MockButton,
        Icon: (props) => <View {...props} />,
    };
});



describe('ContactFormScreen', () => {
    beforeEach(() => {
        AsyncStorage.getItem.mockResolvedValue('dummyToken');
        jest.spyOn(Alert, 'alert');
        console.error = jest.fn();
    });

    test('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<ContactFormScreen />);
        expect(getByPlaceholderText('Subject')).toBeTruthy();
        expect(getByPlaceholderText('Message')).toBeTruthy();
        expect(getByText('Send Message')).toBeTruthy();
    });

    test('handles successful message submission', async () => {
        fetch.mockResponseOnce(JSON.stringify({ message: 'Message sent successfully' }));

        const { getByPlaceholderText, getByText } = render(<ContactFormScreen />);

        fireEvent.changeText(getByPlaceholderText('Subject'), 'Test Subject');
        fireEvent.changeText(getByPlaceholderText('Message'), 'Test Message');
        fireEvent.press(getByText('Send Message'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `https://bd73-82-139-13-67.ngrok-free.app//contact_author`,
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer dummyToken',
                    },
                    body: JSON.stringify({
                        subject: 'Test Subject',
                        message: 'Test Message',
                    }),
                })
            );
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Message sent successfully');
        });
    });

    test('handles message submission failure', async () => {
        fetch.mockReject(new Error('Failed to send message'));

        const { getByPlaceholderText, getByText } = render(<ContactFormScreen />);

        fireEvent.changeText(getByPlaceholderText('Subject'), 'Test Subject');
        fireEvent.changeText(getByPlaceholderText('Message'), 'Test Message');
        fireEvent.press(getByText('Send Message'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to send message. Please try again later.');
        });
    });
});
