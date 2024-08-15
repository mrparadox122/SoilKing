import React, { useState, useEffect, useContext } from 'react';
import { Text, View, ActivityIndicator, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Controllers/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseUrl from '../Variables';

export default function Splash() {
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false); // State to track loading
    const [logoLoaded, setLogoLoaded] = useState(false); // State to track logo loading

    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        // Load saved credentials when component mounts
        loadCredentials();
        // Preload logo
        const logoImage = Image.prefetch('http://tinfra.co/logo.png');
        // Once logo is loaded, update state
        Promise.all([logoImage]).then(() => setLogoLoaded(true));
    }, []);

    const loadCredentials = async () => {
        setIsLoading(true); // Set loading to true when login starts
        try {
            const phone_number = await AsyncStorage.getItem('phone_number');

            if (phone_number) {
                handleAutoLogin(phone_number);
            } else {
                navigation.replace('Login');
            }
        } catch (error) {
            console.error('Error loading credentials:', error);
        }
    };

    const handleAutoLogin = (phone_number) => {
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

        fetch(BaseUrl + "login", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    setUser(result.data); // Set user data in the context
                    navigation.replace('Home');
                } else {
                    // Handle login failure
                    Alert.alert("Error", result.message);
                }
            })
            .catch(error => console.error(error))
            .finally(() => {
                setIsLoading(false); // Set loading to false when login completes
            });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {logoLoaded ? (
                <Image
                    source={{ uri: 'https://tinfra.co/logo.png' }}
                    style={{ width: 200, height: 200, marginBottom: 20 }}
                    resizeMode="contain"
                />
            ) : (
                <ActivityIndicator size="large" color="#000" />
            )}
            {isLoading && logoLoaded ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <Text></Text>
            )}
        </View>
    );
}