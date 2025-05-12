import React from "react";
import { View, Text } from "react-native";

const Trick = ({ currentTrick, renderCard }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: 16, textAlign: "center", marginVertical: 5 }}>
      Current Trick:
    </Text>
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {currentTrick.map((card, idx) => renderCard(card, idx))}
    </View>
  </View>
);

export default Trick;
