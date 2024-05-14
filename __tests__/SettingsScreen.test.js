import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../screens/SettingsScreen';
import {Text, View} from "react-native";

// Mock navigation
const mockNavigate = jest.fn();

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

const createTestProps = (props) => ({
    navigation: {
        navigate: mockNavigate,
        ...props,
    },
});

describe('SettingsScreen', () => {
    let props;

    beforeEach(() => {
        props = createTestProps({});
    });

    test('renders correctly and displays the "Send Issue Report" button', () => {
        const { getByText } = render(<SettingsScreen {...props} />);

        expect(getByText('Send Issue Report')).toBeTruthy();
    });

    test('navigates to ReportFormScreen when the button is pressed', () => {
        const { getByText } = render(<SettingsScreen {...props} />);

        fireEvent.press(getByText('Send Issue Report'));

        expect(mockNavigate).toHaveBeenCalledWith('ReportFormScreen');
    });
});
