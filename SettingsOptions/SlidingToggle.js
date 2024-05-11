import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import Colors from "../screenComponents/Colors";

const SlidingToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  return (
    <View style={[styles.container, styles.vpnButtonHolder]}>
      <View style={styles.notificationHolder}>
        <TouchableOpacity
          style={[
            styles.button,
            isEnabled ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={toggleSwitch}
        >
          <Text style={styles.buttonText}>{isEnabled ? "ON" : "OFF"}</Text>
        </TouchableOpacity>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "green" : "#f4f3f4"}
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
    borderColor: "#aaa",
    width: "80%",
  },
  activeButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.subtleHigher,
  },
  inactiveButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.navbar,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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
});

export default SlidingToggle;
