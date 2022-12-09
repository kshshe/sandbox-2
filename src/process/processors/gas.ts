import { PointType, POINT_INITIAL_DATA } from '../../data'
import { addNewPoint } from '../../utils/addNewPoint'
import { Processor, RequestedAction } from '../types'
import { 
  canMoveDown, 
  canMoveUp, 
  canMoveLeft,
  canMoveRight,
  canMoveLeftDown,
  canMoveLeftUp,
  canMoveRightDown,
  canMoveRightUp,
  MoveChecker 
} from '../utils/canMove'
import { NEIGHBOUR_DIRECTIONS } from '../utils/findNeighbours'

const POSSIBLE_DIRECTIONS: Array<{
  action: RequestedAction,
  condition: MoveChecker,
}> = [
  {
    action: RequestedAction.MoveUp,
    condition: canMoveUp,
  },
  {
    action: RequestedAction.MoveDown,
    condition: canMoveDown
  },
  {
    action: RequestedAction.MoveLeft,
    condition: canMoveLeft
  },
  {
    action: RequestedAction.MoveRight,
    condition: canMoveRight
  },
  {
    action: RequestedAction.MoveLeftUp,
    condition: canMoveLeftUp
  },
  {
    action: RequestedAction.MoveLeftDown,
    condition: canMoveLeftDown
  },
  {
    action: RequestedAction.MoveRightUp,
    condition: canMoveRightUp
  },
  {
    action: RequestedAction.MoveRightDown,
    condition: canMoveRightDown
  }
]

const RETRIES_COUNT = 3

export const gasMovementProcessor: Processor = (state, point) => {
  for (let retry = 0; retry < RETRIES_COUNT; retry++) {
    const randomDirection = Math.floor(Math.random() * POSSIBLE_DIRECTIONS.length)
    const direction = POSSIBLE_DIRECTIONS[randomDirection]
    if (direction.condition(state, point)) {
      return direction.action
    }
  }

  return RequestedAction.None
}

export const gasProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 170) {
    point.fixedTemperature = true
    point.temperature = POINT_INITIAL_DATA[PointType.FireGas]?.temperature || 900
    point.age = 0
    point.cloningType = PointType.FireGas
    point.isInitialGas = true
    return RequestedAction.Melt
  }

  return gasMovementProcessor(state, point, tick)
}
