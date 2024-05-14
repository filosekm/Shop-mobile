module.exports = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(js|ts|tsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@rneui/themed|@expo|expo|expo-notifications|expo-constants|@expo/vector-icons|expo-app-loading)/)'
    ],
    setupFiles: [
        './jest/setup.js',
        'react-native-gesture-handler/jestSetup',
    ],
    setupFilesAfterEnv: ['jest-fetch-mock', '@testing-library/jest-native/extend-expect'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@env$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
};
