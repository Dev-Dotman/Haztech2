import React, { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import Svg, { SvgXml } from "react-native-svg";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  ScrollView,
  LogBox,
} from "react-native";
import OTPEntry from "./OTPEntry";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IpAdress from "./IpAdress";
import Colors from "./Colors";

const Tab = createBottomTabNavigator();

export default function Homepage() {
  const [apploading, setApploading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confidant1, setConfidant1] = useState("");
  const [confidant2, setConfidant2] = useState("");
  const [dummytoken, setDummytoken] = useState("");
  const [emailVerification, setEmailVerification] = useState(false);
  const [page, setPage] = useState("login");
  const [errors, setErrors] = useState("");
  const [errmessage, setErrmessage] = useState("");
  const [loggedin, setLoggedin] = useState(false);
  const [listdata, setListData] = useState([]);
  const navigation = useNavigation();
  const bounceValue = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  LogBox.ignoreLogs([
    'Warning: No native splash screen registered for given view controller. Call "SplashScreen.show" for given view controller first.',
  ]);

  useEffect(() => {
    const startAnimation = () => {
      // Bounce Animation
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 4.1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.spring(bounceValue, {
          toValue: 2,
          friction: 4,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // Scale to Size 2 Animation
        Animated.timing(bounceValue, {
          toValue: 2,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      });
    };

    startAnimation(); // Start the animation when the component mounts

    return () => {
      // Clean up the animation on unmount if needed
      bounceValue.removeAllListeners();
    };
  }, [bounceValue]);

  useEffect(() => {
    const startFadeOut = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // Adjust the duration as needed
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    };

    // Start fading out after a delay of 2 seconds (2000 milliseconds)
    const delay = setTimeout(startFadeOut, 2000);

    // Clean up the timer to avoid memory leaks
    return () => clearTimeout(delay);
  }, [fadeAnim]);

  const backgroundColorInterpolate = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(19,16,34)", "rgb(19,16,34)"], // From and to the color RGB(19,16,34)
  });

  const mainIcon =
    '<svg fill="#EEf5db" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-33.37 -33.37 400.40 400.40" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-33.37" y="-33.37" width="400.40" height="400.40" rx="200.2" fill="rgb(59, 56, 74)" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M330.396,282.031L178.487,35.471c-2.504-4.074-6.96-6.555-11.736-6.555c-4.795,0-9.235,2.48-11.751,6.555L2.051,283.712 c-2.624,4.251-2.735,9.602-0.306,13.961c2.441,4.371,7.046,7.073,12.058,7.073h305.881c0.055-0.018,0.114-0.018,0.181,0 c7.62,0,13.799-6.19,13.799-13.799C333.669,287.543,332.438,284.445,330.396,282.031z M157.692,111.062h18.104v109.96h-18.104 V111.062z M175.695,261.243c-2.66,2.498-5.647,3.759-8.956,3.759c-3.303,0-6.285-1.261-8.948-3.759 c-2.651-2.534-3.978-5.579-3.978-9.182c0-3.585,1.261-6.629,3.774-9.157c2.504-2.511,5.554-3.771,9.152-3.771 c3.584,0,6.656,1.261,9.172,3.771c2.504,2.528,3.771,5.572,3.771,9.157C179.683,255.664,178.337,258.708,175.695,261.243z"></path> </g> </g></svg>';

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var ip_address = IpAdress.ip;

  setTimeout(() => {
    setApploading(false);
  }, 2500);
  const enableSignUp = () => {
    setPage("signup");
  };
  const enableLogin = () => {
    setPage("login");
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          console.log("Token retrieved successfully:", token);
          navigation.navigate("Vpn");
          return token;
        } else {
          console.log("No token found");
          return null;
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
      }
    };

    getToken();
  }, []);

  const handleLogin = async () => {
    const loginDetails = {
      email: email,
      password: password,
    };

    try {
      // Encode sensitive data before sending
      // Send data to the backend using the Fetch API
      console.log(loginDetails)
      const response = await fetch("http://" + ip_address + "/user_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email : email , password : password}),
      });
      console.log(ip_address)
      // Handle the response
      const result = await response.json();
      console.log("Login result:", result);
      const loginerr = result.error;
      setErrmessage(loginerr);

      // Check if login was successful
      if (result.success) {
        try {
          const response = await fetch("http://" + ip_address + "/protected");

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setListData(data);
          console.log("login successful");

          console.log("Data received:", data.token);
          try {
            // await AsyncStorage.setItem('userToken', data.token);
            // console.log('Token saved successfully');
          } catch (error) {
            console.error("Error saving token:", error);
          }
        } catch (error) {
          // console.error("Error fetching data:", error.message);
        }
        navigation.navigate("Vpn");
        // Optionally, you can call onLogin to notify the parent component about successful login
      } else {
        // Handle unsuccessful login (show error message, etc.)
        console.log(errors);
      }
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  const handleSubmit = async () => {
    const isValid = EMAIL_REGEX.test(email);
    setIsValidEmail(isValid);

    if (
      firstName === "" ||
      lastName === "" ||
      password === "" ||
      confidant1 === "" ||
      confidant2 === ""
    ) {
      setError("all fields are required");
      return;
    }
    if (isValidEmail === false) {
      setError("email is invalid");
    } else {
      setDummytoken(firstName);
      try {
        // Encode sensitive data before sending

        // Send data to the backend using the Fetch API
        const response = await fetch(`http://${ip_address}/check-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        // Handle the response
        if (response.ok) {
          // Parse the response as JSON
          const data = await response.json();

          // Handle the success or failure based on the response
          if (!data.exists) {
            setEmailVerification(true);
            setTimeout(() => {
              setEmailVerification(false);
              setPage("login");
            }, 300000);
          } else {
            alert("Email Unavailable");
          }
        } else {
          console.error("HTTP error:", response.status);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  if (apploading === true) {
    return (
      <Animated.View
        style={[
          styles.container2,
          { backgroundColor: backgroundColorInterpolate },
        ]}
      >
        <View>
          <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
            <Ionicons name="warning" size={55} color={Colors.navbar} />
          </Animated.View>
        </View>
      </Animated.View>
    );
  }

  if (
    apploading === false &&
    emailVerification === false &&
    page === "signup" &&
    loggedin === false
  ) {
    return (
      <SafeAreaView
        style={{
          marginTop: "auto",
          backgroundColor: Colors.primary,
          flex: 1,
        }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: Colors.primary, alignItems: "center" },
          ]}
        >
          <StatusBar style="auto" />
          <Svg width={100} height={150}>
            <SvgXml xml={mainIcon} />
          </Svg>
          <Text style={styles.forgot_button}>{error}</Text>

          <ScrollView
            style={{
              backgroundColor: Colors.primary,
              height: "100%",
              width: "100%",
              marginLeft: "10%",
            }}
          >
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="First Name"
                placeholderTextColor="rgba(255,255,255, 0.4)"
                onChangeText={(firstname) => setFirstName(firstname)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Last Name"
                placeholderTextColor="rgba(255,255,255, 0.4)"
                onChangeText={(lastname) => setLastName(lastname)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255, 0.4)"
                onChangeText={(email) => setEmail(email)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255, 0.4)"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="confidant 1"
                placeholderTextColor="rgba(255,255,255, 0.4)"
                onChangeText={(password) => setConfidant1(password)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="confidant 2"
                placeholderTextColor="rgba(255,255,255, 0.4)"
                onChangeText={(password) => setConfidant2(password)}
              />
            </View>
            <View
              style={{
                height: 150,
                width: 100,
              }}
            ></View>
          </ScrollView>
          <TouchableOpacity style={styles.RegisterBtn} onPress={handleSubmit}>
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text style={styles.loginText2}>Already have an account? </Text>
            <TouchableOpacity onPress={enableLogin}>
              <Text style={styles.login_button}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            height: 200,
            width: "100%",
            marginVertical: 20,
            borderRadius: 20,
          }}
        ></View>
      </SafeAreaView>
    );
  }

  if (
    apploading === false &&
    emailVerification === false &&
    page === "login" &&
    loggedin === false
  ) {
    return (
      <SafeAreaView
        style={{
          marginTop: "auto",
          backgroundColor: Colors.primary,
          flex: 1,
        }}
      >
        <View style={styles.container}>
          <Svg width={100} height={150}>
            <SvgXml xml={mainIcon} />
          </Svg>
          <Text style={styles.welcome}>welcome to Haztech!</Text>
          <Text style={styles.forgot_button}>{errmessage}</Text>

          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255, 0.4)"
              onChangeText={(email) => setEmail(email)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255, 0.4)"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>

          <TouchableOpacity style={styles.RegisterBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text style={[styles.loginText2, { marginBottom: 400 }]}>
              Dont have an account?{" "}
            </Text>
            <TouchableOpacity onPress={enableSignUp}>
              <Text style={[styles.login_button, { marginBottom: 400 }]}>
                Signup
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sponsored_button}>Warp inc.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (
    apploading === false &&
    emailVerification === true &&
    page === "signup" &&
    loggedin === false
  ) {
    return (
      <OTPEntry
        firstName={firstName}
        lastName={lastName}
        email={email}
        password={password}
        dummytoken={dummytoken}
        confidant1={confidant1}
        confidant2={confidant2}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgb(19,16,34)",
    alignItems: "center",
  },
  container2: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    width: "90%",
    height: 55,
    marginBottom: 20,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: "white",
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
    textTransform: "uppercase",
    fontWeight: "700",
    color: "red",
  },
  welcome: {
    height: 30,
    marginBottom: 30,
    textTransform: "uppercase",
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
  },
  login_button: {
    height: 30,
    marginVertical: 30,
    textTransform: "uppercase",
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
  },
  sponsored_button: {
    height: 30,
    marginVertical: 30,
    textTransform: "uppercase",
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    position: "absolute",
    bottom: 0,
    right: 10,
  },
  RegisterBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#EEf5db",
  },
  loginText2: {
    height: 30,
    marginVertical: 30,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
  },
});
