import React from "react";
import { Icon } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";

import LinkScreen from "./LinksScreen";
import PlayListView from "./PlaylistView";
import AddSongsModal from "./AddSongsModal";

const SetListStack = createStackNavigator();

function SetListHomeStack() {
  return (
    <SetListStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "tomato" },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <SetListStack.Screen
        name="Home"
        component={LinkScreen}
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
      <SetListStack.Screen
        name="PlaylistView"
        component={PlayListView}
        options={({ route }) => ({ title: route.params.name })}
      />
      <SetListStack.Screen
        name="AddSongstoPlaylist"
        component={AddSongsModal}
        options={({ route }) => ({
          title: "Add Songs to " + route.params.name,
        })}
      />
    </SetListStack.Navigator>
  );
}

export default function SetListHome() {
  return <SetListHomeStack />;
}
