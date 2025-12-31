import type { PokemonType } from "./types";
import { typeChart } from "./typeChart";

/**
 * Returns the damage multiplier for an attacking type against a defending type.
 * Returns 1 for neutral effectiveness if not specified in the type chart.
 */
export function getDamageMultiplier(
  attackingType: PokemonType,
  defendingType: PokemonType
): number {
  return typeChart[attackingType][defendingType] ?? 1;
}

/**
 * Returns the combined damage multiplier for an attacking type against one or two defending types.
 * Multiplies individual type multipliers together.
 */
export function getEffectiveness(
  attackingType: PokemonType,
  defendingTypes: PokemonType[]
): number {
  return defendingTypes.reduce(
    (multiplier, defType) =>
      multiplier * getDamageMultiplier(attackingType, defType),
    1
  );
}
