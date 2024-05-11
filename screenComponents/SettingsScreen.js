import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  ScrollView,
  LogBox,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "./Colors";
import AutoLogin from "../SettingsOptions/AutoLogin";
import AutoTurnOn from "../SettingsOptions/AutoTurnOn";
import QuickSos from "../SettingsOptions/QuickSos";
import IpAdress from "./IpAdress";
import Confidants from "../SettingsOptions/Confidants";
import Spinner from "react-native-loading-spinner-overlay";

function SettingsScreen(props) {
  const [listdata, setListData] = useState([]);
  var ip_adress = IpAdress.ip;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("http://" + ip_adress + "/protected");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setListData(data.user);
    } catch (error) {
      // console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [3]);

  const handleLogout = async () => {
    const response = await fetch(`http://${ip_adress}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listdata }),
    });

    // Handle the response
    if (response.ok) {
      // Parse the response as JSON
      const data = await response.json();

      // Handle the success or failure based on the response
      if (data.message === "Logout successful") {
        console.log("message: ", data.message);

        navigation.navigate("Home");
      } else {
        alert("logout unsuccessful");
      }
    } else {
      console.error("HTTP error:", response.status);
    }
  };

  return (
    <SafeAreaView
      style={{
        marginTop:  "auto",
        backgroundColor: Colors.sky,
        flex: 1,
      }}
    >
    <Spinner visible={loading} textStyle={styles.spinnerText} />
      <ScrollView>
        <TouchableOpacity
          onPress={() => navigation.navigate("Vpn")}
          style={{
            backgroundColor: Colors.navbar,
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 89,
            margin: 10,
          }}
        >
          <Ionicons
            name="arrow-back-outline"
            size={35}
            color="rgba(255,255,255,0.3)"
          />
        </TouchableOpacity>
        <View style={{
            width: '100%',
            alignItems: 'center',
            marginVertical: 20
        }}>
          <Text style={styles.receptionText4}>
            settings{" "}
            <Ionicons name="settings" size={25} color="rgba(255,255,255,0.6)" />
          </Text>
        </View>

        <Confidants/>
        <AutoLogin />
        <AutoTurnOn />
        <QuickSos />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  receptionText4: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 25,
    marginVertical: 6,
    textTransform: "uppercase",
  },
});

export default SettingsScreen;
