//CSS
import "./App.css";

//React
import { useCallback, useEffect, useState } from "react";

//Data

import { wordsList } from "./data/words";

//Components
import StartScreen from "./shared/components/StartScreen";
import Game from "./shared/components/Game";
import GameOver from "./shared/components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStarge, setGameStarge] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickeCategory, setPickeCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLeters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = () => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  };

  //starts
  const startGame = () => {
    clearLetterStats();

    const { word, category } = pickWordAndCategory();
    let wordLetters = word.toLowerCase().split("");

    setPickeCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStarge(stages[1].name);
  };

  // processamento das palavras

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    )
      return;

    if (letters.includes(normalizedLetter)) {
      setGuessedLeters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  // restart

  const retry = () => {
    setScore(0);
    setGuesses(3);

    setGameStarge(stages[0].name);
  };

  const clearLetterStats = () => {
    setGuessedLeters([]);
    setWrongLetters([]);
  };

  useEffect(() => {
    if (guesses <= 0) {
      // reset all startes
      clearLetterStats();

      setGameStarge(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 100));

      startGame();
    }
  }, [guessedLetters, startGame, letters]);

  return (
    <div className="App">
      {gameStarge === "start" && <StartScreen startGame={startGame} />}
      {gameStarge === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickeCategory={pickeCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStarge === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
