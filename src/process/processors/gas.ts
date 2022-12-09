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

export const gasMovementProcessor: Processor = (state, point) => {
  const possibleDirections = POSSIBLE_DIRECTIONS.filter(direction => direction.condition(state, point))
  
  if (possibleDirections.length > 0) {
    return possibleDirections[Math.floor(Math.random() * possibleDirections.length)].action
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
