import {
  getOrCreateGameState,
  PointData,
  PointType,
} from '../gameState'
import { getCoordinateKey } from '../utils/getCoordinateKey'
import { Processor, RequestedAction } from './types'

import { sandProcessor } from './processors/sand'
import { waterProcessor } from './processors/water'

const PROCESSORS: Record<PointType, Processor> = {
  [PointType.Sand]: sandProcessor,
  [PointType.Water]: waterProcessor,
}

const applyAction = (action: RequestedAction, point: PointData): void => {
  switch (action) {
    case RequestedAction.MoveDown:
        point.coordinate.y += 1
      break
    case RequestedAction.MoveLeft:
        point.coordinate.x -= 1
      break
    case RequestedAction.MoveRight:
        point.coordinate.x += 1
      break
    case RequestedAction.MoveUp:
        point.coordinate.y -= 1
      break
    case RequestedAction.MoveLeftDown:
        point.coordinate.x -= 1
        point.coordinate.y += 1
        break
    case RequestedAction.MoveRightDown:
        point.coordinate.x += 1
        point.coordinate.y += 1
        break
    default:
      break
  }
}

const processGameTick = (): void => {
  const state = getOrCreateGameState()
  state.points.forEach((point) => {
    delete state.pointsByCoordinate[getCoordinateKey(point.coordinate)]
    const action = PROCESSORS[point.type](state, point)
    applyAction(action, point)
    state.pointsByCoordinate[getCoordinateKey(point.coordinate)] = point
  })
}

const TICKS_PER_SECOND = 60

export const startEngine = async () => {
  while (true) {
    processGameTick()
    await new Promise((resolve) => setTimeout(resolve, 1000 / TICKS_PER_SECOND))
  }
}
