import {
  Coordinate,
  getOrCreateGameState,
  PointData,
  PointType,
} from '../gameState'
import { Processor, RequestedAction } from './types'

import { sandProcessor } from './processors/sand'
import { waterProcessor } from './processors/water'
import { iceProcessor } from './processors/ice'
import { redrawPoint } from '../draw'
import { getPointOnCoordinate } from '../utils/getPointOnCoordinate'
import { findNeighbours } from './utils/findNeighbours'

const PROCESSORS: Record<PointType, Processor> = {
  [PointType.Sand]: sandProcessor,
  [PointType.Water]: waterProcessor,
  [PointType.Ice]: iceProcessor,
  [PointType.StaticStone]: () => RequestedAction.None,
}

const FREEZE_MAP: Partial<Record<PointType, PointType>> = {
  [PointType.Water]: PointType.Ice,
}

const MELT_MAP: Partial<Record<PointType, PointType>> = {
  [PointType.Ice]: PointType.Water,
}

const applyAction = (action: RequestedAction, point: PointData): void => {
  const pointInitialCoordinate = { ...point.coordinate }
  const swapTo = (to: Coordinate) => {
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
      break
    case RequestedAction.Melt:
      point.type = MELT_MAP[point.type] || point.type
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
    default:
      break
  }
}

const processGameTick = (): void => {
  const state = getOrCreateGameState()
  const temperaturesMap: Map<PointData, number> = new Map()
  state.points.forEach((point) => {
    const pointNeighboursTemps = findNeighbours(state, point).map(
      (neighbour) => neighbour.temperature,
    )
    const tempsArray = [...pointNeighboursTemps, state.temperature, point.temperature]
    const averageTemp = tempsArray.reduce((acc, cur) => acc + cur, 0) /
    tempsArray.length
    const tempDiff = averageTemp - point.temperature
    temperaturesMap.set(point, point.temperature + tempDiff / 60)
  })
  state.points.forEach((point) => {
    point.temperature = temperaturesMap.get(point) || point.temperature
  })
  state.points.forEach((point) => {
    const odlCoordinate = { ...point.coordinate }
    const action = PROCESSORS[point.type](state, point)
    if (action === RequestedAction.None) {
      return
    }
    applyAction(action, point)
    redrawPoint(odlCoordinate)
    redrawPoint(point.coordinate)
  })
}

const TICKS_PER_SECOND = 60

export const startEngine = async () => {
  while (true) {
    const state = getOrCreateGameState()
    processGameTick()
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 / TICKS_PER_SECOND / state.speed),
    )
  }
}
