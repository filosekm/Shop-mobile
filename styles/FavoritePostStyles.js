import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: '#424242',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 1.22,
        elevation: 3,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        color: 'white',
    },
});

export default styles;
