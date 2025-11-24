import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStronage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {

  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState<string | null>(null);

  // ✅ Load saved name on startup
  useEffect(() => {
    const loadName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('username');
        if (storedName) {
          setSavedName(storedName);
        }
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
      }
      await AsyncStronage.setItem('username', name);
      setSavedName(name);
      Alert.alert('Sucess!', 'Your name has been saved🥳');
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  // ✅ Clear saved name
  const handleClear = async () => {
    try {
      await AsyncStronage.removeItem('username');
      setSavedName(null);
      setName('');
      Alert.alert('Cleared!', 'Your name has been removed🗑️');
    } catch (error) {
      console.error('Error clearing name:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AsyncStorage Demo 💾</Text>

      {savedName ? (
        <>
        <Text style={styles.greeting}>Hello, {savedName}!</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear Name</Text>
        </TouchableOpacity> 
        </>
      ):(
        <>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}    
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Name</Text>
        </TouchableOpacity>
        </>     
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '80%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
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
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  greeting: { fontSize: 20, marginVertical: 10 },
});
