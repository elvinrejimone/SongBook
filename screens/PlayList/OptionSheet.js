import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import ActionSheet from "react-native-actionsheet";

class OptionSheet extends React.Component {
  showActionSheet = () => {
    this.ActionSheet.show();
  };

  render() {
    var optionArray = ["Open", "Share", "Delete", "Cancel"];
    return (
      <View>
        <Icon
          name="more-vert"
          type="material"
          color="#a9a9a9"
          size={29}
          onPress={this.showActionSheet}
        />
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={"Which one do you like ?"}
          options={optionArray}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={(index) => {
            this.props.onOptionPressed(index, this.props.currentItem);
            /* do something */
          }}
        />
      </View>
    );
  }
}

export default OptionSheet;
