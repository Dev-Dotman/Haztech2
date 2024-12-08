import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  LogBox,
  Platform
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Spinner from "react-native-loading-spinner-overlay";
import PopupModal from "./PopupModal";
import Colors from "./Colors";
import IpAdress from "./IpAdress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as Network from "expo-network";
// import { WebView } from "react-native-webview";
import { LineChart } from "react-native-chart-kit";
import SensorModal from "./SensorModal";
import ScanModal from "./ScanModal";
import { ref, onValue } from "firebase/database";
import database from "../firebase";
import { LinearGradient } from "expo-linear-gradient";
import * as Device from "expo-device";

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function VpnPage(props) {
  const [receptionState, setReceptionState] = useState("reception off");
  var ip_adress = IpAdress.ip;
  const [listdata, setListData] = useState([]);
  const [sosEmail, setSosEmail] = useState("");
  const [sosMessage, setSosMessage] = useState("");
  const [loggedOut, setLoggedOut] = useState(false);
  const [errmessage, setErrmessage] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [confidant1, setConfidant1] = useState("");
  const [confidant2, setConfidant2] = useState("");
  const [email, setEmail] = useState("");
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const navigation = useNavigation();
  const [notificationContent, setNotificationContent] = useState(null);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [notifiy, setNotify] = useState("");
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [neon, setNeon] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModal2Visible, setModal2Visible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [quickSosEnabled, setQuickSosEnabled] = useState(false);
  const [newNotifications, setNewNotifications] = useState(false);
  const wavePosition = useRef(new Animated.Value(0)).current;
  const wavePosition2 = useRef(new Animated.Value(1)).current;
  const wavePosition3 = useRef(new Animated.Value(0)).current;
  const [publicIpAddress, setPublicIpAddress] = useState("");
  const chartRef = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const [sensor1Data, setSensor1Data] = useState(Array(6).fill(0));
  const [sensor2Data, setSensor2Data] = useState(Array(6).fill(0));
  const [continuousMode, setContinuousMode] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const animatedValue = new Animated.Value(0);
  const [scanModalOpen, SetScanModalOpen] = useState(false);
  const [scan, SetScan] = useState(false);
  const [sensordata, setSensordata] = useState([]);
  const [currentTemp, setCurrentTemp] = useState("");
  const [currentHumi, setCurrentHumi] = useState("");
  const [modalValue, setModalValue] = useState(null);
  const [isFlame, setIsFlame] = useState(false);
  const [isWater, setIsWater] = useState(false);
  const [isSmoke, setIsSmoke] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  LogBox.ignoreLogs([
    'Warning: Each child in a list should have a unique "key" prop.',
  ]); 
  LogBox.ignoreLogs(["Warning: Possible Unhandled Promise Rejection (id: 5)."]);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "your-project-id",
        })
      ).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Haztech Warning Mail!!! 📬",
        body: "Fire Detected!!! Fire Detected!!!",
      },
      trigger: null,
    });
  }

  async function schedulePushNotificationSmoke() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Haztech Warning Mail!!! 📬",
        body: "Smoke Detected!!! Smoke Detected!!!",
      },
      trigger: null,
    });
  }

  async function schedulePushNotificationWater() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Haztech Warning Mail!!! 📬",
        body: "Water Detected!!! Water Detected!!!",
      },
      trigger: null,
    });
  }

  const handleModalCallback = (valueFromModal) => {
    // Handle the value received from the modal
    setModalValue(valueFromModal);
    alert(` connected to ${valueFromModal}`);
    setContinuousMode(!continuousMode);
    setModalVisible(false); // Close the modal if needed
  };

  const usersRef = modalValue ? ref(database, modalValue) : "";

  // Attach an asynchronous callback to read the data at our users reference

  LogBox.ignoreLogs([
    "Sending `onAnimatedValueUpdate` with no listeners registered.",
  ]);

  // Adding a listener
  const listener = animatedValue.addListener(({ value }) => {
    console.log("Animated value:", value);
  });

  // ... do something with the animation

  // Removing the listener when no longer needed
  animatedValue.removeListener(listener);

  useEffect(() => {
    const startAnimation = () => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 2000, // Adjust the duration for the scale animation
        useNativeDriver: false,
      }).start(() => {
        // Reset the scale to 0 for the next animation
        scaleValue.setValue(0);
        startAnimation();
      });
    };

    startAnimation();
  }, [scaleValue]);

  // Adjust opacity based on the scale value
  const opacityValue = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  // Increase the duration of the fade-out animation
  const fadeOutDuration = 1000; // Set your desired fade-out duration in milliseconds

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
    opacity: Animated.timing(opacityValue, {
      toValue: 0,
      duration: 2500,
      useNativeDriver: false,
    }),
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModal2 = () => {
    setModal2Visible(!isModal2Visible);
  };

  const geofenceRegion = {
    identifier: "AdelekeUniversity",
    latitude: 7.6795, // Replace with the actual latitude of Adeleke University
    longitude: 4.4794, // Replace with the actual longitude of Adeleke University
    radius: 100, // Specify the radius of the geofence in meters
  };

  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generateRandomId = () => {
    return randomNumberInRange(1, 200);
  };

  /////////////////////////////////////// line chart
  const [fetchIt, setFetchIt] = useState(false);

  useEffect(() => {
    const updateChartData = () => {
      if (continuousMode) {
        if (!modalValue) {
          return;
        }

        setFetchIt(true);
        // // Simulated function to get new data from sensors
        // const newData1 = Math.floor(Math.random() * 100) + 1;
        // const newData2 = Math.floor(Math.random() * 100) + 1;

        // // Update data for sensor 1
        // setSensor1Data((prevData) => [...prevData.slice(1), newData1]);

        // // Update data for sensor 2
        // setSensor2Data((prevData) => [...prevData.slice(1), newData2]);
      } else {
        // Feed zeros into the chart
        setFetchIt(false);
        setSensor1Data((prevData) => [...prevData.slice(1), 0]);
        setSensor2Data((prevData) => [...prevData.slice(1), 0]);
        setCurrentTemp(0);
        setCurrentHumi(0);
      }
    };

    // Update data every 2 seconds
    const intervalId = setInterval(updateChartData, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [continuousMode]);

  useEffect(() => {
    const fetchDataFromDatabase = async () => {
      if (fetchIt && modalValue !== null && continuousMode) {
        onValue(
          usersRef,
          async (snapshot) => {
            const data = snapshot.val();
            setSensordata(data);
            if (modalValue !== null && continuousMode) {
              setSensor1Data((prevData) => [
                ...prevData.slice(1),
                fetchIt && modalValue !== null && continuousMode
                  ? data.humidity
                  : 0,
              ]);
              setSensor2Data((prevData) => [
                ...prevData.slice(1),
                fetchIt && modalValue !== null && continuousMode
                  ? data.temperature
                  : 0,
              ]);
              setCurrentTemp(
                fetchIt && modalValue !== null && continuousMode
                  ? data.temperature
                  : 0
              );
              setCurrentHumi(
                fetchIt && modalValue !== null && continuousMode
                  ? data.humidity
                  : 0
              );

              if (data.waterSensor === 1) {
                setIsWater(true);
                await schedulePushNotificationWater();
              } else {
                setIsWater(false);
              }

              if (data.mq2Sensor > 300) {
                setIsSmoke(true);
                await schedulePushNotificationSmoke();
              } else {
                setIsSmoke(false);
              }

              try {
                const response = await fetch(`http://${ip_adress}/prediction`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    humidity: data.humidity,
                    temperature: data.temperature,
                    flameSensor: data.flameSensor,
                    smoke: data.mq2Sensor,
                  }),
                });
                const result = await response.json();

                if (result.success) {
                  console.log("prediction", result.prediction);
                  console.log("fire detected", result.fire);
                  if (result.fire === true) {
                    setIsFlame(true);
                    await schedulePushNotification();
                  } else {
                    setIsFlame(false);
                  }
                } else {
                  // Handle unsuccessful login (show error message, etc.)
                  console.log("error");
                }
              } catch (error) {
                console.log("notification error:", error);
              }
            }
          },
          (error) => {
            console.error("Error fetching data: ", error);
          }
        );
      } else {
        // Conditions not met, set data to an array containing 6 zeros
        setSensor1Data([0, 0, 0, 0, 0, 0]);
        setSensor2Data([0, 0, 0, 0, 0, 0]);

        // Simulate normal conditions
      }
    };

    // Fetch data when fetchIt is true
    fetchDataFromDatabase();
  }, [fetchIt, modalValue, continuousMode]);
  const chartData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        data: sensor1Data,
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: sensor2Data,
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const customYLabels = ["20", "40", "60", "80", "100"];

  ////////////////////////////////////////

  useEffect(() => {
    const waveAnimation = Animated.sequence([
      Animated.timing(wavePosition, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(wavePosition, {
        toValue: 0,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]);

    Animated.loop(waveAnimation).start();

    return () => {
      waveAnimation.stop();
    };
  }, [wavePosition]);

  useEffect(() => {
    const waveAnimation2 = Animated.sequence([
      Animated.timing(wavePosition2, {
        toValue: 0,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(wavePosition2, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]);

    Animated.loop(waveAnimation2).start();

    return () => {
      waveAnimation2.stop();
    };
  }, [wavePosition2]);

  useEffect(() => {
    const waveAnimation2 = Animated.sequence([
      Animated.timing(wavePosition3, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(wavePosition3, {
        toValue: 0,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]);

    Animated.loop(waveAnimation2).start();

    return () => {
      waveAnimation2.stop();
    };
  }, [wavePosition3]);

  const getWaveStyle = () => {
    const inputRange = [0, 1];
    const outputRange = [0.8, 1.2]; // Adjust the scale values for the circular motion

    const scale = wavePosition.interpolate({
      inputRange,
      outputRange,
    });

    return {
      transform: [{ scale }],
    };
  };

  const getWaveStyle2 = () => {
    const inputRange = [0, 1];
    const outputRange = [0.8, 1.2]; // Adjust the scale values for the circular motion

    const scale = wavePosition2.interpolate({
      inputRange,
      outputRange,
    });

    return {
      transform: [{ scale }],
    };
  };

  const getWaveStyle3 = () => {
    const inputRange = [0, 1];
    const outputRange = [0.8, 1.2]; // Adjust the scale values for the circular motion

    const scale = wavePosition3.interpolate({
      inputRange,
      outputRange,
    });

    return {
      transform: [{ scale }],
    };
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://" + ip_adress + "/protected");

      const data = await response.json();
      setListData(data.user);
      const email2 = data.user.email;
      const email = data.user.email;
      try {
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

      try {
        const response = await fetch(
          `http://${ip_adress}/getNotifications/${email2}/0`
        );
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          return;
        }

        const data = await response.json();
        if (data.result[0]) {
          setNewNotifications(true);
        }

        // After 2 minutes, update the is_read column for fetched notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        setListData(data.user);
        setListData(data.user);
        setFname(listdata.firstName);
        setLname(listdata.lastName);
        setEmail(listdata.email);
        setConfidant1(listdata.confidant1);
        setConfidant2(listdata.confidant2);
      }
    } catch (error) {
      // console.error("Error fetching data:", error.message);
      navigation.navigate("Home");
      // alert("Couldn't log in\n Contact Customer Service")
    }

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  // useEffect(() => {
  //   // Fetch notifications when the component mounts
  //   fetchNotifications();

  //   // Set up a timer to refetch notifications every 2 minutes
  //   const intervalId = setInterval(() => {
  //     fetchNotifications();
  //   }, 120000);

  //   return () => {
  //     // Clear the interval when the component unmounts
  //     clearInterval(intervalId);
  //   };
  // }, []);

  const handleSendQuicksos = async () => {
    fetchData();
    await QuickSos();
    if (listdata.firstName !== "") {
    }
    if (listdata.lastName !== "") {
    }
    const fname = listdata.firstName;
    const lname = listdata.lastName;
    const Confidantmail = "olaiyadotun05@gmail.com";
    const confidant1 = listdata.confidant1;
    const confidant2 = listdata.confidant2;
    if (receptionState === "reception active") {
      if (quickSosEnabled === true) {
        setSosMessage(
          `Location: ${location.name}, Message: SOS!!!! SOS!!!! SOS!!!!`
        );
        console.log(Confidantmail);
        const response = await fetch(`http://${ip_adress}/quicksos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Confidantmail,
            sosMessage,
            fname,
            lname,
            confidant1,
            confidant2,
          }),
        });

        // Handle the response
        if (response.ok) {
          // Parse the response as JSON
          const data = await response.json();
          const loginerr = data.message;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Notifications.scheduleNotificationAsync({
            content: {
              title: "SOS MESSAGE",
              body: `you sent an sos to ${Confidantmail} `,
            },
            trigger: null,
          });
          const randomId = generateRandomId();
          recentNotifications.push({ notifiy, randomId });

          // Handle the success or failure based on the response
          if (data.message === "SOS sent successfully") {
            // Extr;
          } else {
            alert("SOS failed to send, check if your email address is valid");
            Notifications.scheduleNotificationAsync({
              content: {
                title: "SOS MESSAGE",
                body: `SOS failed to send `,
              },
              trigger: null,
            });

            const randomId = generateRandomId();
            recentNotifications.push({ notifiy, randomId });
          }
        } else {
          // console.error("HTTP error:", response.status);
        }
      } else {
        alert("To use this feature turn on quick sos in settings");
      }
    } else {
      alert("turn on reception first");
    }
  };

  useEffect(() => {
    const requestPermissionsAsync = async () => {
      const { granted } = await Notifications.requestPermissionsAsync();
      if (!granted) {
        console.log("Notifications permission not granted");
      }
    };
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);

        showCustomNotification(notification.request.content);
        setNotificationContent(notification.request.content);
        setNotify(notificationContent && notificationContent.body);
        console.log(notifiy);
      }
    );
    return () => {
      requestPermissionsAsync();
      Notifications.removeNotificationSubscription(notificationListener);
    };
  });

  const QuickSos = async () => {
    try {
      const auto = await AsyncStorage.getItem("QuickSos");
      if (auto) {
        setQuickSosEnabled(true);
        return auto;
      } else {
        console.log("No token found");
        setQuickSosEnabled(false);
        return null;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, [6]);

  useEffect(() => {
    const autoTurnOn = async () => {
      try {
        const auto = await AsyncStorage.getItem("autoTurnOnVpn");
        if (auto) {
          HandleActiveteReception();
          return auto;
        } else {
          console.log("No token found");
          return null;
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
      }
    };

    QuickSos();
    autoTurnOn();
    fetchData();
  }, [3]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  function changeLastTwoDigits(ipAddress) {
    const parts = ipAddress.split(".");

    // Ensure the IP address has at least three parts
    if (parts.length < 3) {
      return "Invalid IP address";
    }

    // Change the last two digits to "01"
    parts[3] = "163";

    // Join the parts back together
    const modifiedIPAddress = parts.join(".");

    return modifiedIPAddress;
  }

  const HandleActiveteReception = async () => {
    console.log(receptionState);
    setLoading(true);
    fetchData();
    if (receptionState === "reception off") {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setLocation(address[0]);
        setNeon(true);
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Haztech Notification",
            body: `Haztech Activated `,
          },
          trigger: null,
        });
        fetchData();
        fetch("https://api.ipify.org?format=json")
          .then((response) => response.json())
          .then((data) => console.log(data.ip))
          .catch((error) =>
            console.error("Error fetching public IP address:", error)
          );

        const ip = await Network.getIpAddressAsync();
        if (ip) {
          console.log(ip);
          const modifiedIP = changeLastTwoDigits(ip);
          console.log("Modified IP:", modifiedIP);
          setPublicIpAddress(modifiedIP);
        } else {
          console.log("no ip found");
        }
        const randomId = generateRandomId();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        recentNotifications.push({ notifiy, randomId });
        setReceptionState("reception active");
        setConnectionStatus("connected");
        if (modalValue) {
          setContinuousMode(true);
        } else {
        }
        setLoading(false);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        alert("enable permissions to use this feature");
        setLoading(false);
      }
    }
    if (receptionState === "reception active") {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Haztech Notification",
          body: `Haztech has been Deactivated `,
        },
        trigger: null,
      });
      const randomId = generateRandomId();
      recentNotifications.push({ notifiy, randomId });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setReceptionState("reception off");
      setConnectionStatus("disconnected");
      setContinuousMode(false);
      setLoading(false);
      setNeon(false);
    }
  };

  const showCustomNotification = (content) => {
    // You can use a custom library or component to display notifications
    // This is just a basic example
    alert(`${content.body}`);
  };

  const checkBluetoothEnabled = async () => {
    const isEnabled = await Bluetooth.getEnabledAsync();
    setIsBluetoothEnabled(isEnabled);
  };

  const toggleBluetooth = async () => {
    if (isBluetoothEnabled) {
      await Bluetooth.disableAsync();
    } else {
      await Bluetooth.enableAsync();
    }
    checkBluetoothEnabled();
  };

  if (loggedOut === false) {
    return (
      <SafeAreaView style={{ backgroundColor: Colors.sky }}>
        <View
          style={{
            marginTop: "auto",
            backgroundColor: Colors.primary,
            marginBottom: "-10%",
          }}
        >
          <ScrollView
            style={{ backgroundColor: Colors.sky, height: "100%" }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                style={{
                  backgroundColor: Colors.darkSubtle,
                  width: 50,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 89,
                  margin: 10,
                }}
              >
                <Ionicons
                  name="settings"
                  size={35}
                  color="rgba(255,255,255,0.3)"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => [
                  navigation.navigate("Notifications"),
                  setNewNotifications(false),
                ]}
                style={{
                  backgroundColor: Colors.darkSubtle,
                  width: 50,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 89,
                  margin: 10,
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
                  name="bell"
                  size={35}
                  color="rgba(255,255,255,0.3)"
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.vpnButtonHolder, { marginVertical: 30 }]}>
              <View style={styles.locationHolder2}>
                <View
                  style={{
                    backgroundColor: Colors.darkSubtle,
                    width: 50,
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 89,
                    margin: 10,
                  }}
                >
                  <Ionicons name="location" size={15} color={Colors.text} />
                </View>
                {receptionState === "reception active" ? (
                  <Text style={styles.receptionText2}>{location.name}</Text>
                ) : (
                  <Text
                    style={{
                      color: Colors.subtleHigh,
                    }}
                  >
                    Loading...
                  </Text>
                )}
              </View>
            </View>
            <Spinner visible={loading} textStyle={styles.spinnerText} />
            <View style={styles.vpnButtonHolder}>
              <TouchableOpacity
                onPress={HandleActiveteReception}
                onLongPress={handleSendQuicksos}
              >
                <View
                  style={[
                    neon === false ? styles.vpnButton : styles.vpnButton2,
                  ]}
                >
                  {!neon === false
                    ? [0, 1, 2].map((index) => (
                        <Animated.View
                          key={index}
                          style={[styles.wave3, getWaveStyle(index)]}
                        ></Animated.View>
                      ))
                    : ""}
                  {!neon === false
                    ? [0, 1, 2].map((index) => (
                        <Animated.View
                          key={index}
                          style={[styles.wave2, getWaveStyle2(index)]}
                        ></Animated.View>
                      ))
                    : ""}
                  {!neon === false
                    ? [0, 1, 2].map((index) => (
                        <Animated.View
                          key={index}
                          style={[styles.wave, getWaveStyle3(index)]}
                        ></Animated.View>
                      ))
                    : ""}
                  {receptionState === "reception off" ? (
                    <MaterialCommunityIcons
                      name="power"
                      size={55}
                      color={Colors.subtleHigher}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="power"
                      size={95}
                      color={Colors.text}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.vpnButtonHolder, { marginVertical: 0 }]}>
              <View style={styles.locationHolder3}>
                <View
                  style={{
                    backgroundColor: Colors.subtleHigh,
                    width: 35,
                    height: 35,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 89,
                    margin: 10,
                  }}
                >
                  <Ionicons
                    name={
                      connectionStatus === "disconnected"
                        ? "warning-outline"
                        : "wifi-outline"
                    }
                    size={15}
                    color={Colors.text}
                  />
                </View>
                {<Text style={styles.statusText}>{connectionStatus}</Text>}
              </View>
            </View>

            <View style={styles.vpnButtonHolder}>
              <View
                style={{
                  marginVertical: 20,
                }}
              ></View>
              <ScrollView style={styles.notificationHolder}>
                <View style={styles.notCaption}>
                  <Text style={styles.receptionText2}>
                    Hello {listdata ? listdata.firstName : ""}!
                  </Text>
                  <Text style={styles.receptionText3}>
                    haztech sensor readings
                  </Text>
                </View>
                <View
                  style={{
                    position: "absolute",
                    right: 0,
                    width: "50%",
                  }}
                >
                  <TouchableOpacity
                    style={styles.locationHolder5}
                    onPress={() => {
                      receptionState === "reception off"
                        ? alert("turn on haztech")
                        : SetScanModalOpen(true);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Colors.subtleHigh,
                        width: 25,
                        height: 25,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 89,
                        margin: 10,
                      }}
                    >
                      <Ionicons name={"add"} size={15} color={Colors.text} />
                    </View>
                    {
                      <Text style={styles.receptionText3}>
                        connect a device
                      </Text>
                    }
                  </TouchableOpacity>
                  <Modal
                    visible={scanModalOpen}
                    onRequestClose={() => SetScanModalOpen(false)}
                  >
                    <ScanModal
                      onClose={() => SetScanModalOpen(false)}
                      scann={scan}
                      onModalClose={handleModalCallback}
                    />
                  </Modal>
                </View>
                <TouchableOpacity
                  style={[styles.locationHolder5, { width: "100%" }]}
                  onPress={() => {
                    receptionState === "reception off"
                      ? alert("turn on haztech")
                      : SetScanModalOpen(true);
                  }}
                >
                  <View
                    style={{
                      backgroundColor: Colors.subtleHigh,
                      width: 25,
                      height: 25,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 89,
                      margin: 10,
                    }}
                  >
                    <Ionicons name={"cog"} size={15} color={Colors.text} />
                  </View>
                  {
                    <Text style={styles.receptionText3}>
                      device connected:{" "}
                      {receptionState === "reception off" ? (
                        <Text>none</Text>
                      ) : modalValue ? (
                        modalValue
                      ) : (
                        <Text>none</Text>
                      )}
                    </Text>
                  }
                </TouchableOpacity>
                <LineChart
                  data={chartData}
                  width={0.88 * screenWidth}
                  height={0.5 * screenWidth}
                  withDots={true}
                  withInnerLines={true}
                  withOuterLines={true}
                  withVerticalLabels={false}
                  fromZero={true} // Start Y-axis from zero
                  chartConfig={{
                    backgroundGradientFrom: Colors.navbar,
                    backgroundGradientTo: Colors.navbar,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  bezier
                  style={{ marginVertical: 8 }}
                  updateData={true} // Enable efficient data updates
                  yLabelsOffset={15} // Adjust this value as needed
                  formatYLabel={(value) => `${value}`}
                />
                <SensorModal
                  visible={isModal2Visible}
                  continuousMode={continuousMode}
                  onClose={toggleModal2}
                  ipAddress={publicIpAddress}
                  humidity={currentHumi}
                  temperature={currentTemp}
                  waterDetected={isWater}
                  flameDetected={isFlame}
                  smokeDetected={isSmoke}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 20,
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: "rgba(75, 192, 192, 1)",
                        marginRight: 5,
                      }}
                    />
                    <Text style={styles.receptionText3}>
                      humidity: {currentHumi}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: "rgba(255, 99, 132, 1)",
                        marginRight: 5,
                      }}
                    />
                    <Text style={styles.receptionText3}>
                      temperature: {currentTemp}
                    </Text>
                  </View>
                </View>

                {receptionState === "reception off" ? (
                  ""
                ) : modalValue ? (
                  <TouchableOpacity
                    style={[
                      styles.locationHolder5,
                      {
                        width: "40%",
                        position: "absolute",
                        bottom: -60,
                        right: "30%",
                      },
                    ]}
                    onPress={() => {
                      receptionState === "reception off"
                        ? alert("turn on haztech")
                        : setModalValue(null);
                      setContinuousMode(false);
                      alert(`${modalValue} disconnected`);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Colors.subtleHigh,
                        width: 25,
                        height: 25,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 89,
                        margin: 10,
                      }}
                    >
                      <Ionicons name={"remove"} size={15} color={Colors.text} />
                    </View>
                    {<Text style={styles.receptionText3}>disconnect</Text>}
                  </TouchableOpacity>
                ) : (
                  ""
                )}

                {/* {recentNotifications.map((myNot) => {
                  return (
                    <Text style={styles.receptionText5} key={myNot.randomId}>
                      {myNot.notifiy}
                    </Text>
                  );
                })} */}
              </ScrollView>
            </View>

            <PopupModal
              visible={isModalVisible}
              onClose={toggleModal}
              message={modalMessage}
            />
          </ScrollView>
          <TouchableOpacity
            onPress={toggleModal}
            style={{
              backgroundColor: Colors.navbar,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 89,
              margin: 10,
              position: "absolute",
              bottom: 90,
              right: 10,
              zIndex: 1,
            }}
          >
            <Ionicons name="warning" size={25} color={Colors.subtleHigh} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleModal2}
            style={{
              backgroundColor: Colors.darkSubtle,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 89,
              margin: 10,
              position: "absolute",
              bottom: 150,
              right: 10,
              zIndex: 1,
            }}
          >
            {receptionState === "reception off" ? (
              ""
            ) : modalValue ? (
              <LinearGradient
                colors={["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"]}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  height: 15,
                  width: 15,
                  zIndex: 1,
                  borderRadius: 10,
                }}
              />
            ) : (
              ""
            )}
            <Ionicons name="trending-up" size={25} color={Colors.subtleHigh} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  headerText: {
    color: "black",
    fontSize: 30,
    marginVertical: 20,
  },
  vpnButtonHolder: {
    width: "100%",
    height: "auto",
    marginVertical: 10,
    alignItems: "center",
  },
  vpnButton: {
    backgroundColor: Colors.brown,
    width: 160,
    height: 160,
    marginVertical: 50,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.subtle,
  },
  vpnButton2: {
    backgroundColor: Colors.highlight,
    width: 160,
    height: 160,
    marginVertical: 50,
    borderRadius: 100,
    borderColor: Colors.highlight, // Neon color
    shadowColor: Colors.highlight, // Neon color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 70,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.3,
  },
  receptionText: {
    color: Colors.black,
    fontSize: 15,
    marginVertical: 10,
    textTransform: "uppercase",
  },
  receptionText1: {
    color: Colors.black,
    fontSize: 15,
    marginVertical: 10,
    marginTop: 80,
    textTransform: "uppercase",
  },
  receptionText2: {
    color: Colors.white,
    fontSize: 15,
    marginVertical: 10,
    textTransform: "uppercase",
  },
  statusText: {
    color: Colors.white,
    fontSize: 15,
    marginVertical: 10,
    textTransform: "uppercase",
  },
  receptionText3: {
    color: Colors.subtleHigher,
    fontSize: 10,
    marginVertical: 10,
    textTransform: "uppercase",
  },
  notificationHolder: {
    width: "95%",
    backgroundColor: Colors.darkSubtle,
    height: 500,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: Colors.brown,
    padding: 10,
    marginBottom: 15,
  },
  WebView: {
    width: "100%",
    backgroundColor: Colors.darkSubtle,
    height: 400,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: Colors.brown,
    padding: 10,
    marginBottom: 15,
    marginVertical: 50,
  },
  map: {
    height: 200,
    width: "100%",
  },
  notCaption: {
    justifyContent: "space-around",
    width: "100%",
  },
  notificationHolder2: {
    width: "95%",
    backgroundColor: Colors.darkSubtlesubtle,
    height: "auto",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#14452d",
    padding: 10,
    marginBottom: 10,
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
  },
  locationHolder3: {
    width: "55%",
    backgroundColor: Colors.subtle,
    height: "auto",
    alignItems: "center",
    borderRadius: 80,
    flexDirection: "row",
  },
  locationHolder5: {
    width: "95%",
    backgroundColor: Colors.subtle,
    height: "auto",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  locationHolder4: {
    width: "55%",
    backgroundColor: Colors.subtle,
    height: "auto",
    alignItems: "center",
    borderRadius: 80,
    flexDirection: "row",
    borderWidth: 4,
    borderColor: Colors.highlight,
  },
  inputView: {
    backgroundColor: Colors.darkSubtle,
    borderRadius: 10,
    width: "100%",
    height: 55,
    marginBottom: 20,
  },
  spinnerText: {
    color: "black",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: Colors.white,
  },
  inputView2: {
    backgroundColor: Colors.darkSubtle,
    borderRadius: 10,
    width: "100%",
    height: 100,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.darkSubtle,
    color: Colors.white,
    padding: 10,
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 4,
    borderColor: Colors.text,
  },
  receptionText4: {
    color: Colors.subtleHigher,
    fontSize: 15,
    marginVertical: 6,
    textTransform: "uppercase",
  },
  receptionText5: {
    color: Colors.subtleHigher,
    fontSize: 13,
    marginVertical: 6,
    textTransform: "uppercase",
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
  sosButtonHolder: {
    width: "100%",
    height: "auto",
    marginVertical: 10,
    alignItems: "flex-end",
  },
  waveContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  wave: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.subtle, // Turquoise wave color
    position: "absolute",
    borderColor: Colors.subtle, // Neon color
    shadowColor: Colors.subtleHigh, // Neon color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 5,
  },
  wave2: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.highlight, // Turquoise wave color
    position: "absolute",
    borderColor: Colors.highlight, // Neon color
    shadowColor: Colors.highlight, // Neon color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 5,
  },
  wave3: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.darkSubtle, // Turquoise wave color
    position: "absolute",
    borderColor: Colors.darkSubtle, // Neon color
    shadowColor: Colors.darkSubtle, // Neon color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 5,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 150,
    borderWidth: 5,
    borderColor: "rgba(255, 99, 132, 1)", // Turquoise wave color
    position: "absolute",
  },
});

export default VpnPage;
