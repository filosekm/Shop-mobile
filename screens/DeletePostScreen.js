import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { deletePost } from '../services/postService';

const DeletePostScreen = ({ route }) => {
    const { postId } = route.params;

    const handleDelete = async () => {
        try {
            await deletePost(postId);
            Alert.alert('Success', 'Post deleted successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete post');
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Delete Post" onPress={handleDelete} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#303030',
    },
});

export default DeletePostScreen;
