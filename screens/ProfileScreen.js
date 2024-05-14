import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../context/AuthContext';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const [avatarSource, setAvatarSource] = useState(null);
    const [username, setUsername] = useState('');
    const { isLoggedIn, logout } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();

        const getUsernameFromStorage = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('userName');
                if (storedUsername !== null) {
                    setUsername(storedUsername);
                }
            } catch (error) {
                console.error('Error retrieving username from AsyncStorage:', error);
            }
        };

        getUsernameFromStorage();
    }, []);

    const selectAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            saveImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            saveImage(result.assets[0].uri);
        } else {
            console.log('Photo taking cancelled or failed to obtain URI:', result);
        }
    };

    const saveImage = async (imageUri) => {
        try {
            if (!imageUri) {
                console.error('Received null URI in saveImage');
                return;
            }

            const directory = `${FileSystem.documentDirectory}avatars/`;
            const info = await FileSystem.getInfoAsync(directory);
            if (!info.exists) {
                await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
            }
            const fileName = `avatar_${Date.now()}.jpg`;
            const destPath = `${directory}${fileName}`;
            await FileSystem.copyAsync({
                from: imageUri,
                to: destPath
            });
            setAvatarSource({ uri: destPath });
        } catch (error) {
            console.error('Error saving image:', error);
        }
    };

    const handleLogout = () => {
        logout();
        Alert.alert('Logged Out', 'You have been logged out successfully.');
    };

    if (!isLoggedIn) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Please log in or register.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {avatarSource && <Image source={avatarSource} style={styles.avatar} />}
            <Text style={styles.title}>Profil Użytkownika</Text>
            <Text style={styles.username}>{username}</Text>
            <View style={styles.buttonRow}>
                <Button
                    title="Select Avatar"
                    onPress={selectAvatar}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.buttonContainer1}
                />
                <Button
                    title="Take Photo"
                    onPress={takePhoto}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.buttonContainer1}
                />
            </View>
            <Button
                title="Wyloguj"
                onPress={handleLogout}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer2}
            />
            <TouchableOpacity style={styles.messageIconContainer} onPress={() => navigation.navigate('Messages')}>
                <Ionicons name="mail" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#303030'
    },
    title: {
        color: 'white',
        fontSize: 24,
    },
    avatar: {
        marginTop: 15,
        width: 300,
        height: 300,
        borderRadius: 180,
        marginBottom: 20,
        backgroundColor: '#303030'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    buttonContainer1: {
        margin: 50,
        width: 200,
    },
    buttonContainer2: {
        marginBottom: 15,
        width: 200,
        flex: 1,
        justifyContent: 'flex-end',
    },
    buttonStyle: {
        backgroundColor: "#424242",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    messageIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    username:{
      color:'white',
      fontSize:26,
    },
});

export default ProfileScreen;
