// screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ProfileScreen = () => {
  return (
      <View style={styles.container}>
        <Text style={styles.title}>Profil Użytkownika</Text>
        {/* Tutaj można dodać informacje o użytkowniku i opcje */}
        <Button title="Wyloguj" onPress={() => console.log('Wylogowano')} />
      </View>
  );
};

const styles = StyleSheet.create({
  // Styl `container` i `title` może pozostać taki sam jak w HomeScreen
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProfileScreen;
