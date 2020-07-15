import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";

function TeamsPage(props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello This is the Playlist page</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  findingImage: {
    width: 300,
    height: 300,
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

export default TeamsPage;
