import React, { useState } from "react";
import { View, Switch } from "react-native";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import Toast from "react-native-tiny-toast";

function StayAwakePicker(props) {
  const [isON, setIsON] = useState(false);

  changeWakeSetting = (value) => {
    if (value == true) {
      activateKeepAwake();
      setIsON(true);
      Toast.show("Screen Will Stay Awake", Toast.SHORT);
    } else if (value == false) {
      deactivateKeepAwake();
      setIsON(false);
      Toast.show("Screen Will Not Stay Awake", Toast.SHORT);
    }
  };
  return (
    <View style={{ marginRight: 20 }}>
      <Switch
        onValueChange={changeWakeSetting}
        value={isON}
        trackColor={{ true: "#808080", false: "#D3D3D3" }}
        thumbColor="#fff"
      />
    </View>
  );
}

export default StayAwakePicker;
