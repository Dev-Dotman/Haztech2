import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import CallButton from "./CallButton";
import Spinner from "react-native-loading-spinner-overlay";
import * as Notifications from "expo-notifications";
import Colors from "./Colors";
import IpAdress from "./IpAdress";

const PopupModal = ({ visible, onClose, message }) => {
  const [sosEmail, setSosEmail] = useState("");
  const [errmessage, setErrmessage] = useState("");
  const [listdata, setListData] = useState([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [sosMessage, setSosMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [notifiy, setNotify] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("http://" + ip_adress + "/protected");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setListData(data.user);
      setFname(listdata.firstName);
      setLname(listdata.lastName);
    } catch (error) {
    //   console.error("Error fetching data:", error.message);
    }
  };
  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generateRandomId = () => {
    return randomNumberInRange(1, 200);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 500);
  }, [3]);

  var ip_adress = IpAdress.ip;
  const handleSendsos = async () => {
    setLoading(true);
    await fetchData()
    const response = await fetch(`http://${ip_adress}/sendsos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sosEmail, sosMessage, fname, lname }),
    });

    // Handle the response
    if (response.ok) {
      // Parse the response as JSON
      const data = await response.json();
      const loginerr = data.message;
      setErrmessage(loginerr);
      Notifications.scheduleNotificationAsync({
        content: {
          title: "SOS MESSAGE",
          body: `you sent an sos to ${sosEmail}`,
        },
        trigger: null,
      });
      const randomId = generateRandomId();
      recentNotifications.push({ notifiy, randomId });
      setLoading(false);
      // Handle the success or failure based on the response
      if (data.message === "SOS sent successfully") {
        // Extr;
      } else {
        alert("SOS failed to send, check if your email address is valid");
        Notifications.scheduleNotificationAsync({
          content: {
            title: "SOS MESSAGE",
            body: "SOS failed to send",
          },
          trigger: null,
        });
        setLoading(false);
        const randomId = generateRandomId();
        recentNotifications.push({ notifiy, randomId });
      }
    } else {
      console.error("HTTP error:", response.status);
      setLoading(false);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
        
      <Spinner visible={loading} textStyle={styles.spinnerText} />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.vpnButtonHolder}>
            {/* <Text style={styles.receptionText}>
              sos system{" "}
              <MaterialCommunityIcons name="triangle" size={15} color="black" />
            </Text> */}
            <View style={styles.notificationHolder2}>
              <View style={styles.notCaption}>
                <Text style={styles.receptionText3}>
                  send a warning message if you're in danger
                </Text>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Confidants Email"
                    placeholderTextColor={Colors.subtleHigh}
                    onChangeText={(confidantsEmail) =>
                      setSosEmail(confidantsEmail)
                    }
                  />
                </View>
                <View style={styles.inputView2}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="SOS Message"
                    placeholderTextColor={Colors.subtleHigh}
                    multiline={true}
                    onChangeText={(Message) => setSosMessage(Message)}
                  />
                </View>
                <View style={styles.sosButtonHolder}>
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={handleSendsos}
                  >
                    <Text style={styles.receptionText4}>
                      send sos{" "}
                      <MaterialCommunityIcons
                        name="message"
                        size={15}
                        color={Colors.subtleHigher}
                      />
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.receptionText2}>{errmessage}</Text>
                <CallButton phoneNumber="08025738429" />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    width: '100%'
  },
  modalContent: {
    backgroundColor: Colors.navbar,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: '100%'
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor:  "rgba(0,0,0,0.2)",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: Colors.subtleHigher,
    fontWeight: "bold",
  },
  vpnButtonHolder: {
    width: "100%",
    height: "90%",
    marginVertical: 10,
    alignItems: "center",
    justifyContent: 'center'
  },
  receptionText3: {
    color: Colors.subtleHigher,
    fontSize: 10,
    marginVertical: 10,
    textTransform: "uppercase",
  },

  inputView: {
    backgroundColor: Colors.darkSubtle,
    borderRadius: 10,
    width: "100%",
    height: 55,
    marginBottom: 20,
    padding: 10,
    color: Colors.white
  },
  inputView2: {
    backgroundColor: Colors.darkSubtle,
    borderRadius: 10,
    width: "100%",
    height: 100,
    marginBottom: 20,
    padding: 10,
  },
  receptionText4: {
    color: Colors.subtleHigher,
    fontSize: 15,
    marginVertical: 6,
    textTransform: "uppercase",
  },
  receptionText2: {
    color: Colors.text,
    fontSize: 15,
    marginVertical: 10,
    textTransform: "uppercase",
  },
  sosButtonHolder: {
    width: "100%",
    height: "auto",
    marginVertical: 10,
    alignItems: "flex-end",
  },
  button2: {
    color: Colors.white,
    padding: 10,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: Colors.white,
  },
});

export default PopupModal;
