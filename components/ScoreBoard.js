import React from "react";
import { Text } from "react-native";

const ScoreBoard = ({ scores }) => (
  <Text style={{ fontSize: 16, textAlign: "center", marginVertical: 5 }}>
    Scores: P1: {scores[0]} P2: {scores[1]} P3: {scores[2]} P4: {scores[3]}
  </Text>
);

export default ScoreBoard;
