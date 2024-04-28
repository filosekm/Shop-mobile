import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../screens/ProfileScreen';

describe('ProfileScreen', () => {
    it('renders correctly', () => {
        const { getByText } = render(<ProfileScreen />);
        expect(getByText('Profil Użytkownika')).toBeTruthy();
    });

    it('logs out when logout button is pressed', () => {
        const logSpy = jest.spyOn(console, 'log');
        const { getByText } = render(<ProfileScreen />);

        fireEvent.press(getByText('Wyloguj'));
        expect(logSpy).toHaveBeenCalledWith('Wylogowano');
        logSpy.mockRestore(); // Clean up the spy to prevent memory leaks
    });
});
