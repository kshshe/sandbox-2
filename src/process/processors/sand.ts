import { Processor, RequestedAction } from '../types'
import { canMoveDown, canMoveLeftDown, canMoveRightDown } from '../utils/canMove'

export const sandProcessor: Processor = (state, point) => {
  if (point.temperature > 120) {
    return RequestedAction.Melt
  }
  if (canMoveDown(state, point)) {
    return RequestedAction.MoveDown
  }

  const availableActionsFirstPriority = [
    canMoveLeftDown(state, point) && RequestedAction.MoveLeftDown,
    canMoveRightDown(state, point) && RequestedAction.MoveRightDown,
  ].filter(Boolean) as RequestedAction[]

  if (availableActionsFirstPriority.length > 0) {
    return availableActionsFirstPriority[Math.floor(Math.random() * availableActionsFirstPriority.length)]
  }
  
  return RequestedAction.None
}
