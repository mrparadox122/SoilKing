import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'; // Import AsyncStorage
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../Controllers/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseUrl from '../Variables';

GoogleSignin.configure({
	webClientId: "968821050754-v9v0uh9coaj78bu9mksdvha3o6pg00o6.apps.googleusercontent.com",
	androidClientId: "968821050754-gk9crfphp74fe439sm4e0qjc73ss4foo.apps.googleusercontent.com",
	iosClientId: "968821050754-p7qdbj7f2jmsiubhg19sfok6cn5fpgkv.apps.googleusercontent.com",
	scopes: ['profile', 'email'],
});

const GoogleLogin = async () => {
	await GoogleSignin.hasPlayServices();
	const userInfo = await GoogleSignin.signIn();
	return userInfo;
};

export default function Login() {
  const navigation = useNavigation();

  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    // Load saved credentials when component mounts
    // loadCredentials();
  }, []);

  const saveCredentials = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('phone_number', phone_number);

      } else {
        // Clear saved credentials if Remember Me is unchecked
        await AsyncStorage.removeItem('phone_number');
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };


  const handleLogin = () => {
    setIsLoading(true); // Set loading to true when login starts
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic TWFpbnRhaW5lbmN5XzEyMjI6UGFyYWRveEAxMg==");

    const formdata = new FormData();
    formdata.append("phone_number", phone_number);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };
    fetch(BaseUrl+"login", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status) {
          saveCredentials();
          setUser(result.data); // Set user data in the context
          setShowPopup(true);
          navigation.replace('Home');
        } else {
          // Handle login failure
          setPopupMessage(result.message);
          setShowPopup(true);
        }
      })
      .catch(error => console.error(error))
      .finally(() => {
        setIsLoading(false); // Set loading to false when login completes
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Again!</Text>
      <Text style={styles.subtitle}>We are happy to see you again. Login to continue.</Text>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#357DED',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A9A9A9',
    textAlign: 'center',
    marginBottom: 20,
  },
});
