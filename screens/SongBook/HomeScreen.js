import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import SongBook from "./SongBook";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <SongBook />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
