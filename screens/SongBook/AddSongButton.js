import React from "react";
import { Icon } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

function AddSongButton({ navigation }) {
  return (
    <Icon
      raised
      name="plus"
      type="font-awesome"
      color="#f50"
      size={17}
      onPress={() => navigation.navigate("AddSong")}
    />
  );
}

export default AddSongButton;
