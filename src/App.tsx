import { useState } from "react";
import "./App.css";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { getRandomType, type PokemonType } from "./utils/types";
import { getEffectiveness } from "./utils/typeDmgCalc";
import { PrevCurrentNextSprites } from "./components/PrevCurrentNextSprites";

const randomId = () => Math.floor(Math.random() * 1024) + 1;

const MULTIPLIER_OPTIONS = [0, 0.5, 1, 2, 4] as const;

function App() {
  const [sprites, setSprites] = useState<{ id: number; key: number }[]>(() => [
    { id: randomId(), key: 0 },
    { id: randomId(), key: 1 },
    { id: randomId(), key: 2 },
  ]);
  const [keyCounter, setKeyCounter] = useState<number>(3);
  const [attackingType, setAttackingType] = useState<PokemonType>(
    getRandomType()
  );
  const [selectedMultiplier, setSelectedMultiplier] = useState<number | null>(
    null
  );
  const [score, setScore] = useState<number>(0);

  const { data: currentTypes } = useQuery({
    queryKey: ["pokemon-type", sprites[1].id],
    queryFn: async () => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${sprites[1].id}`
      );
      const data = await res.json();
      const types: PokemonType[] = [data.types[0].type.name as PokemonType];
      if (data.types[1]) {
        types.push(data.types[1].type.name as PokemonType);
      }
      return types;
    },
  });

  const correctMultiplier = currentTypes
    ? getEffectiveness(attackingType, currentTypes)
    : null;

  const handleMultiplierClick = (multiplier: number) => {
    setSelectedMultiplier(multiplier);
    if (multiplier === correctMultiplier) {
      setScore((s) => s + 1);
    } else {
      setScore(0);
    }
  };

  const handleNext = () => {
    setSprites((prev) => {
      const newKey = keyCounter;
      setKeyCounter((k) => k + 1);
      return [...prev.slice(1), { id: randomId(), key: newKey }]; // Add new sprite at the end
    });
    setAttackingType(getRandomType());
    setSelectedMultiplier(null);
  };

  return (
    <>
      <div className="container">
        <div className="score-container">
          <span className="score-label">Score: </span>
          <motion.span
            key={score}
            className="score-value"
            initial={{ scale: 1.5, color: "#4ade80" }}
            animate={{ scale: 1, color: "#ede9e9" }}
            transition={{ duration: 0.3 }}
          >
            {score}
          </motion.span>
        </div>

        <PrevCurrentNextSprites
          sprites={sprites}
          currentTypes={currentTypes}
          attackingType={attackingType}
        />

        <div className="multiplier-buttons">
          {MULTIPLIER_OPTIONS.map((mult) => {
            const isSelected = selectedMultiplier === mult;
            const isCorrect = correctMultiplier === mult;
            const showCorrect = selectedMultiplier !== null && isCorrect;
            return (
              <motion.button
                key={mult}
                onClick={() => handleMultiplierClick(mult)}
                className={`multiplier-button ${isSelected ? "selected" : ""} ${
                  showCorrect ? "correct" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={selectedMultiplier !== null}
              >
                {mult === 0 ? "0x" : mult === 0.5 ? ".5x" : `${mult}x`}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={handleNext}
          className="next-button"
          whileHover={selectedMultiplier !== null ? { scale: 1.1 } : {}}
          whileTap={selectedMultiplier !== null ? { scale: 0.9 } : {}}
          disabled={selectedMultiplier === null}
        >
          Next Pokemon
        </motion.button>
      </div>
    </>
  );
}

export default App;
