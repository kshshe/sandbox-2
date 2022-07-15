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

import { drawDelayed, redrawPoint } from '../draw'
import { getPointOnCoordinate } from '../utils/getPointOnCoordinate'
import { getCoordinateKey } from '../utils/getCoordinateKey'
import { debug } from '../constants'
import { getColor } from '../utils/getColor'
import { FREEZE_MAP, MELT_MAP, PointType } from '../data'

const TICKS_PER_SECOND = 60
let tick = 0

const PROCESSORS: Record<PointType, Processor> = {
  [PointType.Sand]: sandProcessor,
  [PointType.Water]: waterProcessor,
  [PointType.Ice]: iceProcessor,
  [PointType.Steam]: steamProcessor,
  [PointType.Lava]: lavaProcessor,
  [PointType.Fire]: fireProcessor,
  [PointType.BFire]: fireProcessor,
  [PointType.IceFire]: fireProcessor,
  [PointType.Stone]: stoneProcessor,
  [PointType.MeltedGlass]: meltedGlassProcessor,
  [PointType.StaticGlass]: staticGlassProcessor,
  [PointType.Fuel]: fuelProcessor,
  [PointType.Acid]: acidProcessor,
  [PointType.Void]: voidProcessor,
  [PointType.Clone]: cloneProcessor,
  [PointType.Virus]: virusProcessor,
  [PointType.Tree]: treeProcessor,
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
      delete state.pointsByCoordinate[getCoordinateKey(point.coordinate)]
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
    const diff = averageTemp - state.temperature
    state.temperature += diff / (2000 / TICKS_PER_SECOND)
    state.temperature =
      state.temperature +
      (state.baseTemperature - state.temperature) / (100 / TICKS_PER_SECOND)
  }
}

const updateMeta = (state: GameState) => {
  const metaElement = document.querySelector('.meta')
  if (metaElement) {
    metaElement.innerHTML = `${state.temperature.toFixed(2)} ℃, ${
      state.points.length
    } points`
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

const processGameTick = (state: GameState): void => {
  const temperaturesMap: number[][] = []
  for (let x = 0; x < state.borders.horizontal; x++) {
    temperaturesMap[x] = []
    for (let y = 0; y < state.borders.vertical; y++) {
      let current =
        state.pointsByCoordinate[getCoordinateKey({ x, y })]?.temperature ||
        state.temperature
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
  state.points.forEach((point) => {
    if (point.fixedTemperature) {
      return
    }
    point.temperature = temperaturesMap[point.coordinate.x][point.coordinate.y]
    if (debug || state.showTemperature || point.type === PointType.Metal) {
      redrawPoint(point.coordinate)
    }
  })
  state.points.forEach((point) => {
    const odlCoordinate = { ...point.coordinate }
    const action = PROCESSORS[point.type](state, point)
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
      if (tick % TICKS_PER_SECOND === 0) {
        processRoomTemp(state)
      }
      processGameTick(state)
      updateMeta(state)
      requestAnimationFrame(drawDelayed)
      tick++
    }
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 / TICKS_PER_SECOND / state.speed),
    )
  }
}
