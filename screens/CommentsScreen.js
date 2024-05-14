import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { fetchPosts, fetchComments } from '../services/postService';
import PostItem from '../components/PostItem';
import styles from '../styles/CommentsScreenStyles';

const CommentsScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openComments, setOpenComments] = useState({});

    useEffect(() => {
        const loadPosts = async () => {
            const data = await fetchPosts();
            setPosts(data);
            setLoading(false);
        };

        loadPosts();
    }, []);

    const toggleComments = async (postId) => {
        if (openComments[postId]) {
            setOpenComments((prevOpenComments) => ({
                ...prevOpenComments,
                [postId]: null,
            }));
        } else {
            const comments = await fetchComments(postId);
            setOpenComments((prevOpenComments) => ({
                ...prevOpenComments,
                [postId]: comments,
            }));
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PostItem post={item} openComments={openComments} toggleComments={toggleComments} />
                )}
            />
        </View>
    );
};

export default CommentsScreen;
