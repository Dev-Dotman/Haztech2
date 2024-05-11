import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Switch,
} from "react-native";
import { io } from "socket.io-client";
import IpAdress from "./IpAdress";
import Colors from "./Colors";
import * as Location from "expo-location";
import Spinner from "react-native-loading-spinner-overlay";

const UserApp = () => {
  //   const [socket, setSocket] = useState(null);
  const [email, setEmail] = useState("");
  const ip_address = IpAdress.ip;
  const [listdata, setListData] = useState([]);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [userCode, setUserCode] = useState("");
  const socket = io(`http://${ip_address}`);
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [confidant1, setConfidant1] = useState("");
  const [confidant2, setConfidant2] = useState("");

  const [user_id, setUser_id] = useState("");

  const createNetwork = async () => {
    setLoading(true);
    const response = await fetch("http://" + ip_address + "/protected");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const userId = data.user.email;
    setUser_id(data.user.email);
    const confidant1 = data.user.confidant1;
    const confidant2 = data.user.confidant2;
    setConfidant1(data.user.confidant1)
    setConfidant2(data.user.confidant2)
    const response2 = await fetch(`http://${ip_address}/createNetwork`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, confidant1, confidant2, email }),
    });

    const data2 = await response2.json();
    setUserCode(data2.networkId);

    if (response2.ok) {
      alert("network created successfully.");
      fetchLocation();
      setIsSharingLocation(true);
      setIsEnabled(true);
      setLoading(false);
    } else {
      alert("Failed to Create network.");
      setLoading(false);
    }
  };

  const fetchLocation = async () => {
    try {
      const response = await fetch("http://" + ip_address + "/protected");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setListData(data.user);
      const userId = data.user.email;
      const confidant1 = data.user.confidant1;
      const confidant2 = data.user.confidant2;
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.error("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Send user location to the server
      const response2 = await fetch(
        `http://${ip_address}/updateLocation/${user_id}/${userCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ locationData }),
        }
      );
      if (response2.ok) {
        // console.log("Location update sent successfully:", locationData);
      } else {
        console.log("Failed to send location update.");
      }

      // Update local state for UI
    } catch (error) {
      console.log("Error fetching location:", error);
    }
  };

  useEffect(() => {
    // Use the isSharingLocation state to periodically send location updates to the server
    let interval;

    if (isSharingLocation) {
      interval = setInterval(() => {
        fetchLocation();
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isSharingLocation]);

  const handleToggle = async () => {
    if (isSharingLocation) {
      setLoading(true);
      // Stop location sharing
      // Additional logic to disconnect from network and cleanup
      try {
        console.log(user_id);
        console.log(userCode);
        // Remove the user from the network on the server
        const response = await fetch(
          `http://${ip_address}/removeUser/${user_id}/${userCode}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({ confidant1, confidant2, email }),
          }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setLoading(false);
          alert(" Network Deactivated.");
          setIsEnabled(false);
          setIsSharingLocation(false);
        } else {
          console.error("Failed to remove user from the network.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error removing user from the network:", response.error);
        setLoading(false);
      }
    } else {
      // Start location sharing
      try {
        // Additional logic to create network, generate JWT, and send emails
        createNetwork();
      } catch (error) {
        console.error("Error creating network:", error);
      }
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.sky,
        justifyContent: "center",
      }}
    >
      <Spinner visible={loading} textStyle={styles.spinnerText} />
      <View style={styles.vpnButtonHolder}>
        {isEnabled ? "" : <TextInput
          placeholder="Invite User To Network(Optional)"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.TextInput}
        />}
        <View onPress={handleToggle} style={styles.button}>
          <Text style={styles.receptionText4}>{!isEnabled ?  <Text>create network (User)</Text> : <Text>Network Active</Text>}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "green" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggle}
            value={isEnabled}
            style={styles.switch}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  receptionText4: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    marginVertical: 6,
    textTransform: "uppercase",
  },
  TextInput: {
    height: 50,
    fontSize: 25,
    padding: 6,
    color: "black",
    backgroundColor: Colors.subtleHigher,
    width: "90%",
    borderRadius: 10,
    marginHorizontal: "5%",
  },
  button: {
    backgroundColor: Colors.darkSubtle,
    color: Colors.white,
    padding: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 10,
    borderWidth: 4,
    borderColor: Colors.navbar,
    marginTop: 30,
    marginHorizontal: "10%",
    flexDirection: "row",
  },
  vpnButtonHolder: {
    width: "100%",
    height: "auto",
    marginVertical: 10,
    alignItems: "center",
  },
});

export default UserApp;
