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
import { findNeighbours } from './utils/findNeighbours'
import { getCoordinateKey } from '../utils/getCoordinateKey'
import { debug } from '../constants'
import { getColor } from '../utils/getColor'
import { FREEZE_MAP, MELT_MAP, PointType } from '../data'

const TICKS_PER_SECOND = 60

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

const applyAction = (
  state: GameState,
  action: RequestedAction,
  point: PointData,
): void => {
  const swapTo = (to: Coordinate) => {
    const pointInitialCoordinate = { ...point.coordinate }
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
      swapTo({ ...point.coordinate, y: point.coordinate.y + 1 })
      break
    case RequestedAction.MoveLeft:
      swapTo({ ...point.coordinate, x: point.coordinate.x - 1 })
      break
    case RequestedAction.MoveRight:
      swapTo({ ...point.coordinate, x: point.coordinate.x + 1 })
      break
    case RequestedAction.MoveUp:
      swapTo({ ...point.coordinate, y: point.coordinate.y - 1 })
      break
    case RequestedAction.MoveLeftDown:
      swapTo({
        ...point.coordinate,
        x: point.coordinate.x - 1,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveRightDown:
      swapTo({
        ...point.coordinate,
        x: point.coordinate.x + 1,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveLeftLeftDown:
      swapTo({
        ...point.coordinate,
        x: point.coordinate.x - 2,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveRightRightDown:
      swapTo({
        ...point.coordinate,
        x: point.coordinate.x + 2,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveRightUp:
      swapTo({
        ...point.coordinate,
        x: point.coordinate.x + 1,
        y: point.coordinate.y - 1,
      })
      break
    case RequestedAction.MoveLeftUp:
      swapTo({
        ...point.coordinate,
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
      state.temperature + (state.baseTemperature - state.temperature) / (100 / TICKS_PER_SECOND)
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

const processGameTick = (state: GameState): void => {
  const temperaturesMap: Map<PointData, number> = new Map()
  state.points.forEach((point) => {
    const pointNeighboursTemps = findNeighbours(state, point).map(
      (neighbour) => neighbour.temperature,
    )
    const tempsArray = [
      ...pointNeighboursTemps,
      state.temperature,
      point.temperature,
    ]
    const averageTemp =
      tempsArray.reduce((acc, cur) => acc + cur, 0) / tempsArray.length
    const tempDiff = averageTemp - point.temperature
    temperaturesMap.set(point, point.temperature + tempDiff / 20)
  })
  state.points.forEach((point) => {
    if (point.fixedTemperature) {
      return
    }
    point.temperature = temperaturesMap.get(point) || point.temperature
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

let tick = 0
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
