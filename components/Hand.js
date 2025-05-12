import React from "react";
import { View, Dimensions } from "react-native";
import Card from "./Card";

const Hand = ({ hand, renderCard, style }) => {
  const screenWidth = Dimensions.get("window").width;
  const handHorizontalPadding = 24 * 2;
  const handWidth = screenWidth - handHorizontalPadding;
  const cardWidth = 75;
  const totalCards = hand.length;
  let overlap = 0;
  if (totalCards * cardWidth > handWidth) {
    overlap = cardWidth - handWidth / totalCards;
  }
  return (
    <View style={style}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 12,
        }}
      >
        {hand.map((card, idx) =>
          renderCard(card, idx, overlap, idx === 0 ? 12 : 0)
        )}
      </View>
    </View>
  );
};

export default Hand;
