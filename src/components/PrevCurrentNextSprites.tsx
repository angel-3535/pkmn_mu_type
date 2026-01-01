import { AnimatePresence, motion } from "motion/react";
import { PokemonTypeDisplay } from "./PokemonType";
import { PokemonSprite } from "./Sprite";
import type { PokemonType } from "../utils/types";

export function PrevCurrentNextSprites({
  sprites,
  currentTypes,
  attackingType,
}: {
  sprites: { id: number; key: number }[];
  currentTypes: PokemonType[] | undefined;
  attackingType: PokemonType;
}): React.ReactElement {
  return (
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
                  <span className="attacking-type-label">Attacking Type: </span>
                  <PokemonTypeDisplay types={[attackingType]} />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
