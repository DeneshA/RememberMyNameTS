import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [savedName, setSavedName] = useState<string | null>(null);
  const [savedAge, setSavedAge] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Load saved data on startup
  useEffect(() => {
    const loadName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('username');
        const storedAge = await AsyncStorage.getItem('userage');
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedName) setSavedName(storedName);
        if (storedAge) setSavedAge(storedAge);
        if (storedTheme) setDarkMode(true);

      } catch (error) {
        console.error('Error loading name:', error);
      }
    };
    loadName();
  }, []);

  // ✅ Save name to storage
  const handleSave = async () => {
    try {
      if (name.trim() === '') {
        Alert.alert('Please enter a name');
        return;
      } else if (age.trim() === '' || isNaN(Number(age))) {
        Alert.alert('Please enter a valid age');
        return;
      }
      await AsyncStorage.setItem('username', name);
      setSavedName(name);
      await AsyncStorage.setItem('userage', age);
      setSavedAge(age);
      Alert.alert('Sucess!', 'Your name and age has been saved🥳');
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  // ✅ Clear saved name
  const handleClear = async () => {
    try {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('userage');
      setSavedName(null);
      setName('');
      setSavedAge(null);
      setAge('');
      Alert.alert('Cleared!', 'Your name has been removed🗑️');
    } catch (error) {
      console.error('Error clearing name:', error);
    }
  };

  // ✅ Toggle dark mode
  const toggleTheme = async () => {
    try {
      const newMode = !darkMode;
      setDarkMode(newMode);
      await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  }

  // ✅ Apply theme-based styles
  const backgroundColor = darkMode ? '#1c1c1e' : '#f5f5f5';
  const textColor = darkMode ? '#ffffff' : '#000000';
  const inputBg = darkMode ? '#333' : '#fff';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>AsyncStorage Demo 💾</Text>
      <TouchableOpacity style={ styles.themeButton} onPress={toggleTheme }>
<Text style={{color:'#fff'}}>{darkMode ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}</Text>
      </TouchableOpacity>
      {savedName ? (
        <>
          <Text style={[styles.greeting,{color:textColor}]}>Hello, {savedName}! age ({savedAge}) </Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear Name</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={[styles.input,{backgroundColor:inputBg,color:textColor,borderColor:textColor}]}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
             style={[styles.input,{backgroundColor:inputBg,color:textColor,borderColor:textColor}]}
            placeholder="Enter your age"
            value={age}
            onChangeText={setAge}></TextInput>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Name</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '80%',
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  themeButton: {
    backgroundColor: '#5856D6',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  greeting: { fontSize: 20, marginVertical: 10 },
});
