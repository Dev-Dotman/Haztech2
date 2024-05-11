import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { StatusBar } from "react-native";
import Colors from "./Colors";
import IpAdress from "./IpAdress";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

function Documentation(props) {
  const [listdata, setListData] = useState([]);
  var ip_adress = IpAdress.ip;
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [assetId, setAssetId] = useState(""); // You need to set the actual assetId
  const [fileSize, setFileSize] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  // const [username, setUsername] = useState('john_doe');

  const fetchData = async () => {
    try {
      const response = await fetch("http://" + ip_adress + "/protected");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setListData(data.user);
      try {
        const response = await axios.get(
          `http://${ip_adress}/profile/${data.user.email}`
        );
        const imageData = response.data.profileImage;
        console.log(imageData);

        if (imageData) {
          setProfileImage(imageData[0]);
        }
      } catch (error) {
        console.error("Error fetching profile photo:", error.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    // Fetch the user's profile photo when the component mounts
    fetchProfilePhoto();
  }, []);

  useEffect(() => {
    // Request camera roll permission when the component mounts
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission denied for camera roll");
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result);
      try {
        console.log(result.assets[0]);
  
        const response2 = await fetch(
          `http://${ip_adress}/upload/${listdata.email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ profileimage: [result.assets[0]] }),
          }
        );
  
        if (response2.ok) {
          setProfileImage(result.assets[0]);
        } else {
          console.error("Error uploading image1:", error);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else{

    }
    
  };

  const fetchProfilePhoto = async () => {};

  const handleLogout = async () => {
    const response = await fetch(`http://${ip_adress}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listdata }),
    });

    // Handle the response
    if (response.ok) {
      // Parse the response as JSON
      const data = await response.json();

      // Handle the success or failure based on the response
      if (data.message === "Logout successful") {
        console.log("message: ", data.message);

        navigation.navigate("Home");
      } else {
        alert("logout unsuccessful");
      }
    } else {
      console.error("HTTP error:", response.status);
    }
  };
  return (
    <SafeAreaView
      style={{
        marginTop:  "10%",
        backgroundColor: Colors.primary,
        flex: 1,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
        style={{
          backgroundColor: Colors.darkSubtle,
          width: 50,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 89,
          top: '7%',
          position: 'absolute',
          right: '3%',
          zIndex: 1
        }}
      >
        <Ionicons name="settings" size={35} color="rgba(255,255,255,0.3)" />
      </TouchableOpacity>
      <View style={styles.container}>
        <View
          style={{
            width: 200,
            backgroundColor: Colors.brown,
            height: 200,
            borderRadius: 300,
            marginTop: "2%",
            borderWidth: 4,
            borderColor: Colors.subtleHigher,
          }}
        >
          {profileImage && <Image source={profileImage} style={styles.image} />}
          <TouchableOpacity
            onPress={uploadImage}
            style={{
              backgroundColor: Colors.darkSubtle,
              width: 60,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 395,
              margin: 10,
              position: "absolute",
              zIndex: 1,
              bottom: -30,
              right: "0%",
              borderWidth: 4,
              borderColor: Colors.subtleHigher,
            }}
          >
            <MaterialCommunityIcons
              name="camera-plus"
              size={35}
              color={Colors.text}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: "15%",
            alignItems: "center",
          }}
        >
          <Text style={styles.receptionText4}>
            {listdata.lastName} {listdata.firstName}
          </Text>
          <Text style={styles.receptionText4}>{listdata.email}</Text>
        </View>

        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: "5%",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("GetHelp")}
            style={{
              width: 150,
              backgroundColor: Colors.subtle,
              height: 100,
              borderRadius: 20,
              borderWidth: 4,
              borderColor: Colors.subtle,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.sponsored_button}>get help</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Legal")}
            style={{
              width: 150,
              backgroundColor: Colors.subtle,
              height: 100,
              borderRadius: 20,
              borderWidth: 4,
              borderColor: Colors.subtle,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.sponsored_button}>legal</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("WarpInc")}
            style={{
              width: 150,
              backgroundColor: Colors.subtle,
              height: 100,
              borderRadius: 20,
              borderWidth: 4,
              borderColor: Colors.subtle,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.sponsored_button}>sponsored by</Text>
            <Text style={styles.sponsored_button}>Warp inc.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Privacy")}
            style={{
              width: 150,
              backgroundColor: Colors.subtle,
              height: 100,
              borderRadius: 20,
              borderWidth: 4,
              borderColor: Colors.subtle,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.sponsored_button}>privacy</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.vpnButtonHolder}>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.receptionText4}>
              logout{" "}
              <MaterialCommunityIcons
                name="door"
                size={15}
                color="rgba(255,255,255,0.6)"
              />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: StatusBar.height,
  },
  notificationHolder: {
    width: "95%",
    backgroundColor: Colors.subtle,
    height: 200,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: Colors.subtle,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.subtle,
    color: Colors.white,
    padding: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: '20%',
  },
  receptionText4: {
    color: Colors.subtleHigher,
    fontSize: 15,
    marginVertical: 6,
    textTransform: "uppercase",
  },
  sponsored_button: {
    height: 30,
    textTransform: "uppercase",
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
  },
  image: {
    width: 192,
    height: 192,
    borderRadius: 300,
    marginTop: 0
  },
});

export default Documentation;
