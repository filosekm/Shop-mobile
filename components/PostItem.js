import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from '../styles/PostItemStyles';

const PostItem = ({ post, openComments, toggleComments }) => {
    return (
        <View style={styles.postContainer}>
            <TouchableOpacity onPress={() => toggleComments(post.id)}>
                <Text style={styles.postTitle}>{post.title}</Text>
            </TouchableOpacity>
            {openComments[post.id] && openComments[post.id].length > 0 ? (
                <FlatList
                    data={openComments[post.id]}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.comment}>
                            <Text style={styles.content}>{item.content}</Text>
                        </View>
                    )}
                />
            ) : null}
        </View>
    );
};

export default PostItem;
