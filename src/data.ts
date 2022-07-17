import { PointData } from './gameState'
import { listToMap } from './utils/listToMap'

export enum PointType {
  Sand = 'Sand',
  Water = 'Water',
  Ice = 'Ice',
  Fire = 'Fire',
  FireWood = 'FireWood',
  Cinder = 'Cinder',
  Wood = 'Wood',
  BFire = 'BFire',
  IceFire = 'IceFire',
  Acid = 'Acid',
  Fuel = 'Fuel',
  Tree = 'Tree',
  Steam = 'Steam',
  Lava = 'Lava',
  Stone = 'Stone',
  StaticStone = 'StaticStone',
  Concrete = 'Concrete',
  StaticGlass = 'StaticGlass',
  MeltedGlass = 'MeltedGlass',
  Hot = 'Hot',
  Cold = 'Cold',
  Void = 'Void',
  Clone = 'Clone',
  Virus = 'Virus',
  Metal = 'Metal',
  NonExistentElement = 'NonExistentElement',
}

export const VISIBLE_HUMIDITY: Partial<Record<PointType, true>> = {
  [PointType.Sand]: true,
  [PointType.Tree]: true,
  [PointType.Concrete]: true,
}

export const COLORS: Record<PointType, string> = {
  [PointType.Sand]: '#ffd800',
  [PointType.Cinder]: '#dfdfdf',
  [PointType.Water]: '#00adff',
  [PointType.Ice]: '#c9eeff',
  [PointType.Steam]: '#efefef',
  [PointType.Lava]: '#ff642e',
  [PointType.Fire]: '#ff992e',
  [PointType.FireWood]: '#ff992e',
  [PointType.Wood]: '#cf8800',
  [PointType.BFire]: '#8ddaff',
  [PointType.IceFire]: '#8ddaff',
  [PointType.Stone]: '#a7a7a7',
  [PointType.StaticStone]: '#a7a7a7',
  [PointType.Concrete]: '#f2f2f2',
  [PointType.StaticGlass]: '#f2f4ff',
  [PointType.MeltedGlass]: '#ffe6d3',
  [PointType.Fuel]: '#2eff5e',
  [PointType.Acid]: '#60ff2e',
  [PointType.Hot]: '#c53300',
  [PointType.Cold]: '#0078af',
  [PointType.Void]: '#000000',
  [PointType.Clone]: '#00a927',
  [PointType.Virus]: '#d900ff',
  [PointType.Metal]: '#e5e5e5',
  [PointType.Tree]: '#60b400',
  [PointType.NonExistentElement]: '#ffffff',
}

export const FREEZE_MAP: Partial<Record<PointType, PointType>> = {
  [PointType.Water]: PointType.Ice,
  [PointType.Steam]: PointType.Water,
  [PointType.MeltedGlass]: PointType.StaticGlass,
  [PointType.Lava]: PointType.StaticStone,
  [PointType.Concrete]: PointType.StaticStone,
  [PointType.FireWood]: PointType.Cinder,
}

export const MELT_MAP: Partial<Record<PointType, PointType>> = {
  [PointType.Ice]: PointType.Water,
  [PointType.Water]: PointType.Steam,
  [PointType.Stone]: PointType.Lava,
  [PointType.StaticStone]: PointType.Lava,
  [PointType.Sand]: PointType.MeltedGlass,
  [PointType.StaticGlass]: PointType.MeltedGlass,
  [PointType.Fuel]: PointType.Fire,
  [PointType.Tree]: PointType.Fire,
  [PointType.Wood]: PointType.FireWood,
  [PointType.Cinder]: PointType.Concrete,
}

export const POINT_INITIAL_DATA: Partial<Record<
  PointType,
  Partial<PointData>
>> = {
  [PointType.Ice]: {
    temperature: -50,
  },
  [PointType.Water]: {
    temperature: 5,
    humidity: 100,
    fixedHumidity: true,
  },
  [PointType.Steam]: {
    temperature: 95,
  },
  [PointType.Lava]: {
    temperature: 1500,
  },
  [PointType.Fire]: {
    temperature: 900,
  },
  [PointType.BFire]: {
    temperature: 2000,
  },
  [PointType.IceFire]: {
    temperature: -2000,
  },
  [PointType.Hot]: {
    temperature: 1500,
    fixedTemperature: true,
  },
  [PointType.Cold]: {
    temperature: -1500,
    fixedTemperature: true,
  },
  [PointType.Concrete]: {
    humidity: 50,
  },
  [PointType.Cinder]: {
    temperature: 50,
  }
}

export const FLUIDS = [
  PointType.Water,
  PointType.MeltedGlass,
  PointType.Steam,
  PointType.Lava,
  PointType.Fuel,
  PointType.Fire,
  PointType.BFire,
  PointType.IceFire,
  PointType.Concrete
]

export const POWDERS = [PointType.Sand, PointType.Stone, PointType.Virus]

export const IGNORE_MAP: Partial<Record<
  PointType,
  Partial<Record<PointType, true>>
>> = {
  [PointType.Steam]: listToMap([...POWDERS, ...FLUIDS]),
  [PointType.Sand]: listToMap(FLUIDS),
  [PointType.Cinder]: listToMap(FLUIDS),
  [PointType.Stone]: listToMap(FLUIDS),
  [PointType.Lava]: listToMap(FLUIDS),
  [PointType.Concrete]: listToMap(FLUIDS),
  [PointType.Water]: listToMap([PointType.Fuel]),
}

export const CONTROLLED_POINT_TYPES = [
  PointType.Sand,
  PointType.Water,
  PointType.Ice,
  PointType.Steam,
  PointType.Lava,
  PointType.Fire,
  PointType.BFire,
  PointType.IceFire,
  PointType.Fuel,
  PointType.Acid,
  PointType.Stone,
  PointType.Concrete,
  PointType.Wood,
  PointType.Metal,
  PointType.Hot,
  PointType.Cold,
  PointType.Virus,
  PointType.Void,
  PointType.Clone,
]
