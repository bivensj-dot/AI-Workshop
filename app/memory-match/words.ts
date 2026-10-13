// The word pairs for the Memory Match game live ONLY in this file.
// To change the game's vocabulary, edit this list. Each pair needs a unique id.
export type WordPair = {
  id: string;
  korean: string;
  english: string;
};

export const wordPairs: WordPair[] = [
  { id: "pair-1", korean: "안녕하세요", english: "Hello" },
  { id: "pair-2", korean: "감사합니다", english: "Thank you" },
  { id: "pair-3", korean: "만나서 반갑습니다", english: "Nice to meet you" },
  { id: "pair-4", korean: "잘 지내고 계신가요?", english: "How have you been?" },
  { id: "pair-5", korean: "안녕히 가세요", english: "Bye (they're leaving)" },
  { id: "pair-6", korean: "안녕히 계세요", english: "Bye (I'm leaving)" },
];
