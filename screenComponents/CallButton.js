import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import Colors from "./Colors";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";


const CallButton = ({ phoneNumber }) => {
  const handleCallPress = () => {
    const phoneUrl = `tel:${phoneNumber}`;

    // Check if the device supports making phone calls
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          // Open the phone dialer
          return Linking.openURL(phoneUrl);
        } else {
          console.error("Phone calls not supported on this device");
        }
      })
      .catch((error) =>
        console.error("Error checking phone call support:", error)
      );
  };

  return (
    <View style={styles.vpnButtonHolder}>
      <View style={styles.notificationHolder}>
        <Text style={styles.receptionText3}>
          Place a phone call to the Admin
        </Text>
        <TouchableOpacity onPress={handleCallPress} style={styles.button2}>
          <Text style={styles.receptionText3}>
            Call{" "}
            <MaterialCommunityIcons
              name="phone"
              size={15}
              color="rgba(255,255,255,0.6)"
            />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  receptionText3: {
    color: Colors.subtleHigher,
    fontSize: 10,
    marginVertical: 10,
    textTransform: "uppercase",
  },
  vpnButtonHolder: {
    width: "100%",
    height: "auto",
    marginVertical: 10,
    alignItems: "center",
  },
  button2: {
    backgroundColor: Colors.darkSubtle,
    color: Colors.white,
    padding: 10,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  notificationHolder: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
});

export default CallButton;
