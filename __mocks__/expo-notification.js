
export const getPermissionsAsync = jest.fn(() => Promise.resolve({ status: 'granted' }));
export const requestPermissionsAsync = jest.fn(() => Promise.resolve({ status: 'granted' }));
export const getExpoPushTokenAsync = jest.fn(() => Promise.resolve({ data: 'fake-token' }));
