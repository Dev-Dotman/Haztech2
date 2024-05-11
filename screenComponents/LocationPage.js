import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  RefreshControl,
  PanResponder,
  ScrollView,
  Dimensions,
  LogBox,
} from "react-native";
import Colors from "./Colors";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import { useNavigation } from "@react-navigation/native";
import LiveLocation from "../SettingsOptions/LiveLocation";
import IpAdress from "./IpAdress";
import MapModal from "./MapModal";

function LocationPage(props) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const screenHeight = Dimensions.get("window").height;
  const [listdata, setListData] = useState([]);
  const [drawerPosition] = useState(new Animated.ValueXY({ x: -300, y: 0 }));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [locationDetails, setLocationDetails] = useState([]);
  const [locationPosition] = useState(
    new Animated.ValueXY({ x: 30, y: 0.7 * screenHeight })
  );
  const [sharePosition] = useState(
    new Animated.ValueXY({ x: 0, y: 0.8 * screenHeight })
  );
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [notificationsAvailable, setNotificationsAvailable] = useState(false);
  const [newNotifications, setNewNotifications] = useState(false);
  const ip_adress = IpAdress.ip;
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLatitude, setModalLatitude] = useState("");
  const [modalmessage, setModalmessage] = useState("");
  const [modalsentDate, setModalsentDate] = useState("");
  const [modalexpiryDate, setModalexpiryDate] = useState("");
  const [modalsentTime, setModalsentTime] = useState("");
  const [modalLongitude, setModalLongitude] = useState("");
  const [modalexpiryTime, setModalexpiryTime] = useState("");
  const [fullScreen, setFullScreen] = useState(true);
  LogBox.ignoreLogs([
    'Warning: Each child in a list should have a unique "key" prop.',
  ]);
  const [sender_email, setSender_email] = useState("");
  const [stop_time2, setStop_time2] = useState("");
  const [liveMap, setLiveMap] = useState(false);
  const [coordinates, setCoordinates] = useState([]);

  const currentTime = new Date();

  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generateRandomId = () => {
    return randomNumberInRange(1, 200);
  };

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const increaseShare = () => {
    if (!fullScreen) {
      Animated.spring(sharePosition.y, {
        toValue: 0.3 * screenHeight,
        useNativeDriver: false,
      }).start();
      Animated.spring(locationPosition.y, {
        toValue: 0.45 * screenHeight,
        useNativeDriver: false,
      }).start();
      setFullScreen(true);
    } else {
      Animated.spring(sharePosition.y, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
      Animated.spring(locationPosition.y, {
        toValue: 0.15 * screenHeight,
        useNativeDriver: false,
      }).start();
      setFullScreen(false);
    }
  };

  const toggleShare = () => {
    if (!isShareOpen) {
      if (isDrawerOpen) {
        closeDrawer();
        Animated.spring(sharePosition.y, {
          toValue: 0.3 * screenHeight,
          useNativeDriver: false,
        }).start();
        Animated.spring(locationPosition.y, {
          toValue: 0.45 * screenHeight,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(sharePosition.y, {
          toValue: 0.3 * screenHeight,
          useNativeDriver: false,
        }).start();
        Animated.spring(locationPosition.y, {
          toValue: 0.45 * screenHeight,
          useNativeDriver: false,
        }).start();
      }
      setIsShareOpen(true);
      setFullScreen(true);
    } else if (isShareOpen) {
      Animated.spring(sharePosition.y, {
        toValue: 0.8 * screenHeight,
        useNativeDriver: false,
      }).start();
      Animated.spring(locationPosition.y, {
        toValue: 0.7 * screenHeight,
        useNativeDriver: false,
      }).start();
      Animated.spring(locationPosition.x, {
        toValue: 30,
        useNativeDriver: false,
      }).start();
      setIsShareOpen(false);
    }
  };

  const openDrawer = () => {
    Animated.spring(drawerPosition.x, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
    Animated.spring(locationPosition.y, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
    Animated.spring(locationPosition.x, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
    Animated.spring(sharePosition.y, {
      toValue: 0.8 * screenHeight,
      useNativeDriver: false,
    }).start();
    setIsShareOpen(false);
    setIsDrawerOpen(true);
    setNewNotifications(false);
  };

  const closeDrawer = () => {
    Animated.spring(drawerPosition.x, {
      toValue: -300,
      useNativeDriver: false,
    }).start();
    Animated.spring(locationPosition.y, {
      toValue: 0.7 * screenHeight,
      useNativeDriver: false,
    }).start();
    Animated.spring(locationPosition.x, {
      toValue: 30,
      useNativeDriver: false,
    }).start();
    setIsDrawerOpen(false);
  };

  const fetchLivePath = async (sender_email, stop_time) => {
    try {
      const response = await fetch(`http://${ip_adress}/fetchLivePath`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender_email, stop_time }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Decrypted Data from Server:", data);
      setCoordinates(data);


      setLiveMap(true)
      setModalVisible(true)
      // Handle the decrypted data as needed
      // For example, update your UI with the decrypted latitude and longitude values
    } catch (error) {
      console.error("Error fetching data from the server:", error.message);
    }
  };

  const getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(currentLocation.coords);
      setLoading(false);
      const address2 = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setAddress(address2[0]);
    } catch (error) {
      setErrorMsg(`Error getting location: ${error}`);
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
      try {
        const email = data.user.email;
        const response = await fetch(
          `http://${ip_adress}/getNotificationsAndMarkAsRead`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );
        const result = await response.json();
        setNotifications(result.notifications);
        setLocationDetails(result.dectoken);
        setNotificationsAvailable(true);
        if (result.dectoken[0]) {
          setNewNotifications(true);
        }

        if (result.success) {
          console.log("notification gotten successfully");
        } else {
          // Handle unsuccessful login (show error message, etc.)
        }
      } catch (error) {
        console.log("notification error:", error);
      }
    } catch (error) {
      // console.error("Error fetching data:", error.message);

    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getLocationAsync();
  }, [5]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      return reverseGeocode[0] ? reverseGeocode[0].name : "Unknown";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unknown";
    }
  };

  return (
    <View
      style={{
        marginTop: "auto",
        backgroundColor: Colors.sky,
        flex: 1,
      }}
    >
      <Spinner visible={loading} textStyle={styles.spinnerText} />
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            width: isDrawerOpen ? "100%" : 300,
            height: "100%",
            backgroundColor: Colors.navbar,
            elevation: 5,
            zIndex: 1,
            justifyContent: "center",
          },
          { transform: [{ translateX: drawerPosition.x }] },
        ]}
      >
        <SafeAreaView
          style={{
            width: "100%",
            height: "100%",
            marginTop: "30%",
          }}
        >
          <ScrollView
            style={{
              width: "100%",
              height: !isShareOpen ? "100%" : "100%",
              marginTop: "30%",
              backgroundColor: Colors.sky,
              marginBottom: 80,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            {notificationsAvailable
              ? locationDetails.map((locate) => (
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      height: 300,
                      alignItems: "center",
                      borderRadius: 20,
                      overflow: "hidden",
                      marginVertical: 10,
                    }}
                    onPress={() => [
                      setModalLatitude(locate.decoded.latitude),
                      setModalLongitude(locate.decoded.longitude),
                      setModalsentDate(
                        new Date(locate.decoded.iat * 1000).toDateString()
                      ),
                      setModalsentTime(
                        new Date(locate.decoded.iat * 1000).toLocaleTimeString()
                      ),
                      setModalexpiryDate(
                        new Date(locate.decoded.exp * 1000).toDateString()
                      ),
                      setModalexpiryTime(
                        new Date(locate.decoded.exp * 1000).toLocaleTimeString()
                      ),
                      setModalmessage(locate.message),
                      setLiveMap(false),
                      setModalVisible(true),
                    ]}
                    onLongPress={() => [
                      setModalLatitude(locate.decoded.latitude),
                      setModalLongitude(locate.decoded.longitude),
                      setModalsentDate(
                        new Date(locate.decoded.iat * 1000).toDateString()
                      ),
                      setModalsentTime(
                        new Date(locate.decoded.iat * 1000).toLocaleTimeString()
                      ),
                      setModalexpiryDate(
                        new Date(locate.decoded.exp * 1000).toDateString()
                      ),
                      setModalexpiryTime(
                        new Date(locate.decoded.exp * 1000).toLocaleTimeString()
                      ),
                      setModalmessage(locate.message),
                      setSender_email(locate.sender_email),
                      fetchLivePath(locate.sender_email, locate.stop_time),
                    ]}
                  >
                    <MapModal
                      latitude={modalLatitude}
                      longitude={modalLongitude}
                      visible={modalVisible}
                      onClose={() => setModalVisible(false)}
                      message={modalmessage}
                      sentDate={modalsentDate}
                      expiryDate={modalexpiryDate}
                      sentTime={modalsentTime}
                      expiryTime={modalexpiryTime}
                      liveMap={liveMap}
                      coordinates={coordinates}
                    />
                    <MapView
                      style={{ width: "95%", height: "70%" }}
                      initialRegion={{
                        latitude: locate.decoded.latitude,
                        longitude: locate.decoded.longitude,
                        latitudeDelta: 0.8922,
                        longitudeDelta: 0.1921,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: locate.decoded.latitude,
                          longitude: locate.decoded.longitude,
                        }}
                        title="Marker Title"
                        description="Marker Description"
                      />
                    </MapView>
                    <View
                      style={{
                        width: "95%",
                        height: 50,
                        alignContent: "center",
                        justifyContent: "center",
                        backgroundColor: Colors.darkSubtle,
                      }}
                      key={locate.key}
                    >
                      <View
                        style={{
                          width: "100%",
                          justifyContent: "space-around",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            textTransform: "capitalize",
                            padding: 10,
                            marginHorizontal: 10,
                            color: Colors.white,
                          }}
                        >
                          {locate.message}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            textTransform: "capitalize",
                            padding: 10,
                            marginHorizontal: 10,
                            color: Colors.white,
                          }}
                        >
                          {}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "100%",
                          justifyContent: "space-around",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            textTransform: "capitalize",
                            padding: 10,
                            marginHorizontal: 10,
                            color: Colors.white,
                          }}
                        >
                          {new Date(locate.decoded.iat * 1000).toDateString()}{" "}
                          {new Date(
                            locate.decoded.iat * 1000
                          ).toLocaleTimeString()}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            textTransform: "capitalize",
                            padding: 10,
                            marginHorizontal: 10,
                            color: Colors.white,
                          }}
                        >
                          expires:{" "}
                          {new Date(locate.decoded.exp * 1000).toDateString()}{" "}
                          {new Date(
                            locate.decoded.exp * 1000
                          ).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              : ""}
          </ScrollView>
          <TouchableOpacity
            onPress={() => navigation.navigate("LocationHistory")}
            style={{
              backgroundColor: Colors.navbar,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 89,
              margin: 10,
              position: "absolute",
              bottom: "19%",
              right: "2%",
              zIndex: 1,
            }}
          >
            <Ionicons name="search" size={35} color={Colors.text} />
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "80%",
            backgroundColor: Colors.sky,
            elevation: 5,
            zIndex: 1,
            justifyContent: "center",
            borderRadius: 30,
          },
          { transform: [{ translateY: sharePosition.y }] },
        ]}
      >
        <TouchableOpacity
          onPress={increaseShare}
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
            top: "1%",
            right: "-3%",
          }}
        >
          <MaterialCommunityIcons
            name={fullScreen ? "arrow-up" : "arrow-down"}
            size={35}
            color={Colors.text}
          />
        </TouchableOpacity>
        <SafeAreaView>
          <View>
            <LiveLocation
              // latitude={location !== null ? location.latitude : ""}
              // longitude={location !== null ? location.longitude : ""}
              address={address !== null ? address : ""}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
      <TouchableOpacity
        onPress={toggleDrawer}
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
          top: "5%",
          right: "2%",
        }}
      >
        {newNotifications ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: 15,
              width: 15,
              backgroundColor: "yellow",
              zIndex: 1,
              borderRadius: 10,
            }}
          ></View>
        ) : (
          ""
        )}
        <MaterialCommunityIcons
          name="hamburger"
          size={35}
          color={Colors.text}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={toggleShare}
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
          top: "12%",
          right: "2%",
        }}
      >
        <MaterialCommunityIcons
          name="map-marker"
          size={35}
          color={Colors.text}
        />
      </TouchableOpacity>

      {location !== null ? (
        <View style={{ width: "100%", height: !isShareOpen ? "100%" : "70%" }}>
          <MapView
            style={{ width: "100%", height: "100%" }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.8922,
              longitudeDelta: 0.1921,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
              description="This is your current location"
            />
          </MapView>
        </View>
      ) : (
        ""
      )}
      <Animated.View
        style={[
          styles.locationHolder2,
          {
            transform: [
              { translateY: locationPosition.y },
              { translateX: locationPosition.x },
            ],
          },
        ]}
      >
        <View
          style={[
            {
              backgroundColor: Colors.navbar,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 89,
              margin: 10,
            },
          ]}
        >
          <Ionicons name="location" size={15} color={Colors.text} />
        </View>
        {location !== null ? (
          <Text style={styles.receptionText4}>{address.name}</Text>
        ) : (
          <Text
            style={{
              color: Colors.subtleHigh,
            }}
          >
            Loading...
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  receptionText4: {
    color: Colors.white,
    fontSize: 20,
    marginVertical: 6,
    textTransform: "uppercase",
  },
  locationHolder2: {
    width: "75%",
    backgroundColor: Colors.darkSubtle,
    height: "auto",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 10,
    flexDirection: "row",
    position: "absolute",
    zIndex: 1,
    top: "8%",
    left: "2%",
  },
  drawerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    elevation: 5,
    zIndex: 1,
  },
  drawerContent: {
    flex: 1,
    width: "100%",
    height: "50%",
  },
});

export default LocationPage;
