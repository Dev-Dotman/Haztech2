import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  TextInput,
} from "react-native";
import Colors from "../screenComponents/Colors";
import IpAdress from "../screenComponents/IpAdress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";

function Confidants(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  const [confidant1, setConfidant1] = useState('');
  const [confidant2, setConfidant2] = useState('');
  const [listdata, setListData] = useState([]);
  const [value, setValue] = useState('non-edit')
  var ip_adress = IpAdress.ip;
  const [loading, setLoading] = useState(false);

  const toggleSwitch = async () => {
    if (isEnabled === false) {
      setIsEnabled(true);
      await AsyncStorage.setItem("confidants", "true");
    }
    if (isEnabled === true) {
      setIsEnabled(false);
      await AsyncStorage.removeItem("confidants");
    }
  };

  const handleEditable = () => {
    setValue('edit')
  }

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("confidants");
        // const confidant1 = await AsyncStorage.getItem("confidant1");
        // const confidant2 = await AsyncStorage.getItem("confidant2");
        // if (confidant1 && confidant2) {

        // }else {
        //   return null;
        // }
        if (token) {
          setIsEnabled(true);

          return token;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
      }
    };

    getToken();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://" + ip_adress + "/protected");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();



      setListData(data.user);
      setVal1(listdata.confidant1);
      setVal2(listdata.confidant2);
    } catch (error) {
      // console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  });

  const handleConfidants = async () => {
    fetchData();
    setLoading(true)
    const firstName = listdata.firstName;
    const email = listdata.email;
    const lastName = listdata.lastName;
    console.log(listdata);
    console.log(email);
    console.log(firstName);
    console.log(lastName);

      try {
        // Encode sensitive data before sending

        // Send data to the backend using the Fetch API
        const response = await fetch(`http://${ip_adress}/confidant_register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            confidant1,
            confidant2,
          }),
        });

        // Handle the response
        if (response.ok) {
          // Parse the response as JSON
          const data = await response.json();

          // Handle the success or failure based on the response
          if (data.success) {
            setLoading(false)
            // Extract the JWT token from the response

            // Store the token in a secure way (e.g., AsyncStorage or Redux store)
            // await AsyncStorage.setItem('token', token);

            // Display success message
            alert("Success", "Registration successful");
            // await AsyncStorage.setItem("confidant1", confidant1);
            // await AsyncStorage.setItem("confidant2", confidant2);
            setConfidant1(confidant1);
            setConfidant2(confidant2);

            // Redirect to another screen or perform further actions as needed
            // Example: navigation.navigate('Home');
          } else {
            setLoading(false)
            alert("Registration failed");
          }
        } else {
          console.error("HTTP error:", response.status);
          setLoading(false)
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setLoading(false)
      }
      fetchData();
      console.log(listdata);
      setLoading(false)
  };

  return (
    <View style={[styles.container, styles.vpnButtonHolder]}>
    <Spinner visible={loading} textStyle={styles.spinnerText} />
      <View style={styles.notificationHolder}>
        <TouchableOpacity
          style={[
            styles.button,
            isEnabled ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={toggleSwitch}
        >
          <Text style={styles.buttonText}>
            {isEnabled ? "Confidants" : "Enable Confidants"}
          </Text>
        </TouchableOpacity>
        <Switch
          trackColor={{ false: "#767577", true: Colors.darkSubtle }}
          thumbColor={isEnabled ? "green" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={styles.switch}
        />
      </View>
      {isEnabled ? (
        <View style={styles.vpnButtonHolder}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Confidant 1"
              placeholderTextColor="rgba(255,255,255, 0.4)"
              onChangeText={(Confidant) => setConfidant1(Confidant)}
              value={value === 'edit' ? confidant1 : val1}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Confidant 2"
              placeholderTextColor="rgba(255,255,255, 0.4)"
              onChangeText={(Confidant) => setConfidant2(Confidant)}
              value={value === 'edit' ? confidant2 : val2}
            />
          </View>
          <View style={{
            flexDirection: 'row',
            width: '80%',
            justifyContent: 'space-between'
          }}>
          <TouchableOpacity
            style={styles.RegisterBtn}
            onPress={handleEditable}
          >
            <Text style={styles.buttonText}>Edit Confidants</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.RegisterBtn}
            onPress={handleConfidants}
          >
            <Text style={styles.buttonText}>Save Confidants</Text>
          </TouchableOpacity>
          </View>
        </View>
      ) : (
        ""
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    width: "75%",
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
    color: "white",
    fontWeight: "bold",
    textTransform: "capitalize",
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
    flexDirection: "row",
  },
  inputView: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    width: "90%",
    height: 55,
    marginBottom: 20,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: "white",
  },
  RegisterBtn: {
    width: "45%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    backgroundColor: Colors.navbar,
  },
});

export default Confidants;
