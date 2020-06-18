import React from "react";
import { Image } from "react-native";

function LogoTitle(props) {
  return (
    <Image
      source={require("../../assets/images/logo.png")}
      style={{ width: 50, height: 50, marginLeft: 15 }}
    />
  );
}

export default LogoTitle;
