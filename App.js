import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Homepage from './screenComponents/Homepage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Vpnscreens from './screenComponents/Vpnscreens';
import VpnPage from './screenComponents/VpnPage';
import Documentation from './screenComponents/Documentation';
import Notificationscreen from './screenComponents/Notificationscreen';
import SettingsScreen from './screenComponents/SettingsScreen';
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Colors from './screenComponents/Colors';
import Legal from './screenComponents/Legal';
import Privacy from './screenComponents/Privacy';
import GetHelp from './screenComponents/GetHelp';
import WarpInc from './screenComponents/WarpInc';
import Location from './screenComponents/LocationPage';
import { useState } from 'react';
import LocationHistory from './screenComponents/LocationHistory';
import LocationServer from './screenComponents/LocationServer';


const Stack = createStackNavigator();


const Tab = createBottomTabNavigator();

const HomeTab = () => {
  const [backgroundColor, setBackgroundColor] = useState(Colors.navbar)
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: backgroundColor,
            borderBlockColor: Colors.darkSubtle,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute'
          },
          tabBarIcon: ({ focused, size, colour }) => {
            let iconName;
            if (route.name === "VpnPage") {
              iconName = focused ? "ios-home" : "ios-home-outline";
              size = focused ? size + 8 : size + 5;
              colour = focused ? Colors.text : Colors.text;
            } else if (route.name === "Profile") {
              iconName = focused
                ? "person-circle-sharp"
                : "person-circle-outline";
              size = focused ? size + 18 : size + 12;
              colour = focused ? Colors.text : Colors.text;
            } else if (route.name === "Location") {
              iconName = focused
                ? "location"
                : "location-outline";
              size = focused ? size + 10 : size + 10;
              colour = focused ? Colors.text : Colors.text;
            } else if (route.name === "Connect") {
              iconName = focused
                ? "wifi"
                : "wifi-outline";
              size = focused ? size + 10 : size + 10;
              colour = focused ? Colors.text : Colors.text;
            }
            return <Ionicons name={iconName} size={size} color={colour} />;
          },
        })}
      >
        <Tab.Screen name="VpnPage" component={VpnPage} />
        <Tab.Screen name="Location" component={Location} />
        <Tab.Screen name="Connect" component={LocationServer} />
        <Tab.Screen name="Profile" component={Documentation} />
      </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" >
        <Stack.Screen name="Home" component={Homepage} options={{ headerShown: false }}/>
        <Stack.Screen name="Vpn" component={HomeTab} options={{ headerShown: false }}/>
        <Stack.Screen name="Notifications" component={Notificationscreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Legal" component={Legal} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="GetHelp" component={GetHelp} />
        <Stack.Screen name="WarpInc" component={WarpInc} />
        <Stack.Screen name="LocationHistory" component={LocationHistory} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

