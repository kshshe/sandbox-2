export type Coordinate = {
  x: number
  y: number
}

export enum PointType {
  Sand = 'Sand',
  Water = 'Water',
  Ice = 'Ice',
  Fire = 'Fire',
  Fuel = 'Fuel',
  Steam = 'Steam',
  Lava = 'Lava',
  StaticStone = 'StaticStone',
  StaticGlass = 'StaticGlass',
  MeltedGlass = 'MeltedGlass',
}

export type PointData = {
  coordinate: Coordinate
  type: PointType
  temperature: number
  age: number
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
    }
  }
  return gameState
}
