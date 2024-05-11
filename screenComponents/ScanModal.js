import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import Colors from "./Colors";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Line } from "react-native-svg";
import { ref, onValue } from "firebase/database";
import database from "../firebase";

function ScanModal({ visible, onClose, scann, onModalClose }) {
  const rotation = useRef(new Animated.Value(0)).current;
  const trailOpacity1 = useRef(new Animated.Value(1)).current;
  const trailOpacity2 = useRef(new Animated.Value(1)).current;
  const trailOpacity3 = useRef(new Animated.Value(1)).current;
  const trailOpacity4 = useRef(new Animated.Value(1)).current;
  const [scanning, setScanning] = useState(scann);
  const [tableNames, setTableNames] = useState([]);
  const [modalValue, setModalValue] = useState("Value from modal");

  const startAnimation = () => {
    setScanning(true);
    Animated.loop(
      Animated.parallel([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // Light trail effects
        createTrailAnimation(trailOpacity1, 3000),
        createTrailAnimation(trailOpacity2, 3500),
        createTrailAnimation(trailOpacity3, 4000),
        createTrailAnimation(trailOpacity4, 4500),
      ])
    ).start();
    const fetchTableNames = async () => {
      const db = database;
      const rootRef = ref(db);

      // Attach an asynchronous callback to read the data at our root reference
      onValue(rootRef, (snapshot) => {
        const data = snapshot.val();

        // Extract table names
        const names = data ? Object.keys(data) : [];

        // Update state with table names
        setTableNames(names);
        setTimeout(() => {
          setScanning(false);
          stopAnimation();
        }, 1000);
      });
    };

    fetchTableNames();
  };

  const handleCloseModal = (text) => {
    // Call the callback function and pass the value
    onModalClose(text);
  };

  const createTrailAnimation = (trailOpacity, duration) => {
    return Animated.sequence([
      Animated.timing(trailOpacity, {
        toValue: 0,
        duration: duration, // Adjust the duration as needed for a slower trail effect
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(trailOpacity, {
        toValue: 1,
        duration: 0, // Instantly reset the opacity
        useNativeDriver: true,
      }),
    ]);
  };

  const getTrailOpacity = (trailOpacity) => {
    return {
      opacity: trailOpacity,
    };
  };

  const stopAnimation = () => {
    setScanning(false);
    rotation.stopAnimation();
    trailOpacity1.stopAnimation();
    trailOpacity2.stopAnimation();
    trailOpacity3.stopAnimation();
    trailOpacity4.stopAnimation();
  };

  const scan = () => {
    if (!scanning) {
      startAnimation();
    } else {
      stopAnimation();
    }
  };
  const [closed, SetClosed] = useState(false);

  const closeSet = () => {
    onClose;
    setScanning(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: !scanning ? Colors.navbar : Colors.highlight,
      }}
    >
      <View
        style={{
          height: "90%",
          position: "absolute",
          width: "100%",
          backgroundColor: Colors.primary,
          bottom: "30%",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "50%",
            width: "90%",
            backgroundColor: Colors.darkSubtle,
            position: "absolute",
            bottom: "28%",
            borderRadius: 20,
            borderWidth: 3,
            borderColor: Colors.navbar,
            padding: 10,
          }}
        >
          <Text style={styles.receptionText2}>Devices</Text>
          {tableNames.map((tableName, index) => (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
              <Text key={index} style={styles.receptionText2}>
                {tableName}
              </Text>
              <View style={{
                flexDirection: 'row-reverse',
                width: '30%',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    stopAnimation();
                    handleCloseModal(tableName); // Assuming stopAnimation sets scanning to false
                    setModalValue(tableName);
                  }}
                  style={{
                    backgroundColor: Colors.subtleHigh,
                    width: 30,
                    height: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 89,
                    margin: 10,
                  }}
                >
                  <Ionicons name={"add"} size={15} color={Colors.text} />
                </TouchableOpacity>
                <Text key={index} style={styles.receptionText2}>
                  connect
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          height: "40%",
          width: "80%",
          backgroundColor: Colors.primary,
          position: "absolute",
          bottom: "13%",
          borderRadius: 500,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <View
          style={{
            height: 25,
            width: 50,
            backgroundColor: "black",
            margin: 15,
            position: "absolute",
            zIndex: 1,
            bottom: "-3%",
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: !scanning ? Colors.subtleHigh : Colors.highlight,
          }}
        >
          <Text
            style={{
              color: Colors.white,
            }}
          >
            100m
          </Text>
        </View> */}
        <View
          style={{
            height: "90%",
            width: "90%",
            backgroundColor: Colors.subtle,
            borderRadius: 800,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            borderWidth: !scanning ? 0 : 0,
            borderColor: !scanning ? Colors.subtleHigh : Colors.highlight,
          }}
        >
          {/* <View
            style={{
              height: 30,
              width: 50,
              backgroundColor: "black",
              margin: 15,
              position: "absolute",
              zIndex: 1,
              bottom: "4%",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: !scanning ? Colors.subtleHigh : Colors.highlight,
            }}
          >
            <Text
              style={{
                color: Colors.white,
              }}
            >
              50m
            </Text>
          </View> */}
          <View
            style={{
              height: "70%",
              width: "70%",
              backgroundColor: "transparent",
              borderRadius: 800,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: !scanning ? Colors.subtleHigh : Colors.highlight,
            }}
          >
            <View
              style={{
                height: "60%",
                width: "60%",
                backgroundColor: Colors.subtle,
                borderRadius: 800,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: !scanning ? Colors.subtleHigh : Colors.highlight,
              }}
            >
              <View
                style={{
                  height: "60%",
                  width: "60%",
                  backgroundColor: Colors.subtle,
                  borderRadius: 800,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 5,
                  borderColor: !scanning ? Colors.subtleHigh : Colors.highlight,
                }}
              ></View>
            </View>
          </View>
        </View>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
            position: "absolute",
          }}
        >
          <Svg height="260" width="200">
            {/* <Circle
                cx="100"
                cy="50"
                r="50"
                stroke={!scanning? 'transparent': Colors.highlight}
                strokeWidth="5"
                fill="transparent"
                style={styles.vpnButton2}
              /> */}
            <Line
              x1="100"
              y1="100"
              x2="100"
              y2="-40"
              stroke={Colors.subtleHigh}
              strokeWidth="2"
              style={[getTrailOpacity(trailOpacity1), styles.shadowLine]}
            />
            <Line
              x1="100"
              y1="100"
              x2="100"
              y2="-40"
              stroke={!scanning ? "transparent" : Colors.highlight}
              strokeWidth="3"
              style={[getTrailOpacity(trailOpacity2), styles.shadowLine]}
            />
            <Line
              x1="100"
              y1="100"
              x2="100"
              y2="-40"
              stroke={!scanning ? "transparent" : Colors.highlight}
              strokeWidth="4"
              style={[getTrailOpacity(trailOpacity3), styles.shadowLine]}
            />
            <Line
              x1="100"
              y1="100"
              x2="100"
              y2="-40"
              stroke={Colors.subtleHigh}
              strokeWidth="5"
              style={[getTrailOpacity(trailOpacity4), styles.vpnButton2]}
            />
          </Svg>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[
          styles.locationHolder5,
          {
            backgroundColor: !scanning ? Colors.subtleHigh : Colors.darkSubtle,
          },
        ]}
        onPress={scan}
      >
        <View
          style={{
            backgroundColor: scanning ? Colors.subtleHigh : Colors.darkSubtle,
            width: 25,
            height: 25,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 89,
            margin: 10,
          }}
        >
          <Ionicons name={"navigate-outline"} size={15} color={Colors.text} />
        </View>
        {
          <Text style={styles.receptionText3}>
            {!scanning ? (
              <Text>start scanning</Text>
            ) : (
              <Text>stop scanning</Text>
            )}
          </Text>
        }
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          onClose();
          stopAnimation(); // Assuming stopAnimation sets scanning to false
        }}
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
        <MaterialCommunityIcons name={"close"} size={35} color={Colors.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "blue",
    position: "absolute",
  },
  fixedPoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    position: "absolute",
    top: 150,
    left: 150,
  },
  locationHolder5: {
    width: "45%",
    backgroundColor: Colors.subtle,
    height: "auto",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    position: "absolute",
    bottom: "5%",
  },
  receptionText3: {
    color: Colors.subtleHigher,
    fontSize: 10,
    marginVertical: 10,
    textTransform: "uppercase",
  },
  receptionText2: {
    color: Colors.white,
    fontSize: 15,
    marginVertical: 10,
    textTransform: "capitalize",
  },
  shadowLine: {
    shadowColor: "white",
    shadowOffset: { width: 60, height: 80 },
    shadowOpacity: 1,
    shadowRadius: 65,
    elevation: 95,
  },
  vpnButton2: {
    backgroundColor: Colors.highlight,
    width: 5,
    height: "50%",
    borderRadius: 100,
    borderColor: Colors.highlight, // Neon color
    shadowColor: Colors.highlight, // Neon color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 70,
    elevation: 95,
    borderWidth: 0.3,
    position: "absolute",
  },
});

export default ScanModal;
