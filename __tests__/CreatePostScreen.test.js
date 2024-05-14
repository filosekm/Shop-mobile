import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreatePostScreen from '../screens/CreatePostScreen'; // Ensure the path is correct
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('@env', () => ({
    API_ENDPOINT: 'https://example.com'
}));

jest.mock('@rneui/themed', () => {
    const { View, Text } = require('react-native');
    const MockButton = ({ title, onPress }) => (
        <View onClick={onPress}>
            <Text>{title}</Text>
        </View>
    );
    return {
        Button: MockButton,
    };
});

// Mock fetch
global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ message: 'Post created successfully' }),
}));

// Mock alert
jest.spyOn(Alert, 'alert');

describe('CreatePostScreen', () => {
    beforeEach(() => {
        // Reset mocks before each test
        AsyncStorage.getItem.mockResolvedValue('dummyToken');
        fetch.mockClear();
        Alert.alert.mockClear();
    });

    test('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<CreatePostScreen />);

        expect(getByPlaceholderText('Title')).toBeTruthy();
        expect(getByPlaceholderText('Content')).toBeTruthy();
        expect(getByText('Create Post')).toBeTruthy();
    });
});
