import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Card, ListItem, Icon } from "react-native-elements";
import MultiSelect from "react-native-multiple-select";
import AsyncStorage from "@react-native-community/async-storage";

function AddSongsModal({ route, navigation }) {
  const [currentPlaylistSongs, setcurrentPlaylistSongs] = useState(
    route.params.currentSongs
  );
  const [PlatlistKey, setPlatlistKey] = useState(
    route.params.item.playlist_key
  );
  const [selectedItems, setselectedItems] = useState([]);
  const [songsFound, setsongsFound] = useState(false);
  const [allSongs, setallSongs] = useState([]);

  useEffect(() => {
    getAllSongsData();
    setselectedItemIDList();
    console.log(selectedItems);
  }, [songsFound]);

  const setselectedItemIDList = () => {
    currentPlaylistSongs.map((playlistSong) => {
      selectedItems.push(playlistSong.id);
    });
  };

  //Store Playlist Data
  const _storePlaylistData = async (playList) => {
    try {
      console.log("Storing Updated Playlist Song Data");
      const jsonValue = JSON.stringify(playList);
      await AsyncStorage.setItem(PlatlistKey, jsonValue).then(
        console.log("Done Uploading the songs!")
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getAllSongsData = async () => {
    try {
      const value = await AsyncStorage.getItem("testSongs");
      let jsonValue = value != null ? JSON.parse(value) : null;
      if (jsonValue == null) {
        console.log("No Songs Found");
        setsongsFound(false);
      } else {
        console.log(jsonValue);
        setallSongs(jsonValue);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSelectedItemsChange = (selectedItems) => {
    setselectedItems(selectedItems);
    console.log(selectedItems);
  };

  const onPressDone = () => {
    console.log("Done Adding Songs!");
    let newPlayList = allSongs.filter((all) => selectedItems.includes(all.id));
    console.log(newPlayList);
    _storePlaylistData(newPlayList);
    navigation.goBack();
  };

  return (
    <View style={(styles.container, { flex: 1 })}>
      <MultiSelect
        items={allSongs}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        selectText=" Add Song From Library "
        hideDropdown={true}
        searchInputPlaceholderText="Search Song for Storage"
        tagRemoveIconColor="red"
        tagBorderColor="#000"
        tagTextColor="#000"
        selectedItemTextColor="#000"
        selectedItemIconColor="#CCC"
        itemTextColor="#695959"
        itemFontSize={20}
        displayKey="song_name"
        searchInputStyle={{ color: "#CCC" }}
        submitButtonText="Done Selection"
      />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Card
          containerStyle={{
            padding: 2,
            margin: 5,
            marginBottom: 10,
            marginHorizontal: 10,
          }}
        >
          <Button
            large
            type="clear"
            color="#000"
            titleStyle={{ color: "#000", fontWeight: "bold" }}
            onPress={onPressDone}
            title="Done"
          />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  lyricsFont: {
    marginTop: 0,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 10,
  },
  navigationFilename: {
    marginTop: 5,
  },
  tabBarInfoContainer: {
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    height: 60,
    justifyContent: "center",
    backgroundColor: "#fbfbfb",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 8,
  },
  tabBarInfoText: {
    fontSize: 17,
    textAlign: "center",
    flex: 1,
  },
});

export default AddSongsModal;
