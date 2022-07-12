import { Processor, RequestedAction } from '../types'
import { canMoveDown, canMoveLeft, canMoveLeftDown, canMoveRight, canMoveRightDown } from '../utils/canMove'

export const waterProcessor: Processor = (state, point) => {
  if (
    canMoveDown(state, point)
  ) {
    return RequestedAction.MoveDown
  }

  const availableActionsFirstPriority = [
    canMoveLeftDown(state, point) && RequestedAction.MoveLeftDown,
    canMoveRightDown(state, point) && RequestedAction.MoveRightDown,
  ].filter(Boolean) as RequestedAction[]

  if (availableActionsFirstPriority.length > 0) {
    return availableActionsFirstPriority[Math.floor(Math.random() * availableActionsFirstPriority.length)]
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
