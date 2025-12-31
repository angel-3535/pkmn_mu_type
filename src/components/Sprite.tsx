import { motion } from "motion/react";

export function PokemonSprite({
  dexId,
  className,
  layoutId,
}: {
  dexId: number;
  className?: string;
  layoutId?: string;
}) {
  return (
    <motion.img
      layoutId={layoutId}
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`}
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
