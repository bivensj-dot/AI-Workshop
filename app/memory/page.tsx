import type { Metadata } from "next";
import MemoryGame from "./MemoryGame";

export const metadata: Metadata = {
  title: "Korean Memory Game",
  description: "Flip cards to match Korean words with their English meanings.",
};

export default function MemoryPage() {
  return (
    <main className="memory">
      <h1>Korean Memory Game</h1>
      <p className="memory-intro">
        Flip two cards. If a Korean word and its English meaning go together,
        they stay face up. Match all the pairs to win.
      </p>
      <MemoryGame />
    </main>
  );
}
