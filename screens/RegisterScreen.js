import React, { useState } from 'react';
import { View, Text, TextInput,  StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importujemy hook do nawigacji
import { Button } from '@rneui/themed';
import { API_ENDPOINT } from "@env";

const RegisterScreen = () => {
    const navigation = useNavigation(); // Inicjalizujemy nawigację
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const register = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json()
            setMessage(data.message)
            setError('')
            navigation.navigate('Login')
        } catch (error) {
            console.log(error)
            setMessage('');
            setError('Registration failed. Please try again later.')
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={[styles.input, { color: 'white' }]}
                placeholder="Email"
                placeholderTextColor='white'
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={[styles.input, { color: 'white' }]}
                placeholder="Username"
                placeholderTextColor='white'
                placeholderTextinput='white'
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={[styles.input, { color: 'white' }]}
                placeholder="Password"
                placeholderTextColor='white'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <Button
                title="Register"
                onPress={register}
                type="outline"
                titleStyle={{color:'#fff'}}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer2}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {message ? <Text style={styles.message}>{message}</Text> : null}
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
        fontSize: 24,
        marginBottom: 20,
        color: 'white',
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#424242'
    },
    error: {
        color: 'white',
        marginBottom: 10,
    },
    message: {
        color: 'green',
        marginBottom: 10,
    },
    buttonContainer2: {
        marginTop : 150,
        width: 200,
    },
    buttonStyle: {
        borderRadius: 10,
        borderColor:'#fff',
        paddingVertical: 10,
        paddingHorizontal: 12,
    }
});
export default RegisterScreen;
