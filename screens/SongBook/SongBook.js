import React from "react";
import { Icon } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";

import SearchableList from "./SearchableList";
import LogoTitle from "./LogoTitle";

const HomeStack = createStackNavigator();

function SongBookStack() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "tomato" },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <HomeStack.Screen
        name="SongBook"
        component={SearchableList}
        options={({ navigation }) => ({
          headerRight: () => (
            <Icon
              raised
              name="plus"
              type="font-awesome"
              color="tomato"
              size={17}
              onPress={() => navigation.navigate("AddSong")}
            />
          ),
        })}
      />
    </HomeStack.Navigator>
  );
}

export default function HomeScreen() {
  return <SongBookStack />;
}
