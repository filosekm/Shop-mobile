import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#212121',
        elevation: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    comment: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#333',
    },
    content: {
        color: 'white',
    },
});

export default styles;
