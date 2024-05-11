import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import Colors from '../screenComponents/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IpAdress from '../screenComponents/IpAdress';

const AutoLogin = () => {
  const [isEnabled, setIsEnabled] = useState(false);


var ip_adress = IpAdress.ip;

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setIsEnabled(true)
          return token;

        } else {
          console.log('No token found');
          return null;
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
      }
    };

    getToken()

  }, [])

  const handleSetAutoLogin = async() => {
    try {
        const response = await fetch("http://" + ip_adress + "/protected");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Data received:", data.token);
        try {
          await AsyncStorage.setItem('userToken', data.token);
          console.log('Token saved successfully');
        } catch (error) {
          console.error('Error saving token:', error);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
  }

  const toggleSwitch = async() => {
    if (isEnabled === false){
        setIsEnabled(true);
        handleSetAutoLogin()
    }
    if (isEnabled === true){
        setIsEnabled(false);
        await AsyncStorage.removeItem('userToken');
    }
  };

  return (
    <View style={[styles.container, styles.vpnButtonHolder]}>
    <View style={styles.notificationHolder}>
      <TouchableOpacity
        style={[styles.button, isEnabled ? styles.activeButton : styles.inactiveButton]}
        onPress={toggleSwitch}
      >
        <Text style={styles.buttonText}>{isEnabled ? 'Disable Auto Login' : 'Enable Auto Login'}</Text>
      </TouchableOpacity>
      <Switch
        trackColor={{ false: '#767577', true: Colors.darkSubtle }}
        thumbColor={isEnabled ? 'green' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={styles.switch}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    width: '75%'
  },
  activeButton: {
    backgroundColor: Colors.navbar,
    borderColor: Colors.subtleHigher,
  },
  inactiveButton: {
    backgroundColor: Colors.sky,
    borderColor: Colors.navbar,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  switch: {
    marginLeft: 10,
  },
  vpnButtonHolder: {
    width: "100%",
    height: "auto",
    marginVertical: 10,
    alignItems: "center",
  },
  notificationHolder: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    flexDirection: 'row'
  },
});

export default AutoLogin;
