import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [savedName, setSavedName] = useState<string | null>(null);
  const [savedAge, setSavedAge] = useState<string | null>(null);
  const [darkMode,setDarkMode]=useState(false);

  // ✅ Load saved name on startup
  useEffect(() => {
    const loadName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('username');
        const storedAge = await AsyncStorage.getItem('userage');
        if (storedName) {
          setSavedName(storedName);
        }
        if (storedAge) {
          setSavedAge(storedAge);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AsyncStorage Demo 💾</Text>

      {savedName ? (
        <>
          <Text style={styles.greeting}>Hello, {savedName}! age ({savedAge}) </Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear Name</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
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
