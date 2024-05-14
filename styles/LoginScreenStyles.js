import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#303030',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'white',
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderRadius: 35,
        borderColor: 'gray',
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#424242',
    },
    buttonContainer: {
        marginTop: 150,
        width: 200,
    },
    buttonStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    error: {
        color: 'white',
    },
});
