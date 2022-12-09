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
  chance: number
}> = [
  {
    action: RequestedAction.MoveUp,
    condition: canMoveUp,
    chance: 1
  },
  {
    action: RequestedAction.MoveDown,
    condition: canMoveDown,
    chance: 5
  },
  {
    action: RequestedAction.MoveLeft,
    condition: canMoveLeft,
    chance: 1
  },
  {
    action: RequestedAction.MoveRight,
    condition: canMoveRight,
    chance: 1
  },
  {
    action: RequestedAction.MoveLeftUp,
    condition: canMoveLeftUp,
    chance: 1
  },
  {
    action: RequestedAction.MoveLeftDown,
    condition: canMoveLeftDown,
    chance: 2
  },
  {
    action: RequestedAction.MoveRightUp,
    condition: canMoveRightUp,
    chance: 1
  },
  {
    action: RequestedAction.MoveRightDown,
    condition: canMoveRightDown,
    chance: 2
  }
]

export const gasMovementProcessor: Processor = (state, point) => {
  const possibleDirections = POSSIBLE_DIRECTIONS.filter(direction => direction.condition(state, point))
  const possibleDirectionsWithChances = point.temperature < -20 ? possibleDirections.reduce((acc, direction) => {
    for (let i = 0; i < direction.chance; i++) {
      acc.push(direction)
    }
    return acc
  }, [] as typeof possibleDirections) : possibleDirections

  if (possibleDirectionsWithChances.length > 0) {
    return possibleDirectionsWithChances[Math.floor(Math.random() * possibleDirectionsWithChances.length)].action
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
  if (point.temperature < -80) {
    return RequestedAction.Freeze
  }

  return gasMovementProcessor(state, point, tick)
}
