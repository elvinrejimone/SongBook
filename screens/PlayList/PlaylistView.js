import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  Text,
  Divider,
  CheckBox,
  Input,
  Icon,
  Button,
  Tooltip,
  ListItem,
} from "react-native-elements";
import Toast from "react-native-tiny-toast";
import { FloatingAction } from "react-native-floating-action";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-community/async-storage";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ActionSheet from "react-native-actionsheet";

function PlaylistView({ route, navigation }) {
  const [editing, setediting] = useState(
    route.params.option == "edit" ? true : false
  );
  const [IsEmpty, setIsEmpty] = useState(false);
  const [Playlistname, setPlaylistname] = useState(route.params.item.name);
  const [PlaylistNote, setPlaylistNote] = useState(route.params.item.note);
  const [PlatlistKey, setPlatlistKey] = useState(
    route.params.item.playlist_key
  );
  const [currentPlaylist, setcurrentPlaylist] = useState([]);
  const [isOnline, setIsOnline] = useState(
    route.params.item.isOnline == "online" ? true : false
  );
  const [showNote, setshowNote] = useState(
    route.params.item.note == "-" ? false : true
  );
  const [currentPlaylists, setcurrentPlaylists] = useState([]);
  const [date, setDate] = useState(
    route.params.item.updated_time == ""
      ? new Date()
      : Date.parse(route.params.item.updated_time)
  );
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  //Action Butoon Constants
  const actions = [
    {
      text: "Add/Remove Songs",
      icon: require("../../assets/images/plus-icon100.png"),
      name: "add_song",
      position: 1,
      color: "tomato",
    },
    {
      text: "Edit Playlist",
      icon: require("../../assets/images/edit-icon.png"),
      name: "edit_playlist",
      position: 2,
      color: "tomato",
    },
  ];

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log(route.params);
      _getPlaylistData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  /* 
  All playlists Data Functions Start
*/

  //Store All Playlist Data
  const storeData = async (newList) => {
    try {
      console.log("Storing Updated JSON");
      const jsonValue = JSON.stringify(newList);
      await AsyncStorage.setItem("testPlayLists", jsonValue).then(
        console.log("Done!")
      );
    } catch (e) {
      console.log(e);
    }
  };

  // Get All PlayLists for Edit
  const getSongListData = async () => {
    try {
      const value = await AsyncStorage.getItem("testPlayLists");
      let jsonValue = value != null ? JSON.parse(value) : null;
      if (jsonValue == null) {
        console.log("No PlayList Found!");
      } else {
        console.log("Got Playlist!");
        setcurrentPlaylists(jsonValue);
      }
    } catch (e) {
      console.log(e);
    }
  };

  /* 
  All playlists Data Functions End
*/

  /* 
  Playlist Songs Data Functions Start
*/

  //Store Playlist Data
  const _storePlaylistData = async (playList) => {
    try {
      console.log("Storing Updated Playlist Song Data");
      const jsonValue = JSON.stringify(playList);
      await AsyncStorage.setItem(PlatlistKey, jsonValue).then(
        _getPlaylistData()
      );
    } catch (e) {
      console.log(e);
    }
  };

  //Get PLaylist Songs Data
  const _getPlaylistData = async () => {
    console.log("Inside Get Data Function");
    try {
      const value = await AsyncStorage.getItem(PlatlistKey);
      let jsonValue = value != null ? JSON.parse(value) : null;
      if (jsonValue == null) {
        console.log("Data not Available!");
        _storePlaylistData([]);
      } else {
        console.log("Data Recieved :: " + jsonValue);
        setcurrentPlaylist(jsonValue);
        if (jsonValue.length === 0) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  /* 
  Playlist Songs Data Functions End
*/

  const editAddSongDelete = (action) => {
    if (action == "edit_playlist") {
      setediting(true);
      getSongListData();
    } else if (action == "add_song") {
      console.log("Add Song");
      navigation.navigate("AddSongstoPlaylist", {
        name: route.params.item.name,
        item: route.params.item,
        currentSongs: currentPlaylist,
      });
    } else {
      console.log("Other Options");
    }
  };

  //Saving PlaylistEdit
  const uploadPlaylistEdit = () => {
    //console.log(new Date());
    setediting(false);
    let curr_library = currentPlaylists;
    let newLib = curr_library.filter((entity) => {
      return !entity.id.match(route.params.item.id);
    });

    let Playnote = showNote == true ? PlaylistNote : "-";
    let storeType = "user_local";
    let perf_date = date;
    let updatedDate = perf_date.toString();
    let updatedPLaylist = {
      id: route.params.item.id,
      name: Playlistname,
      note: Playnote,
      type: storeType,
      playlist_key: route.params.item.playlist_key,
      updated_time: updatedDate,
      song_count: route.params.item.song_count,
      isOnline: "false",
    };

    newLib.unshift(updatedPLaylist);
    console.log(newLib);
    storeData(newLib);
    Toast.show("Updated " + Playlistname + " to Library!", Toast.LONG);
    navigation.setParams({
      name: Playlistname,
      item: updatedPLaylist,
      option: "view",
    });
  };

  //Date Processing
  const ondateChange = (selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!editing && (
        <Card containerStyle={{ padding: 2, margin: 5 }}>
          <Text
            style={{
              fontSize: 18,
              padding: 1,
              color: "#000",
              textAlign: "center",
            }}
            h4
          >
            {route.params.name}
          </Text>
          {showNote && (
            <View>
              <Text style={{ fontSize: 12, padding: 1, textAlign: "center" }}>
                {PlaylistNote != ""
                  ? PlaylistNote
                  : "Edit PlayList to Add Note Here"}
              </Text>
            </View>
          )}
        </Card>
      )}
      {editing && (
        <Card containerStyle={{ padding: 2, margin: 5 }}>
          <Input
            value={Playlistname}
            placeholder="Song Name "
            onChangeText={(value) => setPlaylistname(value)}
          />
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                flex: 5,
                marginTop: 6,
              }}
            >
              <CheckBox
                style={{
                  flex: 1,
                }}
                title="Show Playlist Notes"
                checked={showNote}
                onPress={() => setshowNote(!showNote)}
              />
            </View>

            <View
              style={{
                flex: 1,
                paddingTop: 0,
              }}
            >
              <Icon
                raised
                name="check"
                type="font-awesome"
                color="tomato"
                onPress={uploadPlaylistEdit}
              />
            </View>
          </View>
          {showNote && (
            <Input
              placeholder="Playlist Notes"
              value={PlaylistNote}
              multiline={true}
              onChangeText={(value) => setPlaylistNote(value)}
            />
          )}
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                flex: 5,
              }}
            >
              <Button
                type="outline"
                onPress={showDatepicker}
                titleStyle={{ color: "tomato" }}
                buttonStyle={{ borderColor: "tomato" }}
                title="Set/Change Performace Date"
              />
            </View>
            <View
              style={{
                flex: 1,
                marginTop: 6,
              }}
            >
              <Tooltip
                backgroundColor="tomato"
                height={100}
                width={250}
                popover={
                  <Text style={{ color: "white", fontSize: 16 }}>
                    Selecting Performace Date here will bring this playlist in
                    the feed Tab on the Performance day or Week
                  </Text>
                }
              >
                <Icon
                  name="question-circle"
                  type="font-awesome"
                  color="tomato"
                />
              </Tooltip>
            </View>

            {show && (
              <View>
                <RNDateTimePicker
                  style={{
                    width: "100%",
                    backgroundColor: "grey",
                    color: "black",
                  }}
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={ondateChange}
                />
              </View>
            )}
          </View>
        </Card>
      )}
      {IsEmpty && (
        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              marginTop: "50%",
              width: "100%",
            }}
          >
            No Songs in Playlist.
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 13,
              marginTop: "5%",
              width: "100%",
            }}
          >
            Add Songs by pressing on the <Text h4> + </Text> icon
          </Text>
        </View>
      )}
      {!IsEmpty && (
        <View style={{ marginTop: 10 }}>
          <ScrollView style={{ flex: 0 }}>
            {currentPlaylist.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SongView", {
                    name: item.song_name,
                    lyrics: item.song_lyric,
                    item: item,
                    playList: currentPlaylist,
                    playlistIndex: index,
                    option: "view",
                    isplayList: true,
                  });
                }}
              >
                <ListItem
                  key={index}
                  title={item.song_name}
                  subtitle={item.artist}
                  rightElement={
                    <Icon
                      name="more-vert"
                      type="material"
                      color="#a9a9a9"
                      size={29}
                    />
                  }
                  bottomDivider
                  chevron
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      <FloatingAction
        color={"tomato"}
        overrideWithAction={false}
        actions={actions}
        onPressItem={(name) => {
          editAddSongDelete(name);
        }}
      />
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

export default PlaylistView;
