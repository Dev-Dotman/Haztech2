import React from "react";
import Colors from "./Colors";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";

function SensorModal({
  visible,
  onClose,
  continuousMode,
  ipAddress,
  humidity,
  temperature,
  flameDetected,
  waterDetected,
  smokeDetected,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            width: "90%",
            height: "70%",
            backgroundColor: Colors.navbar,
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {!continuousMode === false ? (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: Colors.navbar,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "90%",
                  backgroundColor: Colors.darkSubtle,
                  borderRadius: 20,
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  borderWidth: 3,
                  borderColor: Colors.navbar,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    marginVertical: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      color: Colors.white,
                    }}
                  >
                    Temperature:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 25,
                      color: "rgba(255, 99, 132, 1)",
                    }}
                  >
                    {" "}
                    {temperature}{" "}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    marginVertical: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      color: Colors.white,
                    }}
                  >
                    Humidity:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 25,
                      color: "rgba(75, 192, 192, 1)",
                    }}
                  >
                    {" "}
                    {humidity}{" "}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    marginVertical: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      color: Colors.white,
                    }}
                  >
                    Smoke Detected:{" "}
                  </Text>
                  {!smokeDetected ? (
                    <Text
                      style={{
                        fontSize: 25,
                        color: "green",
                      }}
                    >
                      {" "}
                      No{" "}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 25,
                        color: "red",
                      }}
                    >
                      {" "}
                      yes{" "}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    marginVertical: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      color: Colors.white,
                    }}
                  >
                    Flame Detected:{" "}
                  </Text>
                  {!flameDetected ? (
                    <Text
                      style={{
                        fontSize: 25,
                        color: "green",
                      }}
                    >
                      {" "}
                      No{" "}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 25,
                        color: "red",
                      }}
                    >
                      {" "}
                      yes{" "}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    marginVertical: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      color: Colors.white,
                    }}
                  >
                    Water Detected:{" "}
                  </Text>
                  {!waterDetected ? (
                    <Text
                      style={{
                        fontSize: 25,
                        color: "green",
                      }}
                    >
                      {" "}
                      No{" "}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 25,
                        color: "red",
                      }}
                    >
                      {" "}
                      yes{" "}
                    </Text>
                  )}
                </View>
              </View>
              <Text
                style={{
                  color: Colors.text,
                  marginTop: 10,
                  width: "100%",
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Haztech sensor Readings
              </Text>
            </View>
          ) : (
            <View>
              <Text
                style={{
                  color: Colors.text,
                  marginTop: 10,
                  width: "100%",
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                No Haztech Device connected....
              </Text>
            </View>
          )}
        </View>
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
const styles = StyleSheet.create({
  WebView: {
    width: "100%",
    backgroundColor: Colors.primary,
    height: "80%",
    borderRadius: 10,
    borderWidth: 4,
    borderColor: Colors.brown,
    padding: 10,
    marginBottom: 15,
  },
});

export default SensorModal;
