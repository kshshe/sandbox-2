export type Coordinate = {
  x: number
  y: number
}

export enum PointType {
  Sand = 'Sand',
  Water = 'Water',
}

export type PointData = {
  coordinate: Coordinate
  type: PointType
}

export type GameState = {
  points: Array<PointData>
  pointsByCoordinate: { [key: string]: PointData }
  borders: {
    horizontal: number
    vertical: number
  }
  currentType: PointType
  brushSize: number
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
      brushSize: 1,
    }
  }
  return gameState
}
