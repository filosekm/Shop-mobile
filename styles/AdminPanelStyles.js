import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#303030',
    },
    user: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#424242'
    },
    userName: {
        fontSize: 18,
        color: 'white',
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
    },
    buttonStyle: {
        borderRadius: 5,
        borderColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 5,
        borderWidth: 1,
        marginBottom: 5,
    },
    title: {
        color: 'white',
        fontSize: 26,
        marginBottom: 10,
    }
});

export default styles;
