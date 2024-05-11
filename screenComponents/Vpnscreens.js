import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homepage from "./Homepage";
import Documentation from "./Documentation";

const Tab = createBottomTabNavigator();

function Vpnscreens(props) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        independent={true}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.blackdeep,
            borderBlockColor: colors.blackdeep,
          },
          tabBarIcon: ({ focused, size, colour }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "ios-home" : "ios-home-outline";
              size = focused ? size + 8 : size + 2;
              colour = focused ? "#EEf5db" : "rgba(0,0,0,0.6)";
            } else if (route.name === "Profile") {
              iconName = focused
                ? "person-circle-sharp"
                : "person-circle-outline";
              size = focused ? size + 18 : size + 12;
              colour = focused ? "#EEf5db" : "rgba(0,0,0,0.6)";
            }
            return <Ionicons name={iconName} size={size} color={colour} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={Homepage} />
        <Tab.Screen name="Profile" component={Documentation} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Vpnscreens;
