import React from "react";
import { Icon } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";

import SearchableList from "./SearchableList";
import SongView from "./SongView";
import AddSong from "./AddSong";
import LogoTitle from "./LogoTitle";
//import AddSongButton from "./AddSongButton";

const HomeStack = createStackNavigator();

function SongBookStack() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#f4511e" },
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
              color="#f50"
              size={17}
              onPress={() => navigation.navigate("AddSong")}
            />
          ),
        })}
      />
      <HomeStack.Screen
        name="SongView"
        component={SongView}
        options={({ route }) => ({ title: route.params.name })}
      />
      <HomeStack.Screen
        name="AddSong"
        component={AddSong}
        options={() => ({ title: "Add a new Song" })}
      />
    </HomeStack.Navigator>
  );
}

export default function HomeScreen() {
  return <SongBookStack />;
}
