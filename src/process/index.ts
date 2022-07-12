import {
  Coordinate,
  getOrCreateGameState,
  PointData,
  PointType,
} from '../gameState'
import { Processor, RequestedAction } from './types'

import { sandProcessor } from './processors/sand'
import { waterProcessor } from './processors/water'
import { redrawPoint } from '../draw'
import { getPointOnCoordinate } from '../utils/getPointOnCoordinate'

const PROCESSORS: Record<PointType, Processor> = {
  [PointType.Sand]: sandProcessor,
  [PointType.Water]: waterProcessor,
  [PointType.StaticStone]: () => RequestedAction.None,
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
