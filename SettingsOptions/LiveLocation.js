import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  LogBox,
} from "react-native";
import Colors from "../screenComponents/Colors";
import * as Location from "expo-location";
import IpAdress from "../screenComponents/IpAdress";
import { Picker } from "@react-native-picker/picker";
import UserApp from "../screenComponents/UserApp";

function LiveLocation({ address }) {
  const [isEnabled, setIsEnabled] = useState(false);
  var ip_adress = IpAdress.ip;
  const [listdata, setListData] = useState([]);
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState(600000);
  const [selectedCron, setSelectedCron] = useState("*/5 * * * *");
  const [expTime, setExpTime] = useState("5m");
  LogBox.ignoreLogs(['Error: Cannot obtain current location: Error Domain=kCLErrorDomain Code=0 "(null)"']); // Replace '...' with the specific warning message

  const frequencyOptions = [
    { label: "10 minutes", value: 600000 },
    { label: "15 minutes", value: 900000 },
    { label: "30 minutes", value: 1800000 },
    { label: "1 hour", value: 3600000 },
    { label: "2 hours", value: 7200000 },
    { label: "3 hours", value: 10800000 },
  ];

  const cronOptions = [
    { label: "Every 5 minutes", value: "*/5 * * * *" },
    { label: "Every 10 minutes", value: "*/10 * * * *" },
    { label: "Every 15 minutes", value: "*/15 * * * *" },
    { label: "Every 25 minutes", value: "*/25 * * * *" },
    { label: "Every 35 minutes", value: "*/35 * * * *" },
    { label: "Every 45 minutes", value: "*/45 * * * *" },
    { label: "Every 55 minutes", value: "*/55 * * * *" },
    { label: "Every 1 hour", value: "0 */1 * * *" },
  ];

  const updateFrequency = (value) => {
    setSelectedFrequency(value);
  };

  const updateCron = (value) => {
    setSelectedCron(value);
    if (value === "*/5 * * * *") {
      setExpTime("5m");
    } else if (value === "*/10 * * * *") {
      setExpTime("10m");
    } else if (value === "*/15 * * * *") {
      setExpTime("15m");
    } else if (value === "*/25 * * * *") {
      setExpTime("25m");
    } else if (value === "*/35 * * * *") {
      setExpTime("35m");
    } else if (value === "*/45 * * * *") {
      setExpTime("45m");
    } else if (value === "*/55 * * * *") {
      setExpTime("55m");
    } else if (value === "0 */1 * * *") {
      setExpTime("1h");
    }
  };

  const toggleSwitch = () => {
    if (isEnabled === false) {
      sendNotification();
      setIsEnabled(true);
    }
    if (isEnabled === true) {
    }
  };

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

  const updateLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      // Send the updated location to the server
      const response = await fetch(`http://${ip_adress}/api/update-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      });

      const result = await response.json();
      console.log("notification result:", result.message);

      console.log("Location updated:", location.coords);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  useEffect(() => {
    // Update location when the component mounts
    updateLocation();

    // Update location every 2 minutes
    const intervalId = setInterval(updateLocation, 2 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const sendNotification = async () => {
    updateLocation();
    const email = listdata.confidant1;
    const email2 = listdata.confidant2;
    const message = `${listdata.lastName} ${listdata.firstName} shared their live location with you`;
    const type = 1;
    const start = 1;
    const stop = 0;
    const senders_email = listdata.email;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      // Send the updated location to the server
      try {
        const response = await fetch(`http://${ip_adress}/addNotification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            message,
            type,
            latitude,
            longitude,
            email2,
            address,
            start,
            stop,
            selectedFrequency,
            selectedCron,
            expTime,
            senders_email,
          }),
        });
        const result = await response.json();
        console.log("notification result:", result);
        setTimeout(() => {
          setIsEnabled(false);
        }, selectedFrequency);

        if (result.success) {
          console.log("motification message");
        } else {
          // Handle unsuccessful login (show error message, etc.)
          console.log(errors);
        }
      } catch (error) {
        console.log("notification error:", error);
      }

      console.log("Location updated:", location.coords);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const stopNotification = async () => {
    const email = listdata.confidant1;
    const email2 = listdata.confidant2;
    const message = `${listdata.lastName} ${listdata.firstName} shared their live location with you`;
    const type = 1;
    const start = 0;
    const stop = 1;
    try {
      const response = await fetch(`http://${ip_adress}/addNotification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          message,
          type,
          latitude,
          longitude,
          email2,
          address,
          start,
          stop,
        }),
      });
      const result = await response.json();
      console.log("notification result:", result);

      if (result.success) {
        console.log("motification message");
      } else {
        // Handle unsuccessful login (show error message, etc.)
        console.log(errors);
      }
    } catch (error) {
      console.log("notification error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={[styles.container, styles.vpnButtonHolder]}>
      <ScrollView
        style={{
          height: "80%",
          width: "100%",
          marginTop: "20%",
          paddingVertical: 10,
          color: "white",
          paddingBottom: 400
        }}
      >
        <View style={styles.notificationHolder}>
          <TouchableOpacity
            style={[
              styles.button,
              isEnabled ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={toggleSwitch}
          >
            <Text style={styles.buttonText}>
              {isEnabled
                ? "live location sharing active"
                : "start sharing live location"}
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
        <Text
          style={[
            styles.buttonText,
            { marginTop: 40, width: "100%", textAlign: "center" },
          ]}
        >
          how long do you want sharing to be active
        </Text>
        <Picker
          selectedValue={selectedFrequency}
          onValueChange={(itemValue) => updateFrequency(itemValue)}
          style={{
            height: 200,
            width: "100%",
            backgroundColor: Colors.subtleHigher,
            marginTop: 40,
            borderRadius: 20,
            borderWidth: 4,
            borderColor: Colors.white,
          }}
        >
          {frequencyOptions.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.label}
              value={option.value}
              style={{ color: Colors.darkSubtle }}
            />
          ))}
        </Picker>
        {/* <Text>Selected Frequency: {selectedFrequency / 60000} minutes</Text> */}
        <Text
          style={[
            styles.buttonText,
            {
              marginTop: 40,
              width: "100%",
              textAlign: "center",
              color: Colors.white,
            },
          ]}
        >
          how often do you want to share
        </Text>
        <Picker
          selectedValue={selectedCron}
          onValueChange={(itemValue) => updateCron(itemValue)}
          style={{
            height: 200,
            width: "100%",
            backgroundColor: Colors.subtleHigher,
            marginVertical: 40,
            borderRadius: 20,
            borderWidth: 4,
            borderColor: Colors.white
          }}
        >
          {cronOptions.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.label}
              value={option.value}
              style={{ color: Colors.darkSubtle }}
            />
          ))}
        </Picker>
        {/* <Text>Selected Cron Schedule: {selectedCron}</Text> */}
        <View style={{
            height: 200,
            width: "100%",
            marginVertical: 20,
            borderRadius: 20,
          }}></View>
      </ScrollView>
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
    width: "80%",
    height: 40,
  },
  activeButton: {
    backgroundColor: Colors.highlight,
    borderColor: Colors.subtleHigher,
  },
  inactiveButton: {
    backgroundColor: Colors.sky,
    borderColor: Colors.navbar,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
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
    flexDirection: "row",
  },
  notificationHolder2: {
    width: "100%",
    height: "auto",
    textAlign: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
});

export default LiveLocation;
