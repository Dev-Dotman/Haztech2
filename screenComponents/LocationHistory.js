import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  LogBox,
} from "react-native";
import IpAdress from "./IpAdress";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from "./Colors";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import MapModal from "./MapModal";

function LocationHistory(props) {
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [endTimestamp, setEndTimestamp] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const ip_address = IpAdress.ip;
  const [listdata, setListData] = useState([]);
  const navigation = useNavigation();
  const [isStartDateTimePickerVisible, setStartDateTimePickerVisible] =
    useState(false);
  const [isEndDateTimePickerVisible, setEndDateTimePickerVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [locationDetails, setLocationDetails] = useState([]);
  const [notificationsAvailable, setNotificationsAvailable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLatitude, setModalLatitude] = useState("");
  const [modalmessage, setModalmessage] = useState("");
  const [modalsentDate, setModalsentDate] = useState("");
  const [modalexpiryDate, setModalexpiryDate] = useState("");
  const [modalsentTime, setModalsentTime] = useState("");
  const [modalLongitude, setModalLongitude] = useState("");
  const [modalexpiryTime, setModalexpiryTime] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  LogBox.ignoreLogs([
    'Warning: Each child in a list should have a unique "key" prop.',
  ]);

  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generateRandomId = () => {
    return randomNumberInRange(1, 200);
  };

  const formatToMySQLTimestamp = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return ""; // return an empty string if the date is not a valid Date object
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const showStartDateTimePicker = () => setStartDateTimePickerVisible(true);
  const hideStartDateTimePicker = () => setStartDateTimePickerVisible(false);
  const handleStartDatePicked = (date) => {
    setStartTimestamp(date);
    hideStartDateTimePicker();
  };

  const showEndDateTimePicker = () => setEndDateTimePickerVisible(true);
  const hideEndDateTimePicker = () => setEndDateTimePickerVisible(false);
  const handleEndDatePicked = (date) => {
    setEndTimestamp(date);
    hideEndDateTimePicker();
  };

  useEffect(() => {
    fetchData();
    // Set initial values for start and end timestamps, e.g., 4 hours ago
    const endDate = new Date();
    const startDate = new Date(endDate - 4 * 60 * 60 * 1000);
    setEndTimestamp(endDate.toISOString());
    setStartTimestamp(startDate.toISOString());
  }, []);

  const [startdate, setStartdate] = useState(new Date());

  const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || startdate;
    setStartdate(currentDate);
  };

  const [enddate, setEnddate] = useState(new Date());

  const changeSelectedDate2 = (event, selectedDate) => {
    const currentDate = selectedDate || enddate;
    setEnddate(currentDate);
  };

  const [displaymode, setMode] = useState("datetime");

  const fetchData = async () => {
    try {
      const response = await fetch("http://" + ip_address + "/protected");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setListData(data.user);
    } catch (error) {
      // console.error("Error fetching data:", error.message);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const fetchNotifications = async () => {
    const email = listdata.email;
    try {
      const formattedStartDate = startTimestamp
        ? formatToMySQLTimestamp(new Date(startTimestamp))
        : "";
      const formattedEndDate = endTimestamp
        ? formatToMySQLTimestamp(new Date(endTimestamp))
        : "";

      const response = await fetch(`http://${ip_address}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, formattedStartDate, formattedEndDate }),
      });
      const data = await response.json();
      if (!data[0]) {
        alert("No Location Notifications");
        setNotificationsAvailable(false);
      } else {
        setNotifications(data);
        setNotificationsAvailable(true);
        setLocationDetails(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <SafeAreaView style={{ padding: 20, backgroundColor: Colors.sky, flex: 1 }}>
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
        <Text style={[styles.receptionText4, {fontSize: 20}]}>Location History </Text>
      </View>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            color: Colors.text,
            marginTop: 10,
            width: "95%",
            backgroundColor: Colors.subtle,
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          <Text
            style={{
              color: Colors.text,
              textAlign: "center",
              fontSize: 15,
            }}
          >
            {listdata.email}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={styles.dateTimePickerContainer}>
          <TouchableOpacity onPress={showStartDateTimePicker}>
            <Text style={styles.dateTimePickerLabel}>Select Start Date</Text>
          </TouchableOpacity>
          
            <DateTimePickerModal
              isVisible={isStartDateTimePickerVisible}
              mode="datetime"
              onConfirm={handleStartDatePicked}
              onCancel={hideStartDateTimePicker}
              isDarkModeEnabled={true}
            />
        </View>

        <View style={styles.dateTimePickerContainer}>
          <TouchableOpacity onPress={showEndDateTimePicker}>
            <Text style={styles.dateTimePickerLabel}>Select End Date</Text>
          </TouchableOpacity>
          
            <DateTimePickerModal
              isVisible={isEndDateTimePickerVisible}
              mode="datetime"
              onConfirm={handleEndDatePicked}
              onCancel={hideEndDateTimePicker}
              isDarkModeEnabled={true}
            />
        </View>
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            color: Colors.text,
            marginTop: 10,
            width: "95%",
            backgroundColor: Colors.subtle,
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text
              style={{
                color: Colors.text,
                textAlign: "center",
                fontSize: 15,
                textTransform: "capitalize",
              }}
            >
              start date :
            </Text>
            <Text style={styles.dateTimePickerLabel}>
              {" "}
              {startTimestamp && (
                <Text>{formatToMySQLTimestamp(startTimestamp)}</Text>
              )}
            </Text>
            {/* <DateTimePicker
              width={210}
              borderRadius={20}
              testID="dateTimePicker"
              value={startdate}
              mode={displaymode}
              is24Hour={true}
              display="default"
              onChange={changeSelectedDate}
              style={{
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
                color: "white",
              }}
            /> */}
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text
              style={{
                color: Colors.text,
                textAlign: "center",
                fontSize: 15,
                textTransform: "capitalize",
              }}
            >
              end date :
            </Text>
            <Text style={styles.dateTimePickerLabel}>
              {" "}
              {endTimestamp && (
                <Text>{formatToMySQLTimestamp(endTimestamp)}</Text>
              )}
            </Text>
            {/* <DateTimePicker
              width={210}
              borderRadius={20}
              testID="dateTimePicker"
              value={enddate}
              mode={displaymode}
              is24Hour={true}
              display="default"
              onChange={changeSelectedDate2}
              style={{
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
                color: "white",
              }}
            /> */}
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={fetchNotifications}
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            color: Colors.text,
            marginTop: 10,
            width: "95%",
            backgroundColor: Colors.subtle,
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          <Text
            style={{
              color: Colors.text,
              textAlign: "center",
            }}
          >
            {" "}
            show location notifications
          </Text>
        </View>
      </TouchableOpacity>

      <ScrollView
        style={{
          width: "100%",
          height: "10%",
          marginTop: "0%",
          backgroundColor: Colors.sky,
          marginBottom: 80,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {notificationsAvailable ? (
          locationDetails.map((locate) => (
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
                setModalLatitude(locate.latitude),
                setModalLongitude(locate.longitude),
                setModalsentDate(locate.time),
                setModalsentTime(""),
                setModalexpiryDate("not recorded"),
                setModalexpiryTime(""),
                setModalmessage(locate.message),
                setModalVisible(true),
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
              />
              <MapView
                style={{ width: "95%", height: "70%" }}
                initialRegion={{
                  latitude: locate.latitude,
                  longitude: locate.longitude,
                  latitudeDelta: 0.8922,
                  longitudeDelta: 0.1921,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: locate.latitude,
                    longitude: locate.longitude,
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
                  backgroundColor: Colors.navbar,
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
                    {locate.time}{" "}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              marginTop: "50%",
              backgroundColor: Colors.sky,
              marginBottom: 80,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: 25,
              }}
            >
              No Notifications Found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dateTimePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateTimePickerLabel: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 10,
    width: 150,
    backgroundColor: Colors.darkSubtle,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    textAlign: "center",
  },
  datePickerContainer: {
    backgroundColor: "black", // Customize background color
  },
  titleStyle: {
    color: "blue", // Customize title color
  },
  confirmTextStyle: {
    color: "green", // Customize confirm button text color
  },
  cancelTextStyle: {
    color: "red", // Customize cancel button text color
  },
  receptionText4: {
    color: Colors.text,
    fontSize: 25,
    textTransform: "uppercase",
    marginHorizontal: 40,
  },
});

export default LocationHistory;
