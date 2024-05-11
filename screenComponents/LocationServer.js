import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  LogBox,
} from "react-native";
import IpAdress from "./IpAdress";
import Colors from "./Colors";
import UserApp from "./UserApp";
import LiveMap from "./LiveMap";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";

function LocationServer(props) {
  const [fetchLive, setFetchLive] = useState(false);
  const [code, setCode] = useState("");
  const ip_address = IpAdress.ip;
  const [locationData, setLocationData] = useState([]);
  const [mapVisible, setMapVisible] = useState(false);
  const baseCallbackURL = `http://${ip_address}`;
  const path = `/location-update/`;
  const [locationHistory, setLocationHistory] = useState([]);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState("");
  LogBox.ignoreLogs([
    "Error fetching location updates: [TypeError: Network request failed]",
  ]);
  LogBox.ignoreLogs([
    'Warning: No native splash screen registered for given view controller. Call "SplashScreen.show" for given view controller first.',
  ]);

  const [callbackUrl, setCallbackUrl] = useState("");

  const handleAddWatcher = async () => {
    setLoading(true);
    const response = await fetch("http://" + ip_address + "/protected");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const userId = data.user.email;
    try {
      // Send a request to the server to add the watcher
      const callbackURL = `${baseCallbackURL}${path}${code}`;
      const response = await fetch(`http://${ip_address}/addWatcher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, callback: baseCallbackURL, code, path }),
      });
      const data = await response.json();
      setCallbackUrl(data.watcherEndpoint);
      console.log(data.watcherEndpoint);

      if (data.success === true) {
        setLoading(false);
        alert("Watcher Added", "You have been added as a watcher.");
        setFetchLive(true);
      } else {
        setLoading(false);
        alert(
          "Failed to add watcher, ask the Creator if the network is still active . Check your key or Please try again."
        );
      }
    } catch (error) {
      console.error("Error adding watcher:", error);
      setLoading(false);
      alert(
        "Error",
        "Something went wrong. Check your key or  Please try again."
      );
    }
  };

  const handleCodeChange = (text) => {
    setCode(text);
  };

  useEffect(() => {
    // Use the isSharingLocation state to periodically send location updates to the server
    let interval;

    if (fetchLive) {
      interval = setInterval(() => {
        fetchLocationUpdates();
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [fetchLive]);

  const fetchLocationUpdates = async () => {
    try {
      const watcherResponse = await fetch(
        `http://${ip_address}${callbackUrl}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationData: "Sample Location Data",
          }),
        }
      );

      if (!watcherResponse.ok) {
        throw new Error(`HTTP error! Status: ${watcherResponse.status}`);
      }

      const watcherData = await watcherResponse.json();

      if (!watcherData.updates[0]) {
        setFetchLive(true);
        const newLocationHistory = [...locationHistory, watcherData.updates];
        setLocationHistory(newLocationHistory);

        // Keep only the last 5 coordinates for the polyline
        setPolylineCoordinates(newLocationHistory[0]);
        console.log(polylineCoordinates);
        setFetchLive(false);
        console.log(fetchLive);
      } else {
        setFetchLive(true);
        const newLocationHistory = [...locationHistory, watcherData.updates];
        setLocationHistory(newLocationHistory);

        // Keep only the last 5 coordinates for the polyline

        setPolylineCoordinates(
          newLocationHistory[newLocationHistory.length - 1]
        );
        setCreator(watcherData.creator);
      }

      // Update location history and polyline coordinates
    } catch (error) {
      console.log("Error fetching location updates:", error);
    }
  };

  const myLoc = [];
  const yourLocation = async () => {
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
  };

  return (
    <SafeAreaView
      style={{
        marginTop: "auto",
        backgroundColor: Colors.sky,
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Spinner visible={loading} textStyle={styles.spinnerText} />
      <UserApp />
      <Text style={styles.receptionText5}>OR</Text>
      <View styles={styles.vpnButtonHolder}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter the 10-digit code"
          value={code}
          onChangeText={(text) => setCode(text)}
        />
        <View
          styles={{
            width: "100%",
            height: "auto",
            marginVertical: 10,
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={handleAddWatcher} style={styles.button}>
            {!fetchLive ? (
              <Text style={styles.receptionText4}>join Network (Watcher)</Text>
            ) : (
              <Text style={styles.receptionText4}>Watching Network</Text>
            )}
          </TouchableOpacity>
          <LiveMap
            visible={mapVisible}
            onClose={() => setMapVisible(false)}
            locationData={polylineCoordinates}
            creator={creator}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => [
          fetchLive
            ? setMapVisible(true)
            : alert(
                "You are not watching any users network\n Connect to a network to continue"
              ),
        ]}
        style={{
          backgroundColor: Colors.navbar,
          width: 50,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 89,
          margin: 10,
          position: "absolute",
          zIndex: 1,
          bottom: "12%",
          right: "2%",
        }}
      >
        {fetchLive ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: 15,
              width: 15,
              backgroundColor: !polylineCoordinates[0] ? "red" : "green",
              zIndex: 1,
              borderRadius: 10,
            }}
          ></View>
        ) : (
          ""
        )}
        <MaterialCommunityIcons name="monitor" size={35} color={Colors.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  receptionText4: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    marginVertical: 6,
    textTransform: "uppercase",
  },
  receptionText5: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 25,
    marginBottom: 16,
    textTransform: "uppercase",
    width: "100%",
    textAlign: "center",
  },
  TextInput: {
    height: 50,
    fontSize: 25,
    padding: 3,
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
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 4,
    borderColor: Colors.navbar,
    marginVertical: 30,
    marginHorizontal: "10%",
  },
  vpnButtonHolder: {
    width: "100%",
    height: "auto",
    alignItems: "center",
  },
});

export default LocationServer;
