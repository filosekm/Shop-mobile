export default {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve('fake-token')),
    removeItem: jest.fn(() => Promise.resolve()),
};
