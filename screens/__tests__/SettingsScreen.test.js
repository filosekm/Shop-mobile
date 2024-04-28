import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../screens/SettingsScreen';

describe('SettingsScreen', () => {
    const mockNavigate = jest.fn();

    it('navigates to ReportFormScreen when button is pressed', () => {
        const navigation = { navigate: mockNavigate };
        const { getByText } = render(<SettingsScreen navigation={navigation} />);

        const button = getByText('Wyślij formularz');
        fireEvent.press(button);

        expect(mockNavigate).toHaveBeenCalledWith('ReportFormScreen');
    });
});
