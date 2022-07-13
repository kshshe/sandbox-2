import { Processor, RequestedAction } from '../types'
import {
  canMoveDown,
  canMoveLeft,
  canMoveLeftDown,
  canMoveRight,
  canMoveRightDown,
} from '../utils/canMove'
import {
  findNeighbours,
  NEIGHBOUR_DIRECTIONS_EQUAL,
  NEIGHBOUR_DIRECTIONS_TOP_SIDE,
} from '../utils/findNeighbours'

export const waterProcessor: Processor = (state, point) => {
  if (point.temperature < 0) {
    return RequestedAction.Freeze
  }
  if (point.temperature > 20) {
    return RequestedAction.Melt
  }

  const neighbors = findNeighbours(state, point, [
    ...NEIGHBOUR_DIRECTIONS_TOP_SIDE,
    ...NEIGHBOUR_DIRECTIONS_EQUAL,
  ]).filter((neighbor) => neighbor.type !== point.type)
  const shouldStickToTheLeft = neighbors.some((neighbor) =>
    neighbor.coordinate.x < point.coordinate.x)
  const shouldStickToTheRight = neighbors.some((neighbor) =>  
    neighbor.coordinate.x > point.coordinate.x)

  if (shouldStickToTheLeft || shouldStickToTheRight) {
    const availableActions = [
      shouldStickToTheLeft && canMoveLeftDown(state, point) && RequestedAction.MoveLeftDown,
      shouldStickToTheRight && canMoveRightDown(state, point) && RequestedAction.MoveRightDown,
    ].filter(Boolean) as RequestedAction[]
    if (availableActions.length > 0) {
      return availableActions[
        Math.floor(Math.random() * availableActions.length)
      ]
    }
  }

  if (canMoveDown(state, point)) {
    return RequestedAction.MoveDown
  }

  const availableActionsFirstPriority = [
    canMoveLeftDown(state, point) && RequestedAction.MoveLeftDown,
    canMoveRightDown(state, point) && RequestedAction.MoveRightDown,
  ].filter(Boolean) as RequestedAction[]

  if (availableActionsFirstPriority.length > 0) {
    return availableActionsFirstPriority[
      Math.floor(Math.random() * availableActionsFirstPriority.length)
    ]
  }

  const availableActions = [
    canMoveLeft(state, point) && RequestedAction.MoveLeft,
    canMoveRight(state, point) && RequestedAction.MoveRight,
  ].filter(Boolean) as RequestedAction[]

  if (availableActions.length > 0) {
    return availableActions[Math.floor(Math.random() * availableActions.length)]
  }

  return RequestedAction.None
}
