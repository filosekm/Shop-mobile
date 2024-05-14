import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import fetchMock from 'jest-fetch-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

fetchMock.enableMocks();

jest.mock('@env', () => ({
    API_ENDPOINT: 'https://example.com'
}));

jest.mock('expo-notifications', () => ({
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({ isAdmin: true }),
}));

global.alert = jest.fn();
global.console.log = jest.fn();
global.setImmediate = (callback) => setTimeout(callback, 0);



