import { motion } from "motion/react";
import type { PokemonType } from "../utils/types";

export function PokemonTypeDisplay({ types }: { types: PokemonType[] }) {
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
