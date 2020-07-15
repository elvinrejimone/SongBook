import React, { useState, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Switch,
  Platform,
  ScrollView,
  Vibration,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import Toast from "react-native-tiny-toast";
import ChordSheetJS from "chordsheetjs";
import Chord from "chordjs";
import AsyncStorage from "@react-native-community/async-storage";
import RNPickerSelect from "react-native-picker-select";
import {
  Icon,
  Avatar,
  Text,
  Card,
  Input,
  CheckBox,
  ButtonGroup,
} from "react-native-elements";

import { Picker } from "@react-native-community/picker";

import StayAwakePicker from "../SongBook/StayAwakePicker";

function SongView({ route, navigation }) {
  const [lyricsFontSize, setlyricsFontSize] = useState(20);
  const [favoriteIcon, setfavoriteIcon] = useState("star-o");
  const [addtoPlayListIcon, setaddtoPlayListIcon] = useState("plus-square-o");
  const [downloadIcon, setdownloadIcon] = useState(
    route.params.option == "edit" ? "floppy-o" : "pencil"
  );
  const [downloadtext, setdownloadtext] = useState(
    route.params.option == "edit" ? "Save" : "Edit"
  );
  const [edited, setedited] = useState(false);
  const [editing, setediting] = useState(
    route.params.option == "edit" ? true : false
  );
  const [outputSong, setOutputSong] = useState("");
  const [currentChord, setcurrentChord] = useState(route.params.item.chord);
  const [isON, setIsON] = useState(false);
  const [editable, seteditable] = useState(
    route.params.option == "edit" ? true : false
  );
  const [displayLyrics, setdisplayLyrics] = useState(false);
  const [currentLibrary, setcurrentLibrary] = useState([]);
  const [songName, setSongName] = useState(route.params.item.song_name);
  const [songArtist, setSongArtist] = useState(route.params.item.artist);
  const [isOnline, setIsOnline] = useState(
    route.params.item.storagetype == "online" ? true : false
  );
  const [hasChords, sethasChords] = useState(
    route.params.item.type == "lyrics" ? false : true
  );
  const [playlistIndex, setplaylistIndex] = useState(
    route.params.playlistIndex
  );
  const [isplayList, setisplayList] = useState(route.params.isplayList);
  const [inputChord, setinputChord] = useState(route.params.item.chord);
  const [playList, setplayList] = useState(route.params.playList);
  const [chordFormat, setChordFormat] = useState(0);
  const [fullScreenState, setFullScreenState] = useState(false);
  const lyrics = route.params ? route.params.lyrics : null;

  const placeholder = {
    label: inputChord,
    value: inputChord,
    color: "#f50",
  };

  const getData = async () => {
    console.log("Inside Get Data Function");
    try {
      const value = await AsyncStorage.getItem(lyrics);
      if (value == null) {
        console.log("Data not Available!");
      } else {
        const parser = new ChordSheetJS.ChordProParser();
        const song = parser.parse(value);
        const formatter = new ChordSheetJS.TextFormatter();
        const disp = formatter.format(song);
        setOutputSong(disp);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(route.params);
    console.log();
    getData();
    if (editing) {
      getSongListData();
    }
  }, [edited]);

  const onZoomIn = () => {
    let newFontSize = lyricsFontSize + 2;
    setlyricsFontSize(newFontSize);
  };
  const onZoomOut = () => {
    let newFontSize = lyricsFontSize - 2;
    setlyricsFontSize(newFontSize);
  };
  const addToFavorites = () => {
    let newIconName = favoriteIcon == "star" ? "star-o" : "star";
    setfavoriteIcon(newIconName);
  };
  const addToPlayList = () => {
    let newfavIcon =
      addtoPlayListIcon == "plus-square-o" ? "plus-square" : "plus-square-o";
    setaddtoPlayListIcon(newfavIcon);
  };

  const getSongListData = async () => {
    try {
      const value = await AsyncStorage.getItem("testSongs");
      let jsonValue = value != null ? JSON.parse(value) : null;
      if (jsonValue == null) {
        console.log("No Songs Found!");
      } else {
        console.log("Got SongList!");
        setcurrentLibrary(jsonValue);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const storeData = async (newList) => {
    try {
      console.log("Storing Updated JSON");
      const jsonValue = JSON.stringify(newList);
      await AsyncStorage.setItem("testSongs", jsonValue).then(
        console.log("Done!")
      );
    } catch (e) {
      console.log(e);
    }
  };

  const storeLyricsData = async (inputLyricsData, key) => {
    try {
      await AsyncStorage.setItem(key, inputLyricsData).then(
        console.log("Done!")
      );
    } catch (e) {
      console.log(e);
    }
  };

  const editORDownload = () => {
    if (downloadIcon == "pencil") {
      seteditable(true);
      setdownloadIcon("floppy-o");
      setdownloadtext("Save");
      setediting(true);
      getSongListData();
    } else if (downloadIcon == "floppy-o") {
      setdownloadtext("Saving");
      uploadEditSong();
      seteditable(false);
      setdownloadIcon("pencil");
      setdownloadtext("Edit");
      setediting(false);
    } else {
      let newDownIcon = downloadIcon == "download" ? "pencil" : "download";
      setdownloadIcon(newDownIcon);
    }
  };

  const cancelEdit = () => {
    setediting(false);
    seteditable(false);
    setdownloadIcon("pencil");
    setdownloadtext("Edit");
  };

  const toggleLyrics = (value) => {
    if (value == true) {
      setdisplayLyrics(true);
      setIsON(true);
    } else if (value == false) {
      setdisplayLyrics(false);
      setIsON(false);
    }
  };

  const uploadEditSong = () => {
    const Sheet = outputSong;
    let song;
    if (chordFormat == 0) {
      const parser = new ChordSheetJS.ChordSheetParser();
      song = parser.parse(Sheet);
    } else {
      const parser = new ChordSheetJS.ChordProParser();
      song = parser.parse(Sheet);
    }
    const formatter = new ChordSheetJS.ChordProFormatter();
    const chordSheet = formatter.format(song);

    const textformatter = new ChordSheetJS.TextFormatter();
    const updateChordSheet = textformatter.format(song);
    setOutputSong(updateChordSheet);

    let curr_library = currentLibrary;
    let newLib = curr_library.filter((entity) => {
      return !entity.id.match(route.params.item.id);
    });

    let type = hasChords == true ? "chords" : "lyrics";
    let storeType = isOnline == true ? "online" : "user_local";
    let starting = songName.substring(0, 1).toUpperCase();
    let updatedSong = {
      id: route.params.item.id,
      song_name: songName,
      artist: songArtist,
      type: type,
      storageType: storeType,
      chord: inputChord,
      song_lyric: route.params.item.song_lyric,
      starting: starting,
    };

    newLib.unshift(updatedSong);
    console.log(newLib);
    storeLyricsData(chordSheet, route.params.item.song_lyric);
    storeData(newLib);
    Toast.show("Updated " + songName + " to Library!", Toast.LONG);
    navigation.setParams({
      name: songName,
      lyrics: route.params.item.song_lyric,
      item: updatedSong,
    });
  };

  //Chord JS Implementation

  const processChord = (item, processor) => {
    if (item instanceof ChordSheetJS.ChordLyricsPair && item.chords) {
      const parsedChord = Chord.parse(item.chords);

      if (parsedChord) {
        const processedChordLyricsPair = item.clone();
        processedChordLyricsPair.chords = processor(parsedChord).toString();
        return processedChordLyricsPair;
      }
    }

    return item;
  };

  const transformSong = (song, processor) => {
    const processedSong = song.clone();

    processedSong.lines = song.lines.map((line) => {
      const processedLine = line.clone();
      processedLine.items = line.items.map((item) =>
        processChord(item, processor)
      );
      return processedLine;
    });
    return processedSong;
  };

  const transformChordSheet = (chordSheet, processor) => {
    const song = new ChordSheetJS.ChordSheetParser().parse(chordSheet);
    const processedSong = transformSong(song, processor);
    const finalSong = new ChordSheetJS.ChordProFormatter().format(
      processedSong
    );
    const parser = new ChordSheetJS.ChordProParser();
    const newsong = parser.parse(finalSong);
    const formatter = new ChordSheetJS.TextFormatter();
    const disp = formatter.format(newsong);
    setOutputSong(disp);
  };

  const transposeUp = (chordSheet) => {
    var chord = Chord.parse(currentChord),
      chord2 = chord.transposeUp();
    setcurrentChord(chord2.toString());
    transformChordSheet(chordSheet, (chord) => chord.transposeUp());
  };

  const transposeDown = (chordSheet) => {
    var chord = Chord.parse(currentChord),
      chord2 = chord.transposeDown();
    setcurrentChord(chord2.toString());
    transformChordSheet(chordSheet, (chord) => chord.transposeDown());
  };

  const switchToSharp = (chordSheet) =>
    transformChordSheet(chordSheet, (chord) => chord.useModifier("#"));

  const switchToFlat = (chordSheet) =>
    transformChordSheet(chordSheet, (chord) => chord.useModifier("b"));

  // End ChordJS Implementation

  //Chord Format Edit
  const switchChordType = (index) => {
    if (index == 0) {
      if (chordFormat != 0) {
        const parser = new ChordSheetJS.ChordProParser();
        const song = parser.parse(outputSong);
        const formatter = new ChordSheetJS.TextFormatter();
        const disp = formatter.format(song);
        setOutputSong(disp);
      }
      setChordFormat(0);
    } else {
      if (chordFormat != 1) {
        const parser = new ChordSheetJS.ChordSheetParser();
        const song = parser.parse(outputSong);
        const formatter = new ChordSheetJS.ChordProFormatter();
        const disp = formatter.format(song);
        setOutputSong(disp);
      }
      setChordFormat(1);
    }
  };

  //Full Screen View
  const _onLongPress = () => {
    setFullScreenState(!fullScreenState);
    Vibration.vibrate(100, true);
    console.log(fullScreenState);
  };

  //Left and Right For Playlist
  const playlistPrevious = () => {
    let index = playlistIndex;
    index--;
    let nextItem;
    if (index < 0) {
      Toast.show("Reached Beginning of Playlist", Toast.LONG);
    } else {
      playList.map((item, i) => {
        if (i == index) {
          console.log(item.song_name);
          nextItem = item;
        }
      });
      console.log(nextItem);
      navigation.setParams({
        name: nextItem.song_name,
        lyrics: nextItem.song_lyric,
        item: nextItem,
        playList: playList,
        playlistIndex: index,
        option: "view",
        isplayList: true,
      });
      setplaylistIndex(index);
      setedited(!edited);
    }
  };

  const playlistNext = () => {
    let index = playlistIndex;
    index++;
    const size = playList.length;
    let nextItem;
    if (index == size) {
      Toast.show("Reached End of Playlist", Toast.LONG);
    } else {
      playList.map((item, i) => {
        if (i == index) {
          console.log(item.song_name);
          nextItem = item;
        }
      });
      navigation.setParams({
        name: nextItem.song_name,
        lyrics: nextItem.song_lyric,
        item: nextItem,
        playList: playList,
        playlistIndex: index,
        option: "view",
        isplayList: true,
      });
      setedited(!edited);
      setplaylistIndex(index);
    }
  };

  return (
    <View
      style={{ flex: 1, alignItems: "stretch", justifyContent: "flex-start" }}
    >
      {!fullScreenState && (
        <View
          style={{
            height: 60,
            justifyContent: "center",
            backgroundColor: "#fbfbfb",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <View style={{ flex: 1, paddingHorizontal: 5 }}>
            <Icon
              raised
              name="search-plus"
              type="font-awesome"
              size={22}
              color="#f50"
              onPress={onZoomIn}
            />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 5 }}>
            <Icon
              raised
              name="search-minus"
              type="font-awesome"
              color="#f50"
              size={22}
              onPress={onZoomOut}
            />
          </View>
          {displayLyrics && (
            <View style={{ flex: 3, flexDirection: "row" }}>
              <View style={{ flex: 1, paddingHorizontal: 5 }}>
                <Icon
                  raised
                  name="arrow-circle-o-up"
                  type="font-awesome"
                  color="#f50"
                  size={22}
                  onPress={() => transposeUp(outputSong)}
                />
              </View>
              <View style={{ flex: 1, marginRight: -15, paddingVertical: 5 }}>
                <Avatar
                  raised
                  rounded
                  title={currentChord}
                  size="medium"
                  activeOpacity={1.0}
                  titleStyle={{ color: "#f50" }}
                  containerStyle={{
                    borderColor: "#f50",
                  }}
                />
              </View>
              <View style={{ flex: 1, paddingHorizontal: 5 }}>
                <Icon
                  raised
                  name="arrow-circle-o-down"
                  type="font-awesome"
                  color="#f50"
                  size={22}
                  onPress={() => transposeDown(outputSong)}
                />
              </View>
            </View>
          )}
          <View
            style={[styles.codeHighlightContainer, styles.navigationFilename]}
          >
            <Text>Chords</Text>
            <Switch
              onValueChange={toggleLyrics}
              value={isON}
              trackColor={{ true: "#808080", false: "#D3D3D3" }}
              thumbColor="#f50"
            />
          </View>
        </View>
      )}
      <ScrollView style={{ flex: 0 }}>
        {editing && (
          <Card containerStyle={{ padding: 2, margin: 5 }}>
            <Input
              value={songName}
              placeholder="Song Name "
              onChangeText={(value) => setSongName(value)}
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
                  flex: 3,
                }}
              >
                <Input
                  placeholder="Artist/Band"
                  value={songArtist}
                  onChangeText={(value) => setSongArtist(value)}
                />
              </View>

              {Platform.OS == "android" && (
                <Picker
                  selectedValue={inputChord}
                  style={{ height: 50, width: 100, flex: 1, borderWidth: 1 }}
                  onValueChange={(value) => setinputChord(value)}
                >
                  <Picker.Item label="C" value="C" />
                  <Picker.Item label="C#" value="C#" />
                  <Picker.Item label="D" value="D" />
                  <Picker.Item label="D#" value="D#" />
                  <Picker.Item label="E" value="E" />
                  <Picker.Item label="F" value="F" />
                  <Picker.Item label="F#" value="F#" />
                  <Picker.Item label="G" value="G" />
                  <Picker.Item label="G#" value="G#" />
                  <Picker.Item label="A" value="A" />
                  <Picker.Item label="A#" value="A#" />
                  <Picker.Item label="B" value="B" />
                  <Picker.Item label="B#" value="B#" />
                </Picker>
              )}
              {Platform.OS == "ios" && (
                <RNPickerSelect
                  placeholder={placeholder}
                  selectedValue={inputChord}
                  style={
                    ({ height: 50, width: 200, flex: 2 }, pickerSelectStyles)
                  }
                  onValueChange={(value) => setinputChord(value)}
                  items={[
                    { label: "C", value: "C" },
                    { label: "C#", value: "C#" },
                    { label: "D", value: "D" },
                    { label: "D#", value: "D#" },
                    { label: "E", value: "E" },
                    { label: "F", value: "F" },
                    { label: "F#", value: "F#" },
                    { label: "G", value: "G" },
                    { label: "G#", value: "G#" },
                    { label: "A", value: "A" },
                    { label: "A#", value: "A#" },
                    { label: "B", value: "B" },
                    { label: "B#", value: "B#" },
                  ]}
                />
              )}
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "stretch",
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <CheckBox
                style={{
                  flex: 1,
                  margin: 0,
                }}
                title="Add to Online SongBook"
                checked={isOnline}
                onPress={() => setIsOnline(!isOnline)}
              />
              <CheckBox
                style={{
                  flex: 1,
                  display: "inline",
                }}
                title="Chords"
                checked={hasChords}
                onPress={() => sethasChords(!hasChords)}
              />
            </View>
            <View>
              {hasChords && (
                <ButtonGroup
                  onPress={(index) => switchChordType(index)}
                  selectedIndex={chordFormat}
                  underlayColor="tomato"
                  buttons={["Chord Over Lyrics", "ChordPro"]}
                  containerStyle={{ height: 30 }}
                />
              )}
            </View>
          </Card>
        )}
        <TouchableWithoutFeedback onLongPress={_onLongPress}>
          <KeyboardAvoidingView>
            <TextInput
              style={{
                marginTop: 10,
                borderWidth: 0,
                fontSize: Number(lyricsFontSize),
              }}
              textAlign={editing ? "left" : "center"}
              onChangeText={(text) => setOutputSong(text)}
              value={outputSong}
              multiline={true}
              editable={editable}
            />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
      {!fullScreenState && (
        <View style={styles.tabBarInfoContainer}>
          <View
            style={
              ([styles.codeHighlightContainer, styles.navigationFilename],
              { paddingRight: 20 })
            }
          >
            <Icon
              name={favoriteIcon}
              type="font-awesome"
              color="#f50"
              size={22}
              onPress={addToFavorites}
            />
            <Text>Favorites</Text>
          </View>
          <View
            style={
              ([styles.codeHighlightContainer, styles.navigationFilename],
              { paddingRight: 10 })
            }
          >
            <Icon
              name={addtoPlayListIcon}
              type="font-awesome"
              color="#f50"
              size={22}
              onPress={addToPlayList}
            />
            <Text>Setlist</Text>
          </View>
          <View
            style={[styles.codeHighlightContainer, styles.navigationFilename]}
          >
            <Icon
              name={downloadIcon}
              type="font-awesome"
              color="#f50"
              size={22}
              onPress={editORDownload}
            />
            <Text>{downloadtext}</Text>
          </View>
          {editing && (
            <View
              style={[styles.codeHighlightContainer, styles.navigationFilename]}
            >
              <Icon
                name="ban"
                type="font-awesome"
                color="#f50"
                size={22}
                onPress={cancelEdit}
              />
              <Text>Cancel</Text>
            </View>
          )}
          <View
            style={[styles.codeHighlightContainer, styles.navigationFilename]}
          >
            <StayAwakePicker />
            <Text>Stay Awake</Text>
          </View>
        </View>
      )}
      {isplayList && (
        <View style={{ position: "absolute", left: 2, bottom: 100 }}>
          <Icon
            raised
            name="chevron-left"
            type="font-awesome"
            size={22}
            color="#f50"
            onPress={playlistPrevious}
          />
        </View>
      )}
      {isplayList && (
        <View style={{ position: "absolute", right: 2, bottom: 100 }}>
          <Icon
            raised
            name="chevron-right"
            type="font-awesome"
            size={22}
            color="#f50"
            onPress={playlistNext}
          />
        </View>
      )}
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "black", // to ensure the text is never behind the icon
  },
});

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

export default SongView;
