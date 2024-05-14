import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings';
import { Button } from '@rneui/themed';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINT } from "@env";

const PostDetailScreen = ({ route, navigation }) => {
    const { isAdmin } = useContext(AuthContext); // Using isAdmin from AuthContext
    const postId = route.params ? route.params.postId : null;
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(3);
    const [rated, setRated] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) {
                Alert.alert("Error", "No post ID was provided");
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    Alert.alert("Authentication Error", "Authentication token is missing");
                    setError(true);
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_ENDPOINT}/posts/${postId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                setError(true);
                Alert.alert("Error", error.message || "An error occurred while fetching post details.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    useEffect(() => {
        const checkRated = async () => {
            const userRating = await AsyncStorage.getItem(`rating_${postId}`);
            if (userRating) {
                setRated(true);
                setRating(parseFloat(userRating));
            }
        };
        checkRated();
    }, []);

    const submitRating = async () => {
        if (rated) {
            Alert.alert("Error", "You have already rated this post.");
            return;
        }

        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_ENDPOINT}/posts/${postId}/rate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ score: rating })
        });

        if (response.ok) {
            await AsyncStorage.setItem(`rating_${postId}`, rating.toString());
            setRated(true);
            Alert.alert("Success", "Rating added successfully");

            navigation.navigate('Home', { postId, updatedRating: rating });
        } else {
            Alert.alert("Error", "Failed to submit rating");
        }
    };

    const handleEditPost = () => {
        setIsEditing(true);
        setEditedContent(post.content);
    };

    const saveEditedPost = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_ENDPOINT}/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: editedContent })
            });

            if (response.ok) {
                setPost({ ...post, content: editedContent });
                setIsEditing(false);
                Alert.alert("Success", "Post updated successfully");
            }
        } catch (error) {
            console.error('Failed to update post:', error);
            Alert.alert("Error", "Failed to update post. Please try again later.");
        }
    };

    const submitComment = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_ENDPOINT}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: comment })
            });

            if (response.ok) {
                Alert.alert("Success", "Comment added successfully");
                setComment('');
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
            Alert.alert("Error", "Failed to add comment. Please try again later.");
        }
    };
    const handleDeletePost = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_ENDPOINT}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                Alert.alert('Success', 'Post deleted successfully');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            Alert.alert('Error', 'Failed to delete post. Please try again later.');
        }
    };
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <View style={styles.centered}>
                    <Text>Failed to load the post. Please try again later.</Text>
                </View>
            ) : !post ? (
                <View style={styles.centered}>
                    <Text>No post data available.</Text>
                </View>
            ) : (
                <>
                    <Text style={styles.title}>{post.title}</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedContent}
                            onChangeText={setEditedContent}
                            placeholder="Edit your post"
                            placeholderTextColor="white"
                            multiline={true}
                        />
                    ) : (
                        <Text style={styles.content}>{post.content}</Text>
                    )}
                    <Text style={styles.views}>Views: {post.views}</Text>
                    {!isEditing && (
                        <TextInput
                            style={styles.input}
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Add a comment"
                            placeholderTextColor="white"
                        />
                    )}
                    {!isEditing && (
                        <View style={styles.buttonContainer1}>
                            <Button
                                title="Submit Comment"
                                onPress={submitComment}
                                buttonStyle={styles.buttonStyle}
                                type="outline"
                                titleStyle={{color:'white'}}
                                containerStyle={styles.buttonContainer1}
                            />
                        </View>

                    )}
                    {!isEditing && (
                        <View>
                            <Rating
                                showRating
                                onFinishRating={(value) => {
                                    setRating(value);
                                    submitRating();
                                }}
                                style={styles.rating}
                                startingValue={rating}
                                imageSize={30}
                                tintColor='#303030'
                                type="custom"
                            />

                        </View>
                    )}

                    {isAdmin && (
                        <View>
                            {isEditing ? (
                                <Button
                                    title="Save Changes"
                                    onPress={saveEditedPost}
                                    buttonStyle={styles.buttonStyle}
                                    type="outline"
                                    titleStyle={{color:'white'}}
                                    containerStyle={styles.buttonContainer2}
                                />
                            ) : (
                                <>
                                    <Button
                                        title="Edit Post"
                                        onPress={handleEditPost}
                                        buttonStyle={styles.buttonStyle}
                                        type="outline"
                                        titleStyle={{color:'white'}}
                                        containerStyle={styles.buttonContainer3}
                                    />
                                    <Button
                                        title="Delete Post"
                                        onPress={handleDeletePost}
                                        buttonStyle={styles.buttonStyle}
                                        type="outline"
                                        titleStyle={{color:'white'}}
                                        containerStyle={styles.buttonContainer3}
                                    />
                                </>
                            )}
                        </View>
                    )}

                    {!isEditing && (
                        <View>
                            <Button
                                title="Contact Author"
                                onPress={() => navigation.navigate('ContactFormScreen')}
                                type="outline"
                                titleStyle={{color:'white'}}
                                buttonStyle={styles.buttonStyle}
                                containerStyle={styles.buttonContainer3}
                            />
                        </View>
                    )}
                </>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#303030',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        color: 'white',
    },
    views: {
        color: 'white',
    },
    input: {
        marginBottom: 20,
        marginTop: 20,
        marginLeft: 5,
        fontSize: 18,
        color: 'white',
    },
    rating: {
        marginBottom: 40,
        marginTop: 50,
        alignItems: 'flex-end',

    },
    buttonContainer1: {
        alignItems: 'flex-start',
        width: '100%',
    },
    buttonContainer2: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    buttonContainer3: {
        marginBottom:25,
        width: '100%',
    },

    buttonStyle: {
        borderColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth:1,
    },
});

export default PostDetailScreen;
