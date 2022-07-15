import { PointType } from './data'

export type Coordinate = {
  readonly x: number
  readonly y: number
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
  temperaturesMap: number[][],
  borders: {
    horizontal: number
    vertical: number
  }
  currentType: PointType | 'Eraser'
  brushSize: number
  speed: number
  temperature: number
  baseTemperature: number
  showTemperature: boolean
  playing: boolean
}

export const DEFAULT_BASE_TEMP = 5

let gameState: null | GameState = null

const createGameState = (): GameState => {
    let currentType = (localStorage.getItem('currentType') as PointType.Sand) || PointType.Sand
    let brushSize = localStorage.getItem('brushSize') || 2
    
    return {
      points: [],
      pointsByCoordinate: {},
      temperaturesMap: [],
      borders: {
        horizontal: 0,
        vertical: 0,
      },
      get currentType() {
        return currentType
      },
      set currentType(value) {
        localStorage.setItem('currentType', value)
        currentType = value
      },
      get brushSize() {
        return +brushSize || 2
      },
      set brushSize(value) {
        localStorage.setItem('brushSize', `${value}`)
        brushSize = value
      },
      speed: 1,
      temperature: DEFAULT_BASE_TEMP,
      baseTemperature: DEFAULT_BASE_TEMP,
      showTemperature: false,
      playing: true,
    }
}

export const getOrCreateGameState = (): GameState => {
  if (!gameState) {
    gameState = createGameState()
  }
  return gameState
}
