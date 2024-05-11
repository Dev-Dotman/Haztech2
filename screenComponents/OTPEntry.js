import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VpnPage from "./VpnPage";
import Documentation from "./Documentation";
import { date } from "yup";
import { useNavigation } from "@react-navigation/native";
import IpAdress from "./IpAdress";
import Colors from "./Colors";

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navbar,
    alignItems: "center",
    paddingVertical: "30%",
  },
  inputView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 250,
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
  },
  button: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#EEf5db",
  },
  button2: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#EEf5db",
  },
});
var ip_adress = IpAdress.ip;

const OTPEntry = ({firstName, lastName, email, password, dummytoken, confidant1, confidant2}) => {
  const [otp, setOtp] = useState("");
  const [otpgotten, setOtpgotten] = useState("");
  const [otpValidated, setOtpValidated] = useState(false);
  const [listdata, setListData] = useState([]);
  const navigation = useNavigation();

  const handleOtpChange = (text) => {
    setOtp(text);
  };

  const sendOtp = async() => {
    const response = await fetch(`http://${ip_adress}/sendotp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({firstName, lastName, email, password, dummytoken}),
        });
      
        // Handle the response
        if (response.ok) {
          // Parse the response as JSON
          const data = await response.json();
      
          // Handle the success or failure based on the response
          if (data.message === "OTP sent successfully") {
            // Extr;
          } else {
            alert("OTP failed to send, check if your email address is valid");
          }
        } else {
          console.error('HTTP error:', response.status);
        }
      } 
  

  const handleVerifyOtp = async () => {
    // Implement verification logic here
    console.log("Verifying OTP:", otp);

    try {
      const response = await fetch("http://" + ip_adress + "/api/get-list2");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      data.map((otp1) => {
        console.log(otp1.otp);
        setOtpgotten(otp1.otp);
      });

      console.log("Data received:", data);
      console.log(otpgotten);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }

    if (otp === '') {
      return
    } else if (otp === otpgotten) {
      try {
        // Encode sensitive data before sending
        
      
        // Send data to the backend using the Fetch API
        const response = await fetch(`http://${ip_adress}/user_receiver`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({firstName, lastName, email, password, dummytoken, confidant1, confidant2}),
        });
      
        // Handle the response
        if (response.ok) {
          // Parse the response as JSON
          const data = await response.json();
      
          // Handle the success or failure based on the response
          if (data.success) {
            // Extract the JWT token from the response
            const token = data.token;
            try {
              const response = await fetch("http://" + ip_adress + "/protected");
      
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
      
              const data = await response.json();
              setListData(data);
              console.log("registration successful");
              alert("registration successful");
              navigation.navigate('Vpn')
      
              console.log("Data received:", data);
            } catch (error) {
              console.error("Error fetching data:", error.message);
            }
            
            // Store the token in a secure way (e.g., AsyncStorage or Redux store)
            // await AsyncStorage.setItem('token', token);
      
            // Display success message
            // alert("Success", "Registration successful");
      
            // Redirect to another screen or perform further actions as needed
            // Example: navigation.navigate('Home');
          } else {
            alert("Registration failed");
          }
        } else {
          console.error('HTTP error:', response.status);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      } 
    }
    else {
      alert("otp incorrect");
    }
  };

  if (otpValidated === false) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 10, width: '80%', textAlign: 'center', textTransform: 'uppercase' }}>
          we will have to confirm your email by sending an otp
        </Text>
        <TouchableOpacity style={styles.button2} onPress={sendOtp}>
          <Text>send OTP</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 40 }}>
          Enter OTP
        </Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleOtpChange(text + otp)}
            value={otp.slice(0, 1)}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleOtpChange(otp.slice(0, 1) + text)}
            value={otp.slice(1, 2)}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleOtpChange(otp.slice(0, 2) + text)}
            value={otp.slice(2, 3)}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleOtpChange(otp.slice(0, 3) + text)}
            value={otp.slice(3, 4)}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleOtpChange(otp.slice(0, 4) + text)}
            value={otp.slice(4, 5)}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleOtpChange(otp.slice(0, 5) + text)}
            value={otp.slice(5, 6)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
          <Text>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    );
  } 
};

export default OTPEntry;
