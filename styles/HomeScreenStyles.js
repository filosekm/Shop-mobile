import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#303030',
    },
    sort: {
        marginBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    warning: {
        fontSize: 16,
        color: 'orange',
        textAlign: 'center',
        marginTop: 10,
    },
    sortOption: {
        fontSize: 16,
        marginRight: 20,
        margin: 10,
        color: 'white',
    },
    selectedOption: {
        fontWeight: 'bold',
    },
    content: {
        marginTop: 10,
        fontSize: 15,
        color: 'white',
    },
});
