import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();
import SearchableList from "../SongBook/SearchableList";
import AllPlaylists from "./AllPlaylists";
import FavoritesPage from "./FavoritesPage";
import TeamsPage from "./TeamsPage";

export default function LinksScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        initialRouteName="Playlists"
        tabBarOptions={{
          activeTintColor: "#fff",
          labelStyle: { fontSize: 14, fontWeight: "bold" },
          indicatorStyle: { backgroundColor: "#fff" },
          style: { backgroundColor: "tomato" },
        }}
      >
        <Tab.Screen
          name="Playlists"
          component={AllPlaylists}
          options={{ tabBarLabel: "Playlist" }}
        />
        <Tab.Screen
          name="favorites"
          component={FavoritesPage}
          options={{ tabBarLabel: "Favorites" }}
        />
        <Tab.Screen
          name="Teams"
          component={TeamsPage}
          options={{ tabBarLabel: "Teams" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1,
  },
  findingImage: {
    width: 375,
    height: 375,
  },
  displayerView: {
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    justifyContent: "center",
    paddingVertical: 7,
    flex: 1,
    flexDirection: "column",
  },
});
