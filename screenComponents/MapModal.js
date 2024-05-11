import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";
import Colors from "./Colors";

function MapModal({
  visible,
  onClose,
  latitude,
  longitude,
  message,
  sentDate,
  expiryDate,
  sentTime,
  expiryTime,
  liveMap,
  coordinates,
}) {
  const [address, setAddress] = useState("");

  const newArray = coordinates ? coordinates.map(({ latitude, longitude }) => ({
    latitude,
    longitude
  })): '';




  const handleGetAddress = async () => {
    try {
      if (latitude !== null && longitude !== null) {
        const addressData = await Location.reverseGeocodeAsync({
          latitude: latitude,
          longitude: longitude,
        });
        if (addressData && addressData.length > 0 && addressData[0]?.name) {
          setAddress(addressData[0].name);
        } else {
          setAddress("Unknown");
        }
      }
    } catch (error) {
      setAddress("Unknown");
    }
  };

  useEffect(() => {
    handleGetAddress();
  }, [latitude, longitude]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {!liveMap ? (
          <View
            style={{
              width: "90%",
              height: "80%",
              backgroundColor: Colors.navbar,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <MapView
              style={{ width: "100%", height: "70%" }}
              initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                title="Location"
              />
            </MapView>
            <View
              style={{
                width: "100%",
                height: "30%",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  textTransform: "capitalize",
                  padding: 10,
                  marginHorizontal: 10,
                  color: Colors.subtleHigher,
                  position: "absolute",
                  width: "100%",
                  backgroundColor: Colors.navbar,
                  zIndex: 1,
                  top: "1%",
                  textAlign: "center",
                }}
              >
                location: {address}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  textTransform: "capitalize",
                  padding: 10,
                  marginHorizontal: 10,
                  color: Colors.subtleHigher,
                  position: "absolute",
                  width: "100%",
                  backgroundColor: Colors.navbar,
                  zIndex: 1,
                  top: "30%",
                  textAlign: "center",
                }}
              >
                {message}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  textTransform: "capitalize",
                  padding: 10,
                  marginHorizontal: 10,
                  color: Colors.subtleHigher,
                  position: "absolute",
                  width: "100%",
                  backgroundColor: Colors.navbar,
                  zIndex: 1,
                  top: "60%",
                  textAlign: "center",
                }}
              >
                sent at: {sentDate} {sentTime}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  textTransform: "capitalize",
                  padding: 10,
                  marginHorizontal: 10,
                  color: Colors.subtleHigher,
                  position: "absolute",
                  width: "100%",
                  backgroundColor: Colors.navbar,
                  zIndex: 1,
                  top: "80%",
                  textAlign: "center",
                }}
              >
                expires: {expiryDate} {expiryTime}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              width: "90%",
              height: "80%",
              backgroundColor: Colors.navbar,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <MapView
              style={{ width: "100%", height: "100%" }}
              initialRegion={{
                latitude: newArray[0].latitude,
                longitude: newArray[0].longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {/* Render polyline */}
              <Polyline
                coordinates={newArray}
                strokeColor="yellow" // Line color
                strokeWidth={15} // Line width
              />
              <Marker
                coordinate={coordinates[coordinates.length - 1]}
                title="Selected Location"
              />
            </MapView>
            <Text
                style={{
                  fontSize: 20,
                  textTransform: "capitalize",
                  padding: 10,
                  color: Colors.subtleHigher,
                  position: "absolute",
                  width: "100%",
                  backgroundColor: Colors.compliment,
                  zIndex: 1,
                  textAlign: "center",
                }}
              >
                location: {address}
              </Text>
          </View>
        )}

        <TouchableOpacity onPress={onClose}>
          <Text
            style={{
              color: Colors.text,
              marginTop: 10,
              width: 100,
              backgroundColor: Colors.darkSubtle,
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default MapModal;
