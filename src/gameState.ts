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

const createGameState = (): GameState => {
    let currentType = (localStorage.getItem('currentType') as PointType.Sand) || PointType.Sand
    let brushSize = localStorage.getItem('brushSize') || 2
    
    return {
      points: [],
      pointsByCoordinate: {},
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
      temperature: 0,
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
