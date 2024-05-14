import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    messageContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#303030',
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff',


    },
    sender: {
        color: 'white',
        fontWeight: 'bold',
    },
    message: {
        color: 'white',
    },
    messageCard: {
        padding: 15,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 1.22,
        elevation: 3,
        backgroundColor: '#424242',
        width:'100%',
        flex:1,
        alignItems:'flex-start',
    },
    messageSubject: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    messageContent: {
        color: 'white',
    },
});
