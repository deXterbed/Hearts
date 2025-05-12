import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const suits = ["♠", "♥", "♣", "♦"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

const generateDeck = () => {
  const deck = [];
  suits.forEach((suit) => ranks.forEach((rank) => deck.push({ suit, rank })));
  return deck.sort(() => Math.random() - 0.5); // Shuffle
};

const App = () => {
  const [deck, setDeck] = useState(generateDeck());
  const [hands, setHands] = useState([[], [], [], []]); // Player 0 is human
  const [currentTrick, setCurrentTrick] = useState([]);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameState, setGameState] = useState("deal");

  const screenWidth = Dimensions.get("window").width;
  const handHorizontalPadding = 24 * 2; // paddingHorizontal: 24 on each side
  const handWidth = screenWidth - handHorizontalPadding;
  const cardWidth = 60;
  const horizontalPadding = 8 * 2; // paddingHorizontal: 8 on each side
  const cardMargin = 4; // margin between cards (in px)
  const topRowCount = 7;
  const bottomRowCount = 6;
  const minCardWidth = 36;
  const cardWidthTopRaw = (screenWidth - horizontalPadding) / topRowCount;
  const cardWidthBottomRaw = (screenWidth - horizontalPadding) / bottomRowCount;
  const cardWidthTop =
    cardWidthTopRaw < minCardWidth ? minCardWidth : cardWidthTopRaw;
  const cardWidthBottom =
    cardWidthBottomRaw < minCardWidth ? minCardWidth : cardWidthBottomRaw;
  const overlapMargin =
    cardWidthTopRaw < minCardWidth ? -(minCardWidth - cardWidthTopRaw) : 0;

  // Deal cards
  useEffect(() => {
    if (gameState === "deal") {
      const newHands = [[], [], [], []];
      deck.forEach((card, index) => newHands[index % 4].push(card));
      newHands.forEach((hand) =>
        hand.sort((a, b) => suits.indexOf(a.suit) - suits.indexOf(b.suit))
      );
      setHands(newHands);
      setGameState("play");
      // Check for 2 of Clubs to start
      newHands.forEach((hand, index) => {
        if (hand.some((card) => card.rank === "2" && card.suit === "♣")) {
          setCurrentPlayer(index);
        }
      });
    }
  }, [deck, gameState]);

  // AI plays a random valid card
  const aiPlayCard = (playerIndex) => {
    const hand = hands[playerIndex];
    const leadSuit = currentTrick.length ? currentTrick[0].suit : null;
    const validCards = leadSuit
      ? hand.filter((card) => card.suit === leadSuit)
      : hand;
    const card =
      validCards[Math.floor(Math.random() * validCards.length)] || hand[0];
    playCard(card, playerIndex);
  };

  // Play a card
  const playCard = (card, playerIndex) => {
    const newHands = [...hands];
    newHands[playerIndex] = newHands[playerIndex].filter(
      (c) => c.rank !== card.rank || c.suit !== card.suit
    );
    setHands(newHands);
    setCurrentTrick([...currentTrick, { ...card, player: playerIndex }]);

    if (currentTrick.length + 1 === 4) {
      // Resolve trick
      setTimeout(() => {
        const leadSuit = currentTrick[0].suit;
        const winningCard = currentTrick.reduce((winner, curr) => {
          if (curr.suit !== leadSuit) return winner;
          return ranks.indexOf(curr.rank) > ranks.indexOf(winner.rank)
            ? curr
            : winner;
        }, currentTrick[0]);
        const winnerIndex = winningCard.player;
        let trickPoints = 0;
        currentTrick.forEach((c) => {
          if (c.suit === "♥") trickPoints += 1;
          if (c.suit === "♠" && c.rank === "Q") trickPoints += 13;
        });
        const newScores = [...scores];
        newScores[winnerIndex] += trickPoints;
        setScores(newScores);
        setCurrentTrick([]);
        setCurrentPlayer(winnerIndex);
        if (newHands.every((hand) => hand.length === 0)) {
          setGameState("gameOver");
        }
      }, 1000);
    } else {
      setCurrentPlayer((currentPlayer + 1) % 4);
    }
  };

  // Handle AI turns
  useEffect(() => {
    if (
      gameState === "play" &&
      currentPlayer !== 0 &&
      currentTrick.length < 4
    ) {
      setTimeout(() => aiPlayCard(currentPlayer), 1000);
    }
  }, [currentPlayer, gameState, currentTrick]);

  // Render a card
  const renderCard = (
    card,
    playable = false,
    playerIndex = null,
    row = "top",
    index = 0
  ) => {
    const isRed = card.suit === "♥" || card.suit === "♦";
    const totalCards = hands[0].length;
    // Calculate overlap so all cards fit in handWidth
    let overlap = 0;
    if (totalCards * cardWidth > handWidth) {
      overlap = cardWidth - handWidth / totalCards;
    }
    const marginLeft = index === 0 ? 0 : -overlap;
    return (
      <TouchableOpacity
        key={`${card.suit}-${card.rank}`}
        style={[
          styles.card,
          {
            backgroundColor: playable ? "#e0f7fa" : "#fff",
            marginLeft,
          },
          styles.realCard,
          isRed ? styles.redCard : styles.blackCard,
        ]}
        onPress={() => {
          if (playable && playerIndex === currentPlayer) {
            const leadSuit = currentTrick.length ? currentTrick[0].suit : null;
            const valid =
              !leadSuit || hands[playerIndex].some((c) => c.suit === leadSuit)
                ? card.suit === leadSuit
                : true;
            if (valid) playCard(card, playerIndex);
          }
        }}
        disabled={!playable}
      >
        {/* Top-left rank and suit */}
        <View style={styles.cardCornerTop}>
          <Text
            style={[
              styles.cornerText,
              isRed ? styles.redText : styles.blackText,
            ]}
          >
            {card.rank}
          </Text>
          <Text
            style={[
              styles.cornerText,
              isRed ? styles.redText : styles.blackText,
            ]}
          >
            {card.suit}
          </Text>
        </View>
        {/* Center suit */}
        <View style={styles.cardCenter}>
          <Text
            style={[
              styles.centerSuit,
              isRed ? styles.redText : styles.blackText,
            ]}
          >
            {card.suit}
          </Text>
        </View>
        {/* Bottom-right rank and suit, rotated */}
        <View style={styles.cardCornerBottom}>
          <Text
            style={[
              styles.cornerText,
              isRed ? styles.redText : styles.blackText,
            ]}
          >
            {card.rank}
          </Text>
          <Text
            style={[
              styles.cornerText,
              isRed ? styles.redText : styles.blackText,
            ]}
          >
            {card.suit}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Hearts</Text>
      <Text style={styles.info}>
        Scores: P1: {scores[0]} P2: {scores[1]} P3: {scores[2]} P4: {scores[3]}
      </Text>
      {gameState === "gameOver" ? (
        <View>
          <Text style={styles.info}>Game Over!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setDeck(generateDeck());
              setGameState("deal");
              setScores([0, 0, 0, 0]);
              setCurrentTrick([]);
              setCurrentPlayer(0);
            }}
          >
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.trickArea}>
            <Text style={styles.info}>Current Trick:</Text>
            <View style={styles.trick}>
              {currentTrick.map((card) => renderCard(card))}
            </View>
          </View>
          <View style={[styles.hand]}>
            <View style={styles.handRow}>
              {hands[0]
                .slice(0, topRowCount)
                .map((card, idx) =>
                  renderCard(
                    card,
                    gameState === "play" && currentPlayer === 0,
                    0,
                    "top",
                    idx
                  )
                )}
            </View>
            {hands[0].length > topRowCount && (
              <View style={[styles.handRow, styles.overlapRow]}>
                {hands[0]
                  .slice(topRowCount)
                  .map((card, idx) =>
                    renderCard(
                      card,
                      gameState === "play" && currentPlayer === 0,
                      0,
                      "bottom",
                      idx
                    )
                  )}
              </View>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  info: { fontSize: 16, textAlign: "center", marginVertical: 5 },
  trickArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  trick: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  hand: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  handRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  overlapRow: {
    marginTop: -30,
  },
  card: {
    aspectRatio: 0.75,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
    position: "relative",
    width: 70,
  },
  realCard: {
    padding: 0,
  },
  cardCornerTop: {
    position: "absolute",
    top: 4,
    left: 6,
    alignItems: "flex-start",
  },
  cardCornerBottom: {
    position: "absolute",
    bottom: 4,
    right: 6,
    alignItems: "flex-end",
    transform: [{ rotate: "180deg" }],
  },
  cardCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cornerText: {
    fontSize: 11,
    fontWeight: "bold",
    lineHeight: 16,
  },
  centerSuit: {
    fontSize: 16,
    fontWeight: "bold",
  },
  redCard: {},
  blackCard: {},
  redText: { color: "red" },
  blackText: { color: "#222" },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});

export default App;
