import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

const Card = ({ card, playable, onPress, style, isRed }) => {
  if (!card?.suit || !card?.rank) return null;
  return (
    <TouchableOpacity style={style} onPress={onPress} disabled={!playable}>
      {/* Top-left rank and suit */}
      <View
        style={{
          position: "absolute",
          top: 4,
          left: 6,
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            lineHeight: 16,
            color: isRed ? "red" : "#222",
          }}
        >
          {card.rank}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            lineHeight: 16,
            color: isRed ? "red" : "#222",
          }}
        >
          {card.suit}
        </Text>
      </View>
      {/* Center suit */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: isRed ? "red" : "#222",
          }}
        >
          {card.suit}
        </Text>
      </View>
      {/* Bottom-right rank and suit, rotated */}
      <View
        style={{
          position: "absolute",
          bottom: 4,
          right: 6,
          alignItems: "flex-end",
          transform: [{ rotate: "180deg" }],
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            lineHeight: 16,
            color: isRed ? "red" : "#222",
          }}
        >
          {card.rank}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            lineHeight: 16,
            color: isRed ? "red" : "#222",
          }}
        >
          {card.suit}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
