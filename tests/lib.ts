import CityBuild from '@civ-clone/core-city-build/CityBuild';

/** An instance of `Type` without running its constructor, with `extra` laid over it. */
export const instanceOf = <T>(
  Type: abstract new (...args: any[]) => T,
  extra: object = {}
): T => Object.assign(Object.create(Type.prototype), extra);

/** A city's build of `Item` with `remaining` shields to find and `progress` already in the box. */
export const building = (
  city: unknown,
  Item: unknown,
  remaining: number,
  progress: number
): CityBuild =>
  instanceOf(CityBuild, {
    building: () => ({ item: () => Item }),
    city: () => city,
    progress: () => ({ value: () => progress }),
    remaining: () => remaining,
  });
