import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import Colors from '../screenComponents/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuickSos = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = async() => {
    if (isEnabled === false){
        setIsEnabled(true);
        await AsyncStorage.setItem('QuickSos', 'true');
    }
    if (isEnabled === true){
        setIsEnabled(false);
        await AsyncStorage.removeItem('QuickSos');
    }
  };


  useEffect(() => {
    const QuickSos = async () => {
        try {
          const auto = await AsyncStorage.getItem('QuickSos');
          if (auto) {
            setIsEnabled(true)
            return auto;
  
          } else {
            console.log('No token found');
            return null;
          }
        } catch (error) {
          console.error('Error retrieving token:', error);
          return null;
        }
      };

      QuickSos()
  }, [3]);

  return (
    <View style={[styles.container, styles.vpnButtonHolder]}>
    <View style={styles.notificationHolder}>
      <TouchableOpacity
        style={[styles.button, isEnabled ? styles.activeButton : styles.inactiveButton]}
        onPress={toggleSwitch}
      >
        <Text style={styles.buttonText}>{isEnabled ? 'long press to send Quick sos' : 'long press to send Quick sos'}</Text>
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
    textTransform: 'capitalize'
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

export default QuickSos;
