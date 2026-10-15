"use client";

import { useEffect, useState } from "react";

type Pair = { id: number; korean: string; english: string };

const PAIRS: Pair[] = [
  { id: 1, korean: "안녕하세요", english: "hello" },
  { id: 2, korean: "감사합니다", english: "thank you" },
  { id: 3, korean: "물", english: "water" },
  { id: 4, korean: "학교", english: "school" },
  { id: 5, korean: "친구", english: "friend" },
  { id: 6, korean: "책", english: "book" },
  { id: 7, korean: "사랑", english: "love" },
  { id: 8, korean: "밥", english: "rice / meal" },
];

type Card = {
  key: string; // unique per card
  pairId: number; // the two cards of a pair share this
  text: string;
  lang: "ko" | "en";
};

function buildDeck(): Card[] {
  const cards: Card[] = PAIRS.flatMap((p) => [
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

export default function MemoryGame() {
  // Shuffle after the page loads in the browser, so the server and browser
  // don't disagree about the card order.
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    setDeck(buildDeck());
  }, []);

  // When two cards are face up, check them after a short pause.
  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped.map((k) => deck.find((c) => c.key === k)!);
    const timer = setTimeout(
      () => {
        if (a.pairId === b.pairId) {
          setMatched((m) => [...m, a.pairId]);
        }
        setFlipped([]);
      },
      a.pairId === b.pairId ? 400 : 900,
    );
    return () => clearTimeout(timer);
  }, [flipped, deck]);

  function flip(card: Card) {
    if (flipped.length >= 2) return;
    if (flipped.includes(card.key) || matched.includes(card.pairId)) return;
    const next = [...flipped, card.key];
    setFlipped(next);
    if (next.length === 2) setMoves((n) => n + 1);
  }

  function restart() {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  }

  const won = matched.length === PAIRS.length;

  return (
    <section>
      <div className="memory-status">
        <span>Moves: {moves}</span>
        <span>
          Matched: {matched.length} / {PAIRS.length}
        </span>
        <button type="button" onClick={restart}>
          Restart
        </button>
      </div>

      {won && (
        <p className="memory-win" role="status">
          You matched them all in {moves} moves!
        </p>
      )}

      <div className="memory-grid">
        {deck.map((card) => {
          const isMatched = matched.includes(card.pairId);
          const faceUp = isMatched || flipped.includes(card.key);
          return (
            <button
              key={card.key}
              type="button"
              className={`memory-card${faceUp ? " is-up" : ""}${isMatched ? " is-matched" : ""}`}
              onClick={() => flip(card)}
              aria-label={faceUp ? card.text : "Hidden card"}
            >
              {faceUp ? (
                <span lang={card.lang}>{card.text}</span>
              ) : (
                <span aria-hidden="true">?</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
