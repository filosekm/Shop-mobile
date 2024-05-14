import React, { useState, useContext } from 'react';
import { View, Text, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@rneui/themed';
import { loginUser } from '../services/authService';
import styles from '../styles/LoginScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setMessage('Email and password are required.');
                return;
            }

            const token = await loginUser(email, password);
            await AsyncStorage.setItem('userEmail', email);
            login(token);
        } catch (error) {
            setMessage(error.message || 'Login failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={[styles.input, { color: 'white' }]}
                placeholder="Email"
                placeholderTextColor='white'
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={[styles.input, { color: 'white' }]}
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor='white'
                value={password}
                onChangeText={setPassword}
            />
            <Button
                title="Login"
                onPress={handleLogin}
                type="outline"
                titleStyle={{color:'#fff'}}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer}
            />
            <Text style={styles.error}>{message}</Text>
        </View>
    );
};

export default LoginScreen;
