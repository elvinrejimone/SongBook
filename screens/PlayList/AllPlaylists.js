import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Vibration,
  Platform,
  ToastAndroid,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { FloatingAction } from "react-native-floating-action";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import {
  Card,
  ListItem,
  Button,
  Icon,
  Avatar,
  Overlay,
  SearchBar,
  withTheme,
} from "react-native-elements";
import DialogInput from "react-native-dialog-input";
import Toast from "react-native-tiny-toast";
import preLoadedPlayList from "./PlaylistPreLoad.json";
import OptionSheet from "./OptionSheet";

function AllPlaylists({ route, navigation }) {
  //State Variables
  const [search, setSearch] = useState("");
  const [AllPlayLists, setAllPlayLists] = useState([]);
  const [AllPlayLists_backup, setAllPlayLists_backup] = useState([]);
  const [songListLoaded, setsongListLoaded] = useState(false);
  const [requireDataFromStore, setrequireDataFromStore] = useState(true);
  const [AllPlaylistnamevisible, setAllPlaylistnamevisible] = useState(false);
  const [isOptionModalVisible, setisOptionModalVisible] = useState(false);

  //Action Butoon Constants
  const actions = [
    {
      text: "Add Playlist",
      icon: require("../../assets/images/plus-icon100.png"),
      name: "add_playlist",
      position: 1,
      color: "tomato",
    },
  ];

  useEffect(() => {
    getData();
  }, [requireDataFromStore]);

  useFocusEffect(
    React.useCallback(() => {
      getData();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const storeData = async (SongList) => {
    try {
      console.log("Inside Store Data");
      const jsonValue = JSON.stringify(SongList);
      await AsyncStorage.setItem("testPlayLists", jsonValue).then(getData());
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("testPlayLists");
      let jsonValue = value != null ? JSON.parse(value) : null;
      if (jsonValue == null) {
        console.log("Preparing to Store Value!");
        storeData(preLoadedPlayList);
      } else {
        console.log("Got PlayList!");
        setAllPlayLists(jsonValue);
        setAllPlayLists_backup(jsonValue);
        setsongListLoaded(true);
      }
    } catch (e) {
      console.log(e);
    }
  };
  //New PlayList

  //Search Functionality
  const updateSearch = (search) => {
    setSearch(search);
    let data = AllPlayLists_backup;
    let searchText = search.trim().toLowerCase();

    data = data.filter((l) => {
      return l.name.toLowerCase().match(searchText);
    });
    setAllPlayLists(data);
  };

  //Adding Playlist and Opening the Playlist
  const handleAddingPlaylist = () => {
    setAllPlaylistnamevisible(true);
  };

  const uploadAddPlaylist = (playlistName) => {
    setAllPlaylistnamevisible(false);
    let curr_library = AllPlayLists;
    let new_ID =
      "userLocal" +
      playlistName.substring(0, 4) +
      (Math.floor(Math.random() * 100) + 10).toString();
    let playlist_key =
      "testPlaylist" +
      playlistName.substring(0, 4) +
      (Math.floor(Math.random() * 100) + 10).toString();
    let Playnote = "";
    let storeType = "user_local";
    let perf_date = new Date();
    let updatedDate = perf_date.toString();
    let newPlaylist = {
      id: new_ID,
      name: playlistName,
      note: Playnote,
      type: storeType,
      playlist_key: playlist_key,
      updated_time: updatedDate,
      song_count: 0,
      isOnline: "false",
    };

    curr_library.unshift(newPlaylist);
    storeData(curr_library);
    Toast.show(
      "Added new Playlist " + playlistName + " to Library!",
      Toast.LONG
    );
    getData();
    navigation.navigate("PlaylistView", {
      name: playlistName,
      item: newPlaylist,
      option: "view",
    });
  };

  //Action Sheet Start

  const removePlaylist = async (key) => {
    try {
      await AsyncStorage.removeItem(key).then(console.log("removed :: " + key));
    } catch (e) {
      // remove error
    }
  };

  const DeleteSong = async (id) => {
    console.log("Deleting! ::: " + id);
    let curr_library = AllPlayLists_backup;
    let deletingElement = AllPlayLists.find((entity) => entity.id === id);
    let newLib = curr_library.filter((entity) => {
      return !entity.id.match(id);
    });
    let playlist_key = deletingElement.playlist_key;
    console.log(deletingElement);
    removePlaylist(playlist_key);
    storeData(newLib);
    ToastAndroid.show("Deleted Song", ToastAndroid.SHORT);
    setrequireDataFromStore(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Deleting Song",
      "Are you sure You want to Delete the Song",
      [
        {
          text: "Yes",
          onPress: () => DeleteSong(id),
        },
        {
          text: "Cancel",
          onPress: () =>
            ToastAndroid.show("Cancelled Delete", ToastAndroid.SHORT),
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const _onOpenActionSheet = (id) => {
    Vibration.vibrate(50, true);
    setisOptionModalVisible(true);
  };

  const executeSelectedAction = (id, playlist) => {
    if (id == 0) {
      navigation.navigate("PlaylistView", {
        name: playlist.name,
        item: playlist,
        option: "view",
      });
    } else if (id == 1) {
      console.log("Share");
    } else if (id == 2) {
      handleDelete(playlist.id);
    } else {
      ToastAndroid.show("Cancelled Action", ToastAndroid.SHORT);
    }
  };

  const toggleModal = () => {
    setisOptionModalVisible(!isOptionModalVisible);
  };

  //Action Sheet End

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        lightTheme
        platform="android"
        placeholder="Search Playlists"
        onChangeText={updateSearch}
        value={search}
      />
      <ScrollView style={{ flex: 0 }}>
        {AllPlayLists.map((u, i) => {
          return (
            <TouchableOpacity
              onLongPress={_onOpenActionSheet}
              onPress={() => {
                navigation.navigate("PlaylistView", {
                  name: u.name,
                  item: u,
                  option: "view",
                });
              }}
            >
              <ListItem
                key={i}
                title={u.name}
                subtitle={u.note}
                rightElement={
                  <OptionSheet
                    onOptionPressed={executeSelectedAction}
                    currentItem={u}
                  />
                }
                bottomDivider
                chevron
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <FloatingAction
        color={"tomato"}
        overrideWithAction={true}
        actions={actions}
        onPressItem={handleAddingPlaylist}
      />
      <DialogInput
        isDialogVisible={AllPlaylistnamevisible}
        title={"New Playlist"}
        hintInput={"Playlist name"}
        submitInput={(text) => uploadAddPlaylist(text)}
        submitText={"Add Playlist"}
        closeDialog={() => {
          setAllPlaylistnamevisible(false);
          Toast.show("Didn't Add Playlist", Toast.LONG);
        }}
      ></DialogInput>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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

export default AllPlaylists;
