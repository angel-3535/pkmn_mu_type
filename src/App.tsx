import { useState } from "react";
import "./App.css";
import { PokemonSprite } from "./components/Sprite";
import { AnimatePresence, motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { getRandomType, type PokemonType } from "./utils/types";
import { getEffectiveness } from "./utils/typeDmgCalc";

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

  const handleNext = () => {
    setSprites((prev) => {
      const newKey = keyCounter;
      setKeyCounter((k) => k + 1);
      return [...prev.slice(1), { id: randomId(), key: newKey }]; // Add new sprite at the end
    });
    setAttackingType(getRandomType());
    setSelectedMultiplier(null);
  };

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
        <div className="previous-current-next">
          <AnimatePresence mode="popLayout">
            {sprites.map((sprite, index) => {
              const isCurrent = index === 1;
              return (
                <motion.div
                  key={sprite.key}
                  initial={{ x: 200, opacity: 0, scale: 0.7 }}
                  animate={{
                    x: 0,
                    opacity: isCurrent ? 1 : 0.1,
                    scale: isCurrent ? 1 : 0.7,
                  }}
                  exit={{ x: -200, opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="sprite-container"
                >
                  {isCurrent && currentTypes && (
                    <PokemonTypeDisplay types={currentTypes} />
                  )}
                  <PokemonSprite
                    dexId={sprite.id}
                    layoutId={sprite.key.toString()}
                    className="pokemon-sprite"
                  />
                  {isCurrent && (
                    <motion.div
                      className="attacking-type-container"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="attacking-type-label">
                        Attacking Type:{" "}
                      </span>
                      <PokemonTypeDisplay types={[attackingType]} />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
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

function PokemonTypeDisplay({ types }: { types: PokemonType[] }) {
  return (
    <div className="pokemon-type-container">
      <motion.span
        className={`pokemon-type ${types[0]}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {types[0]}
      </motion.span>
      {types[1] && (
        <motion.span
          className={`pokemon-type ${types[1]}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {types[1]}
        </motion.span>
      )}
    </div>
  );
}

export default App;
