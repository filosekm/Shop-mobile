import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { createPost, sendPushNotification } from '../services/postService';
import styles from '../styles/CreatePostScreenStyles';

const CreatePostScreen = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        try {
            const responseMessage = await createPost(title, content);
            Alert.alert('Success', responseMessage);
            await sendPushNotification();
        } catch (error) {
            Alert.alert('Error', 'Failed to create post. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                placeholderTextColor="white"
            />
            <TextInput
                style={styles.input}
                value={content}
                onChangeText={setContent}
                placeholder="Content"
                placeholderTextColor="white"
                multiline
            />
            <Button
                title="Create Post"
                onPress={handleSubmit}
                type="outline"
                titleStyle={{ color: '#fff' }}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer}
            />
        </View>
    );
};

export default CreatePostScreen;
