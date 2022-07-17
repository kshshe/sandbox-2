import { PointType } from './data'
import { addNewPoint } from './utils/addNewPoint'

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
  fixedHumidity: boolean
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
  pointsByCoordinate: PointData[][]
  temperaturesMap: number[][],
  humidityMap: number[][],
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
  freeBorders: boolean
  playing: boolean
}

export const DEFAULT_BASE_TEMP = 5

let gameState: null | GameState = null

const createGameState = (): GameState => {
    let currentType = (localStorage.getItem('currentType') as PointType.Sand) || PointType.Sand
    let brushSize = localStorage.getItem('brushSize') || 2
    let speed = localStorage.getItem('speed') || 1
    
    const state = {
      points: [],
      pointsByCoordinate: [],
      temperaturesMap: [],
      humidityMap: [],
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
      get speed() {
        return +speed || 1
      },
      set speed(value) {
        localStorage.setItem('speed', `${value}`)
        speed = value
      },
      temperature: DEFAULT_BASE_TEMP,
      baseTemperature: DEFAULT_BASE_TEMP,
      showTemperature: false,
      playing: true,
      freeBorders: false,
    }

    return state
}

export const restoreSavedState = () => {
  const state = getOrCreateGameState()

  const storedPoints = localStorage.getItem('points')
  if (storedPoints) {
    try {
      const parsedPoints = JSON.parse(storedPoints)
      parsedPoints.forEach((point: PointData) => {
        addNewPoint(point.coordinate, point.type)
      });
    } catch (e) {
      console.error(e)
    }
  }

  setInterval(() => {
    localStorage.setItem('points', JSON.stringify(state.points))
  }, 1000)
}

export const getOrCreateGameState = (): GameState => {
  if (!gameState) {
    gameState = createGameState()
  }
  return gameState
}
