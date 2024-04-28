import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

const PostDetailScreen = ({ route }) => {
    const { postId } = route.params;
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0); // State to store the user's rating
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}`);
            const postData = await response.json();
            setPost(postData);
            setComments(postData.comments || []);
            setRating(postData.currentRating || 0); // Assuming the API sends current user rating
        } catch (error) {
            console.error('Failed to fetch post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newComment })
            });
            if (response.ok) {
                setNewComment('');
                fetchPost(); // Refresh comments after adding
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleRatePost = async (newRating) => {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating: newRating })
            });
            if (response.ok) {
                setRating(newRating); // Update the local state to reflect the new rating
                Alert.alert("Rating submitted", "Thank you for your feedback!");
            } else {
                Alert.alert("Rating failed", "Please try again later.");
            }
        } catch (error) {
            console.error('Failed to submit rating:', error);
            Alert.alert("Error", "Failed to submit rating.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <Text style={styles.title}>{post?.title}</Text>
                    <Text>{post?.content}</Text>
                    <View style={styles.ratingContainer}>
                        {Array.from({ length: 5 }, (_, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleRatePost(index + 1)}
                                style={styles.star}>
                                <Text style={{ color: rating > index ? 'gold' : 'gray' }}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                    />
                    <Button title="Submit Comment" onPress={handleCommentSubmit} />
                    <FlatList
                        data={comments}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <Text style={styles.comment}>{item.content}</Text>
                        )}
                    />
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    comment: {
        padding: 10,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
    },
    star: {
        padding: 5,
    }
});

export default PostDetailScreen;
