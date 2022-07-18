import {
  Coordinate,
  GameState,
  getOrCreateGameState,
  PointData,
} from '../gameState'
import { Processor, RequestedAction } from './types'

import { sandProcessor } from './processors/sand'
import { virusProcessor } from './processors/virus'
import { waterProcessor } from './processors/water'
import { steamProcessor } from './processors/steam'
import { iceProcessor } from './processors/ice'
import { lavaProcessor } from './processors/lava'
import { fireProcessor } from './processors/fire'
import { stoneProcessor } from './processors/stone'
import { meltedGlassProcessor } from './processors/meltedGlass'
import { staticGlassProcessor } from './processors/staticGlass'
import { fuelProcessor } from './processors/fuel'
import { voidProcessor } from './processors/void'
import { cloneProcessor } from './processors/clone'
import { acidProcessor } from './processors/acid'
import { treeProcessor } from './processors/tree'
import { concreteProcessor } from './processors/concrete'
import { staticStoneProcessor } from './processors/staticStone'
import { woodProcessor } from './processors/wood'
import { fireWoodProcessor } from './processors/fireWood'
import { cinderProcessor } from './processors/cinder'
import { snowProcessor } from './processors/snow'

import { drawDelayed, redrawPoint } from '../draw'
import { getPointOnCoordinate } from '../utils/getPointOnCoordinate'
import { getColor } from '../utils/getColor'
import { FREEZE_MAP, MELT_MAP, PointType } from '../data'

const TICKS_PER_SECOND = 60
const TICK_TIMES_LIMIT = 100
const tickTimes: number[] = []
let tick = 0

const PROCESSORS: Record<PointType, Processor> = {
  [PointType.Sand]: sandProcessor,
  [PointType.Water]: waterProcessor,
  [PointType.Ice]: iceProcessor,
  [PointType.Snow]: snowProcessor,
  [PointType.Steam]: steamProcessor,
  [PointType.Lava]: lavaProcessor,
  [PointType.Fire]: fireProcessor,
  [PointType.BFire]: fireProcessor,
  [PointType.IceFire]: fireProcessor,
  [PointType.Stone]: stoneProcessor,
  [PointType.StaticStone]: staticStoneProcessor,
  [PointType.MeltedGlass]: meltedGlassProcessor,
  [PointType.StaticGlass]: staticGlassProcessor,
  [PointType.Concrete]: concreteProcessor,
  [PointType.Fuel]: fuelProcessor,
  [PointType.Acid]: acidProcessor,
  [PointType.Void]: voidProcessor,
  [PointType.Clone]: cloneProcessor,
  [PointType.Virus]: virusProcessor,
  [PointType.Tree]: treeProcessor,
  [PointType.FireWood]: fireWoodProcessor,
  [PointType.Wood]: woodProcessor,
  [PointType.Cinder]: cinderProcessor,
  [PointType.Hot]: () => RequestedAction.None,
  [PointType.Cold]: () => RequestedAction.None,
  [PointType.Metal]: () => RequestedAction.None,
  [PointType.NonExistentElement]: () => RequestedAction.None,
}

const swap = (point: PointData, to: Coordinate) => {
  const pointInitialCoordinate: Coordinate = {
    x: point.coordinate.x,
    y: point.coordinate.y,
  }
  const pointThere = getPointOnCoordinate(to)
  if (pointThere) {
    pointThere.coordinate = { x: -1, y: -1 }
  }
  point.coordinate = to
  if (pointThere) {
    pointThere.coordinate = pointInitialCoordinate
  }
  redrawPoint(pointInitialCoordinate)
  redrawPoint(to)
}

const applyAction = (
  state: GameState,
  action: RequestedAction,
  point: PointData,
): void => {
  switch (action) {
    case RequestedAction.Freeze:
      point.type = FREEZE_MAP[point.type] || point.type
      if (point.type === PointType.Water) {
        point.humidity = 100
      }
      break
    case RequestedAction.Melt:
      point.type = MELT_MAP[point.type] || point.type
      if (point.type === PointType.Water) {
        point.humidity = 100
      }
      break
    case RequestedAction.MoveDown:
      swap(point, { ...point.coordinate, y: point.coordinate.y + 1 })
      break
    case RequestedAction.MoveLeft:
      swap(point, { ...point.coordinate, x: point.coordinate.x - 1 })
      break
    case RequestedAction.MoveRight:
      swap(point, { ...point.coordinate, x: point.coordinate.x + 1 })
      break
    case RequestedAction.MoveUp:
      swap(point, { ...point.coordinate, y: point.coordinate.y - 1 })
      break
    case RequestedAction.MoveLeftDown:
      swap(point, {
        x: point.coordinate.x - 1,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveRightDown:
      swap(point, {
        x: point.coordinate.x + 1,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveLeftLeftDown:
      swap(point, {
        x: point.coordinate.x - 2,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveRightRightDown:
      swap(point, {
        x: point.coordinate.x + 2,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveRightUp:
      swap(point, {
        x: point.coordinate.x + 1,
        y: point.coordinate.y - 1,
      })
      break
    case RequestedAction.MoveLeftUp:
      swap(point, {
        x: point.coordinate.x - 1,
        y: point.coordinate.y - 1,
      })
      break
    case RequestedAction.Die:
      delete state.pointsByCoordinate[point.coordinate.x][point.coordinate.y]
      state.points = state.points.filter((p) => p !== point)
      redrawPoint(point.coordinate)
      break
    default:
      break
  }
}

const processRoomTemp = (state: GameState) => {
  if (state.points.length > 0) {
    const averageTemp =
      state.points.reduce((acc, cur) => acc + cur.temperature, 0) /
      state.points.length
    state.temperature = averageTemp
  } else {
    state.temperature = state.baseTemperature
  }
}

const updateMeta = (state: GameState) => {
  const metaElement = document.querySelector('.meta')
  if (metaElement) {
    const averageTickTime =
      tickTimes.reduce((acc, cur) => acc + cur, 0) / tickTimes.length
    metaElement.innerHTML = `${state.temperature.toFixed(2)} ℃, ${
      state.points.length
    } points, ${averageTickTime.toFixed(2)} ms/tick`
  }
  const canvasElement = document.querySelector('canvas')
  if (canvasElement) {
    canvasElement.style.borderColor = getColor(
      PointType.NonExistentElement,
      state.temperature,
      0,
      true,
    )
  }
}

const TEMPERATURE_CHANGE_COEFFICIENT = TICKS_PER_SECOND * 3
const TEMPERATURE_CHANGE_COEFFICIENT_FOR_AIR = TICKS_PER_SECOND * 1

const processTemperaturesMap = (state: GameState) => {
  const temperaturesMap = state.temperaturesMap
  for (let x = 0; x < state.borders.horizontal; x++) {
    temperaturesMap[x] = temperaturesMap[x] || []
    for (let y = 0; y < state.borders.vertical; y++) {
      const point = state.pointsByCoordinate[x][y]
      let current = temperaturesMap[x][y]
      if (point) {
        current = point.temperature
      } else {
        if (current === undefined) {
          current = state.baseTemperature
        } else {
          current =
            current +
            (state.baseTemperature - current) /
              TEMPERATURE_CHANGE_COEFFICIENT_FOR_AIR
        }
      }
      if (x > 0) {
        const left = temperaturesMap[x - 1][y]
        const diff = (left - current) / TEMPERATURE_CHANGE_COEFFICIENT
        current += diff
        temperaturesMap[x - 1][y] -= diff
      }
      if (y > 0) {
        const top = temperaturesMap[x][y - 1]
        const diff = (top - current) / TEMPERATURE_CHANGE_COEFFICIENT
        current += diff
        temperaturesMap[x][y - 1] -= diff
      }
      if (x > 0 && y > 0) {
        const topLeft = temperaturesMap[x - 1][y - 1]
        const diff = (topLeft - current) / TEMPERATURE_CHANGE_COEFFICIENT
        current += diff
        temperaturesMap[x - 1][y - 1] -= diff
      }
      temperaturesMap[x][y] = current
    }
  }
  state.points.forEach(function updatePointTemperature(point) {
    if (point.fixedTemperature) {
      return
    }
    const temp = temperaturesMap[point.coordinate.x][point.coordinate.y]
    if (!isNaN(temp)) {
      point.temperature =
        temperaturesMap[point.coordinate.x][point.coordinate.y]
      if (point.type === PointType.Metal) {
        redrawPoint(point.coordinate)
      }
    }
  })
}

const HUMIDITY_CHANGE_COEFFICIENT = TICKS_PER_SECOND * 10
const HUMIDITY_CHANGE_COEFFICIENT_FOR_AIR = HUMIDITY_CHANGE_COEFFICIENT * 5

const processHumidityMap = (state: GameState) => {
  const humidityMap = state.humidityMap
  for (let x = 0; x < state.borders.horizontal; x++) {
    humidityMap[x] = humidityMap[x] || []
    for (let y = 0; y < state.borders.vertical; y++) {
      const point = state.pointsByCoordinate[x][y]
      let current = humidityMap[x][y]
      if (point) {
        current = point.humidity
      } else {
        if (current === undefined) {
          current = 0
        } else {
          current = current / HUMIDITY_CHANGE_COEFFICIENT_FOR_AIR
        }
      }
      if (x > 0) {
        const left = humidityMap[x - 1][y]
        const diff = (left - current) / HUMIDITY_CHANGE_COEFFICIENT
        current += diff
        humidityMap[x - 1][y] -= diff
      }
      if (y > 0) {
        const top = humidityMap[x][y - 1]
        const diff = (top - current) / HUMIDITY_CHANGE_COEFFICIENT
        current += diff
        humidityMap[x][y - 1] -= diff
      }
      if (x > 0 && y > 0) {
        const topLeft = humidityMap[x - 1][y - 1]
        const diff = (topLeft - current) / HUMIDITY_CHANGE_COEFFICIENT
        current += diff
        humidityMap[x - 1][y - 1] -= diff
      }
      humidityMap[x][y] = current
    }
  }
  if (state.freeBorders) {
    state.points = state.points.filter((point) => {
      const shouldStay =
        point.coordinate.x > 1 &&
        point.coordinate.y > 1 &&
        point.coordinate.x < state.borders.horizontal - 2 &&
        point.coordinate.y < state.borders.vertical - 2
      if (!shouldStay) {
        delete state.pointsByCoordinate[point.coordinate.x][point.coordinate.y]
        redrawPoint(point.coordinate)
      }
      return shouldStay
    })
  }
  state.points.forEach(function updatePointHumidity(point) {
    if (point.fixedHumidity) {
      return
    }
    const humidity = humidityMap[point.coordinate.x][point.coordinate.y]
    if (!isNaN(humidity)) {
      point.humidity = humidityMap[point.coordinate.x][point.coordinate.y]
      if ([PointType.Sand, PointType.Tree].includes(point.type)) {
        redrawPoint(point.coordinate)
      }
    }
  })
}

const processGameTick = (state: GameState): void => {
  state.points.forEach(function processPointActions(point) {
    const odlCoordinate = { ...point.coordinate }
    const action = PROCESSORS[point.type](state, point, tick)
    point.age++
    if (point.virusImmunity && point.virusImmunity > 0) {
      point.virusImmunity--
    }
    if (action === RequestedAction.None) {
      return
    }
    applyAction(state, action, point)
    redrawPoint(odlCoordinate)
    redrawPoint(point.coordinate)
  })
}

export const startEngine = async () => {
  while (true) {
    const state = getOrCreateGameState()
    if (state.playing) {
      const start = performance.now()
      if (tick % TICKS_PER_SECOND === 0) {
        processRoomTemp(state)
      }
      processTemperaturesMap(state)
      processHumidityMap(state)
      processGameTick(state)
      updateMeta(state)
      requestAnimationFrame(drawDelayed)
      tick++
      tickTimes.push(performance.now() - start)
      if (tickTimes.length > TICK_TIMES_LIMIT) {
        tickTimes.shift()
      }
    }
    const timeout = 1000 / TICKS_PER_SECOND / state.speed
    await new Promise((resolve) => setTimeout(resolve, timeout))
  }
}
