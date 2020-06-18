import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Platform,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import Toast from "react-native-tiny-toast";
import AsyncStorage from "@react-native-community/async-storage";
import { Card, Input, CheckBox } from "react-native-elements";
import ChordSheetJS from "chordsheetjs";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-community/picker";
import RNPickerSelect from "react-native-picker-select";

function AddSong({ route, navigation }) {
  const [songName, setSongName] = useState("");
  const [currentLibrary, setcurrentLibrary] = useState([]);
  const [songArtist, setSongArtist] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [hasChords, sethasChords] = useState(false);
  const [inputLyrics, setInputLyrics] = useState("");
  const [inputChord, setinputChord] = useState("G");
  const [isFirst, setisFirst] = useState(true);
  const [MAX_IDVAL, setMAX_IDVAL] = useState("4");

  useEffect(() => {
    if (isFirst) {
      getMaxID();
      getData();
      setisFirst(false);
    }
  });
  const placeholder = {
    label: "Chord",
    value: "G",
    color: "#9EA0A4",
  };

  const storeMaxNumberData = async (MAX) => {
    try {
      console.log("Inside Store Data Value ::" + MAX);
      await AsyncStorage.setItem("MAX_ID_VALUE", MAX).then(getMaxID());
    } catch (e) {
      console.log(e);
    }
  };

  const getMaxID = async () => {
    try {
      const value = await AsyncStorage.getItem("MAX_ID_VALUE");
      if (value == null) {
        console.log("Preparing to Store Value!");
        storeMaxNumberData(MAX_IDVAL);
      } else {
        console.log("MAX_ID :::" + value);
        setMAX_IDVAL(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("testSongs");
      let jsonValue = value != null ? JSON.parse(value) : null;
      if (jsonValue == null) {
        console.log("No Songs Found!");
      } else {
        console.log("Got Value!");
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

  const addSongPressed = () => {
    const chordSheet = inputLyrics;
    let curr_library = currentLibrary;
    let max_id = parseInt(MAX_IDVAL);
    max_id = max_id + 1;
    setMAX_IDVAL(max_id.toString());
    let song_id = "userLocal" + max_id.toString();
    let song_lyric_key = "test" + songName.substring(0, 4) + max_id.toString();
    let type = hasChords == true ? "chords" : "lyrics";
    let storeType = isOnline ? "online" : "user_local";
    let starting = songName.substring(0, 1).toUpperCase();
    let newSong = {
      id: song_id,
      song_name: songName,
      artist: songArtist,
      type: type,
      storageType: storeType,
      chord: inputChord,
      song_lyric: song_lyric_key,
      starting: starting,
    };
    console.log(newSong);
    curr_library.push(newSong);
    storeMaxNumberData(max_id.toString());
    storeLyricsData(chordSheet, song_lyric_key);
    storeData(curr_library);
    Toast.show("Added " + songName + " to Library!", Toast.LONG);
    navigation.navigate("SongBook");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "stretch", justifyContent: "flex-start" }}
    >
      <ScrollView>
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
        </Card>

        <Card containerStyle={{ padding: 2, margin: 5 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <TextInput
              placeholder="Add the Lyrics/Lyrics with Chords Here..."
              style={styles.song_Input}
              value={inputLyrics}
              onChangeText={(text) => setInputLyrics(text)}
              multiline={true}
              textAlignVertical="top"
              underlineColorAndroid="transparent"
            />
          </KeyboardAvoidingView>
        </Card>
      </ScrollView>
      <Card
        containerStyle={{ padding: 2, margin: 5, backgroundColor: "tomato" }}
      >
        <Button color="tomato" onPress={addSongPressed} title="Add Song" />
      </Card>
    </SafeAreaView>
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
  song_Input: {
    height: 400,
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

export default AddSong;
