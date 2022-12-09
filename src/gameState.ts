import { PointType, Tools } from './data'
import { drawDelayed } from './draw'
import store, { INITIAL_STATE } from './interface/store'
import { restorePoint } from './utils/addNewPoint'

export type Coordinate = {
  readonly x: number
  readonly y: number
}

export type PointData = {
  coordinate: Coordinate
  type: PointType
  lastProcessedTick: number
  temperature: number
  lastProcessedTemperature: number
  humidity: number
  lastProcessedHumidity: number
  fixedTemperature: boolean
  fixedHumidity: boolean
  age: number
  cloningType?: PointType
  transformInto?: PointType
  transformTimeout?: number
  acidUsedTimes?: number
  paraffinWasIgnitedTimes?: number
  toBeRemoved?: boolean
  wasInfected?: boolean
  infectedTick?: number
  lastWaterDirectionIsRight?: boolean
  isInitialGas?: boolean
}

export type GameState = {
  processQueue: Set<PointData>
  points: Array<PointData>
  pointsByCoordinate: PointData[][]
  temperaturesMap: number[][]
  humidityMap: number[][]
  borders: {
    horizontal: number
    vertical: number
  }
  currentType: Tools | PointType | 'Eraser'
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

const NOT_RESETABLE = ['showMoreSettings']

export const resetState = () => {
  Object.keys(INITIAL_STATE).forEach(key => {
    if (NOT_RESETABLE.includes(key)) {
      return
    }
    // @ts-ignore
    store.setProperty(key, INITIAL_STATE[key])
  })
  gameState = createGameState()
}

const createGameState = (): GameState => {
  let currentType =
    (localStorage.getItem('currentType') as PointType.Sand) || PointType.Sand
  let brushSize = localStorage.getItem('brushSize') || 2
  store.setProperty('brushSize', +brushSize)
  let speed = localStorage.getItem('speed') || 6
  store.setProperty('speed', +speed)
  let baseTemperature = localStorage.getItem('baseTemperature') || 5
  store.setProperty('baseTemperature', +baseTemperature)

  const state = {
    processQueue: new Set(),
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
      return store.brushSize
    },
    set brushSize(value) {
      store.setProperty('brushSize', +value)
    },
    get speed() {
      return store.speed
    },
    set speed(value) {
      store.setProperty('speed', +value)
    },
    temperature: DEFAULT_BASE_TEMP,
    get baseTemperature() {
      return store.baseTemperature
    },
    set baseTemperature(value) {
      store.setProperty('baseTemperature', value)
    },
    get showTemperature() {
      return store.showTemperature
    },
    set showTemperature(value) {
      store.setProperty('showTemperature', value)
    },
    get playing() {
      return !store.pause
    },
    set playing(value) {
      store.setProperty('pause', !value)
    },
    get freeBorders() {
      return store.freeBorders
    },
    set freeBorders(value) {
      store.setProperty('freeBorders', value)
    },
  }

  return state
}

export const restoreSavedState = () => {
  const storedPoints = localStorage.getItem('points')
  if (storedPoints) {
    try {
      const parsedPoints = JSON.parse(storedPoints)
      parsedPoints.forEach((point: PointData) => {
        if (!point.toBeRemoved) {
          restorePoint(point)
        }
      })
      drawDelayed()
    } catch (e) {
      console.error(e)
    }
  }

  setInterval(() => {
    const state = getOrCreateGameState()
    try {
      localStorage.setItem('points', JSON.stringify(state.points))
    } catch (e) {
      console.error(e)
    }
  }, 5000)
}

export const getOrCreateGameState = (): GameState => {
  if (!gameState) {
    gameState = createGameState()
  }
  return gameState
}
