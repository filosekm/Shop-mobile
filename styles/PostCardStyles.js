import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    postCard: {
        backgroundColor: '#424242',
        padding: 20,
        borderRadius: 5,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 1.22,
        elevation: 3,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        marginTop: 10,
        fontSize: 15,
        color: 'white',
    },
    rating: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        color: 'lightgray',
    },
});
