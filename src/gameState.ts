export type Coordinate = {
  x: number
  y: number
}

export enum PointType {
  Sand = 'Sand',
  Water = 'Water',
  Ice = 'Ice',
  Fire = 'Fire',
  BFire = 'BFire',
  IceFire = 'IceFire',
  Acid = 'Acid',
  Fuel = 'Fuel',
  Tree = 'Tree',
  Steam = 'Steam',
  Lava = 'Lava',
  Stone = 'Stone',
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

export type PointData = {
  coordinate: Coordinate
  type: PointType
  temperature: number
  humidity: number
  fixedTemperature: boolean
  age: number
  cloningType?: PointType
  transformInto?: PointType
  transformTimeout?: number
  virusImmunity?: number
  acidUsedTimes?: number
  treeGrowTimer?: number
}

export type GameState = {
  points: Array<PointData>
  pointsByCoordinate: { [key: string]: PointData }
  borders: {
    horizontal: number
    vertical: number
  }
  currentType: PointType | 'Eraser'
  brushSize: number
  speed: number
  temperature: number
  showTemperature: boolean
  playing: boolean
}

let gameState: null | GameState = null

export const getOrCreateGameState = (): GameState => {
  if (!gameState) {
    gameState = {
      points: [],
      pointsByCoordinate: {},
      borders: {
        horizontal: 0,
        vertical: 0,
      },
      currentType: PointType.Sand,
      brushSize: 2,
      speed: 1,
      temperature: 0,
      showTemperature: false,
      playing: true,
    }
  }
  return gameState
}
