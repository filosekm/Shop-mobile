import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#303030'
    },
    input: {
        width: '100%',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        color: 'white',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 25,
    },
    buttonStyle: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
});

export default styles;
