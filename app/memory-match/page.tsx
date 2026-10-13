"use client";

import { useEffect, useState } from "react";
import { wordPairs } from "./words";

type Card = {
  key: string; // unique per card
  pairId: string; // shared by the two cards of a pair
  text: string;
  lang: "ko" | "en";
};

function buildDeck(): Card[] {
  const cards: Card[] = wordPairs.flatMap((p) => [
    { key: `${p.id}-ko`, pairId: p.id, text: p.korean, lang: "ko" as const },
    { key: `${p.id}-en`, pairId: p.id, text: p.english, lang: "en" as const },
  ]);
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export default function MemoryMatch() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]); // card keys face up (max 2)
  const [matched, setMatched] = useState<string[]>([]); // pair ids found
  const [moves, setMoves] = useState(0);

  // Shuffle after the page loads (avoids a server/browser mismatch).
  useEffect(() => {
    setDeck(buildDeck());
  }, []);

  function restart() {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  }

  function flip(card: Card) {
    if (flipped.length === 2) return;
    if (flipped.includes(card.key) || matched.includes(card.pairId)) return;

    const next = [...flipped, card.key];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((k) => deck.find((c) => c.key === k)!);
      if (a.pairId === b.pairId) {
        setMatched((m) => [...m, a.pairId]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  }

  const won = matched.length === wordPairs.length;

  return (
    <main className="game">
      <h1>Korean Memory Match</h1>
      <p className="game-help">
        Tap two cards to find each Korean phrase and its English meaning.
      </p>
      <p className="game-stats">
        Moves: {moves} · Matched: {matched.length}/{wordPairs.length}
      </p>

      <div className="card-grid">
        {deck.map((card) => {
          const faceUp = flipped.includes(card.key) || matched.includes(card.pairId);
          return (
            <button
              key={card.key}
              type="button"
              className={`card${faceUp ? " card-up" : ""}${
                matched.includes(card.pairId) ? " card-matched" : ""
              }`}
              onClick={() => flip(card)}
              aria-label={faceUp ? card.text : "Hidden card"}
            >
              <span className="card-text" lang={card.lang}>
                {faceUp ? card.text : "?"}
              </span>
            </button>
          );
        })}
      </div>

      {won && <p className="game-win">You matched them all in {moves} moves!</p>}
      <button type="button" className="game-restart" onClick={restart}>
        New game
      </button>
    </main>
  );
}
