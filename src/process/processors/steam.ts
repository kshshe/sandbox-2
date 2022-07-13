import { Processor, RequestedAction } from '../types'
import { canMoveUp, canMoveLeft, canMoveLeftUp, canMoveRight, canMoveRightUp } from '../utils/canMove'

export const steamProcessor: Processor = (state, point) => {
  if (point.temperature < 18) {
    return RequestedAction.Freeze
  }
  
  const availableActionsFirstPriority = [
    canMoveUp(state, point) && RequestedAction.MoveUp,
    canMoveLeftUp(state, point) && RequestedAction.MoveLeftUp,
    canMoveRightUp(state, point) && RequestedAction.MoveRightUp,
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
