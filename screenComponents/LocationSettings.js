import React from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Colors from "./Colors";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function LocationSettings(props) {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{
        marginTop:  "auto",
        backgroundColor: Colors.primary,
        flex: 1,
      }}
    >
      <ScrollView>
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
            activities{" "}
            <MaterialCommunityIcons
              name="bell"
              size={25}
              color="rgba(255,255,255,0.6)"
            />
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  receptionText4: {
    color: Colors.subtleHigher,
    fontSize: 25,
    marginVertical: 6,
    textTransform: "uppercase",
    marginHorizontal: 40,
  },
});

export default LocationSettings;
