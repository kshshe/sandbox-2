import { Processor, RequestedAction } from '../types'
import {
  canMoveDown,
  canMoveLeft,
  canMoveLeftDown,
  canMoveRight,
  canMoveRightDown,
} from '../utils/canMove'
import {
  DIRECTIONS,
  findNeighbours,
} from '../utils/findNeighbours'
import {exceptType} from '../utils/exceptType'

export const waterProcessor: Processor = (state, point) => {
  if (point.temperature < 0) {
    return RequestedAction.Freeze
  }
  if (point.temperature > 80) {
    return RequestedAction.Melt
  }

  const neighborsLeft = findNeighbours(state, point, [DIRECTIONS.left, DIRECTIONS.leftUp]).filter(exceptType(point.type))
  const neighborsRight = findNeighbours(state, point, [DIRECTIONS.right, DIRECTIONS.rightUp]).filter(exceptType(point.type))

  const shouldStickToTheLeft = neighborsLeft.length !== 0
  const shouldStickToTheRight = neighborsRight.length !== 0
  
  let canMoveLeftDownResult;
  let canMoveRightDownResult;

  if (shouldStickToTheLeft || shouldStickToTheRight) {
    canMoveLeftDownResult = canMoveLeftDown(state, point)
    canMoveRightDownResult = canMoveRightDown(state, point)
    const availableActions = [
      shouldStickToTheLeft && canMoveLeftDownResult && RequestedAction.MoveLeftDown,
      shouldStickToTheRight && canMoveRightDownResult && RequestedAction.MoveRightDown,
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

  if (canMoveLeftDownResult === undefined) {
    canMoveLeftDownResult = canMoveLeftDown(state, point)
  }
  if (canMoveRightDownResult === undefined) {
    canMoveRightDownResult = canMoveRightDown(state, point)
  }

  const availableActionsFirstPriority = [
    canMoveLeftDownResult && RequestedAction.MoveLeftDown,
    canMoveRightDownResult && RequestedAction.MoveRightDown,
  ].filter(Boolean) as RequestedAction[]

  if (availableActionsFirstPriority.length > 0) {
    return availableActionsFirstPriority[
      Math.floor(Math.random() * availableActionsFirstPriority.length)
    ]
  }

  const horizontalActions = [
    canMoveLeft(state, point) && RequestedAction.MoveLeft,
    canMoveRight(state, point) && RequestedAction.MoveRight,
  ]

  if (point.lastWaterDirectionIsRight === false && horizontalActions[0]) {
    return horizontalActions[0]
  }
  if (point.lastWaterDirectionIsRight === true && horizontalActions[1]) {
    return horizontalActions[1]
  }

  const availableActions = horizontalActions.filter(Boolean) as RequestedAction[]

  if (availableActions.length > 0) {
    const selectedAction = availableActions[Math.floor(Math.random() * availableActions.length)]
    point.lastWaterDirectionIsRight = selectedAction === RequestedAction.MoveRight
    return selectedAction
  }

  return RequestedAction.None
}
