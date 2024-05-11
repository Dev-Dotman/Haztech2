import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  LogBox,
  FlatList,
  Animated,
  TouchableHighlight,
  Clipboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import Colors from "./Colors";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import IpAdress from "./IpAdress";
import Toast from "react-native-toast-message";

function Notificationscreen(props) {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [listdata, setListData] = useState([]);
  const [email, setEmail] = useState("");
  const ip_adress = IpAdress.ip;
  const [notificationsAvailable, setNotificationsAvailable] = useState(false);
  const [notifications2, setNotifications2] = useState([]);
  LogBox.ignoreLogs([
    'Warning: Each child in a list should have a unique "key" prop.',
  ]); // Replace '...' with the specific warning message
  LogBox.ignoreLogs([
    "Sending `onAnimatedValueUpdate` with no listeners registered.",
  ]);
  const animatedValue = new Animated.Value(0);

  // Adding a listener
  const listener = animatedValue.addListener(({ value }) => {
    console.log("Animated value:", value);
  });

  // ... do something with the animation

  // Removing the listener when no longer needed
  animatedValue.removeListener(listener);

  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generateRandomId = () => {
    return randomNumberInRange(1, 200);
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
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://" + ip_adress + "/protected");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setListData(data.user);
      console.log(data.user);
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
        setNotifications(result.dectoken);
        setNotificationsAvailable(true);

        if (result.success) {
          console.log("notification gotten successfully");
        } else {
          // Handle unsuccessful login (show error message, etc.)
        }
      } catch (error) {}
      try {
        const response = await fetch(
          `http://${ip_adress}/getNotifications/${email}/0`
        );
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          return;
        }

        const data = await response.json();
        setNotifications2(data.result);

        // After 2 minutes, update the is_read column for fetched notifications
        setTimeout(() => {
          updateIsReadStatus(data.result);
        }, 120000);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    } catch (error) {
      // console.error("Error fetching data:", error.message);
    }
  };

  // Replace 'your-server-url' with the actual URL of your server

  // Fetch notifications and mark them as read
  // Empty dependency array ensures this effect runs once when the component mounts

  const updateIsReadStatus = async (notificationsToUpdate) => {
    // Implement logic to update is_read column to 1 in the backend
    // You would make another API call to update the status in the database
    try {
      const updateResponse = await fetch(
        `http://${ip_adress}/updateIsReadStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notifications: notificationsToUpdate,
          }),
        }
      );

      if (!updateResponse.ok) {
        console.error(`HTTP error! Status: ${updateResponse.status}`);
      }
    } catch (error) {
      // console.error("Error updating is_read status:", error);
    }
  };

  const handleTextPress = (text) => {
    const lastTenSubstring = text.substring(Math.max(0, text.length - 10));

    Clipboard.setString(lastTenSubstring);
    Toast.show({
      type: "success",
      position: "bottom",
      text1: "Text copied to clipboard",
    });
  };

  const processSentence = (text) => {
    // Using substring method
    const withoutLastTenSubstring = text.substring(
      0,
      Math.max(0, text.length - 10)
    );

    // Using slice notation
    const withoutLastTenSlice = text.slice(0, Math.max(0, text.length - 10));

    const hasSpace = withoutLastTenSubstring.includes(" ");
    // Set the result to state

    return withoutLastTenSubstring;
    // Or use withoutLastTenSlice depending on your preference
  };

  const displayLastTenLetters = (text) => {
    // Using substring method
    const lastTenSubstring = text.substring(Math.max(0, text.length - 10));

    // Using slice notation
    const lastTenSlice = text.slice(Math.max(0, text.length - 10));

    const hasSpace = lastTenSubstring.includes(" ");
    // Set the result to state
    return lastTenSubstring;
    // Or use lastTenSlice depending on your preference
  };

  // const lastTenSubstring = sentence.substring(Math.max(0, sentence.length - 10));

  return (
    <SafeAreaView
      style={{
        marginTop: "auto",
        backgroundColor: Colors.text,
        flex: 1,
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
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
        <Text style={styles.receptionText4}>
          notifications{" "}
          <MaterialCommunityIcons name="bell" size={25} color={Colors.navbar} />
        </Text>
      </View>
      <View>
        {/* Display notification content here */}

        {notificationsAvailable
          ? notifications.map((notification) => (
              <TouchableOpacity
                onPress={() => {
                  notification.type === 1
                    ? navigation.navigate("Location")
                    : "";
                }}
              >
                <View
                  style={{
                    width: "95%",
                    height: 100,
                    alignContent: "center",
                    justifyContent: "center",
                    backgroundColor: Colors.navbar,
                    marginVertical: 10,
                    marginHorizontal: "2.5%",
                    borderRadius: 30,
                  }}
                  key={notification.key}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      textTransform: "capitalize",
                      padding: 10,
                      marginHorizontal: 10,
                      color: Colors.white,
                    }}
                  >
                    {notification.message} . click to view
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          : ""}
        <FlatList
          data={notifications2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                width: "90%",
                height: 100,
                alignContent: "center",
                justifyContent: "center",
                backgroundColor: Colors.darkSubtle,
                marginVertical: 10,
                marginHorizontal: "5%",
                borderRadius: 30,
                borderColor: Colors.navbar,
                borderWidth: 3,
              }}
            >
              <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={handleTextPress(item.message)}>
              <Text
                style={{
                  fontSize: 15,
                  padding: 10,
                  marginHorizontal: 10,
                  color: Colors.white,
                }}
              >{processSentence(item.message)}{displayLastTenLetters(item.message)}

              </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={handleTextPress}>
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      padding: 10,
                      marginVertical: 0,
                      color: Colors.white,
                    }}
                  >
                    {displayLastTenLetters(item.message)}
                  </Text>
                </View>
              </TouchableOpacity> */}
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  receptionText4: {
    color: Colors.primary,
    fontSize: 25,
    marginVertical: 6,
    textTransform: "uppercase",
    marginHorizontal: 40,
  },
});

export default Notificationscreen;
