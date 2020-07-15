import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SearchBar, ListItem, Text, Button, Icon } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import preLoadedSongList from "./SongList.json";
import ActionSheet from "react-native-actionsheet";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.testDb"); // returns Database object

class SearchableList extends React.Component {
  state = {
    search: "",
    songListLoaded: false,
    backupList: [],
    currentList: [],
    onlineList: [],
  };
  constructor() {
    super();
    //this.storeData(preLoadedSongList);
    // Check if the items table exists if not create it
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS testSongs (id TEXT PRIMARY KEY, song_name  TEXT, artist TEXT, starting TEXT, type  TEXT, storagetype TEXT, lyrics TEXT,language  TEXT, chord TEXT, isFavorite INT,imageurls TEXT)"
      );
    });
    this.getData();
  }

  componentDidUpdate() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.setState({
        songListLoaded: false,
      });
      this.getData();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  storeData = async (SongList) => {
    try {
      console.log("Inside Store Data");
      const jsonValue = JSON.stringify(SongList);
      await AsyncStorage.setItem("testSongs", jsonValue).then(this.getData());
    } catch (e) {
      console.log(e);
    }
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem("testSongs");
      let jsonValue = value != null ? JSON.parse(value) : null;
      if (jsonValue == null) {
        console.log("Preparing to Store Value!");
        this.storeData(preLoadedSongList);
      } else {
        if (this.state.songListLoaded == false) {
          // console.log(jsonValue);
          this.setState({
            backupList: jsonValue,
          });
          this.setState({
            currentList: jsonValue,
          });
          this.setState({
            songListLoaded: true,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  updateSearch = (search) => {
    this.setState({ search });
    let data = this.state.backupList;
    let searchText = search.trim().toLowerCase();

    data = data.filter((l) => {
      return l.song_name.toLowerCase().match(searchText);
    });
    this.setState({
      currentList: data,
    });
  };

  removelyrics = async (key) => {
    try {
      await AsyncStorage.removeItem(key).then(console.log("removed :: " + key));
    } catch (e) {
      // remove error
    }
  };

  DeleteSong = async (id) => {
    console.log("Deleting! ::: " + id);
    let curr_library = this.state.backupList;
    let deletingElement = this.state.currentList.find(
      (entity) => entity.id === id
    );
    let newLib = curr_library.filter((entity) => {
      return !entity.id.match(id);
    });
    let lyrics_key = deletingElement.song_lyric;
    this.removelyrics(lyrics_key);
    this.storeData(newLib);
    this.setState({
      songListLoaded: false,
    });
    ToastAndroid.show("Deleted Song", ToastAndroid.SHORT);
  };

  handleDelete = (id) => {
    Alert.alert(
      "Deleting Song",
      "Are you sure You want to Delete the Song",
      [
        {
          text: "Yes",
          onPress: () => this.DeleteSong(id),
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

  _onOpenActionSheet = (id) => {
    this.ActionSheet.show();
  };

  executeSelectedAction = (id, songItem) => {
    if (id == 0) {
      console.log("Opening");
      this.props.navigation.navigate("SongView", {
        name: songItem.song_name,
        lyrics: songItem.song_lyric,
        item: songItem,
        option: "view",
      });
    } else if (id == 1) {
      console.log("Editing");
      this.props.navigation.navigate("SongView", {
        name: songItem.song_name,
        lyrics: songItem.song_lyric,
        item: songItem,
        option: "edit",
      });
    } else if (id == 2) {
      console.log("Deleting");
      this.handleDelete(songItem.id);
    } else {
      console.log("Cancel");
    }
  };

  render() {
    var optionArray = ["Open", "Edit", "Delete", "Cancel"];
    const { search } = this.state;

    if (this.state.songListLoaded) {
      return (
        <View style={styles.container}>
          <SearchBar
            lightTheme
            platform="android"
            placeholder="Search Songs..."
            onChangeText={this.updateSearch}
            value={search}
          />

          <ScrollView style={{ flex: 0 }}>
            {this.state.currentList.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("SongView", {
                    name: item.song_name,
                    lyrics: item.song_lyric,
                    item: item,
                    playlist: [],
                    playlistIndex: 0,
                    isplayList: false,
                    option: "view",
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
                      onPress={() => this._onOpenActionSheet(item.id)}
                    />
                  }
                  bottomDivider
                  chevron
                />
                <ActionSheet
                  ref={(o) => (this.ActionSheet = o)}
                  title={"What do you want to do?"}
                  options={optionArray}
                  cancelButtonIndex={3}
                  destructiveButtonIndex={2}
                  onPress={(index) => this.executeSelectedAction(index, item)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.displayerView}>
            <Image
              style={styles.findingImage}
              source={require("../../assets/images/MessyDoodle.png")}
            />
            <ActivityIndicator size="large" color="#f4511e" />
          </View>
        </View>
      );
    }
  }
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

export default SearchableList;
