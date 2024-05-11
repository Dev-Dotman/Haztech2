import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";
import Colors from "./Colors";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

function LiveMap({ visible, onClose, locationData, creator }) {
  const locationData2 = locationData[0]
    ? locationData.map(({ latitude, longitude }) => ({
        latitude,
        longitude,
      }))
    : "";

  const locationTag = `${creator}'s location`;

  const myLoc = [];
  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.error("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Send user location to the server
      myLoc.push(locationData);

      if (myLoc.length > 5) {
        // Remove the first item in the array
        myLoc.shift();
      }

      // Update local state for UI
    } catch (error) {
      console.log("Error fetching location:", error);
    }
  };

  useEffect(() => {
    // Use the isSharingLocation state to periodically send location updates to the server
    let interval;

    interval = setInterval(() => {
      fetchLocation();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const markers = [
    {
      id: 1,
      title: `${creator}'s Location`,
      coordinate: locationData2[0]
        ? locationData2[0]
        : { latitude: 0, longitude: 0 },
    },
    {
      id: 2,
      title: "Your Location",
      coordinate: myLoc[0]
        ? myLoc[myLoc.length - 1]
        : { latitude: 0, longitude: 0 },
    },
  ];

  const polylines = [locationData2, myLoc];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {locationData.length > 0 && (
          <MapView
            style={{ width: "100%", height: "100%" }}
            initialRegion={{
              latitude: locationData2[0] ? locationData2[0].latitude : 0,
              longitude: locationData2[0] ? locationData2[0].longitude : 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                title={marker.title}
              />
            ))}
            {polylines.map((polyline, index) => (
              <Polyline
                key={index}
                coordinates={polyline}
                strokeColor="yellow"
                strokeWidth={8}
              />
            ))}
          </MapView>
        )}
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: Colors.sky,
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 89,
            margin: 10,
            position: "absolute",
            zIndex: 1,
            top: "5%",
            right: "0%",
          }}
        >
          <MaterialCommunityIcons
            name={"close"}
            size={35}
            color={Colors.text}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default LiveMap;
