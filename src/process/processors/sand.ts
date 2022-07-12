import { Processor, RequestedAction } from '../types'
import { canMoveDown } from '../utils/canMove'

export const sandProcessor: Processor = (state, point) => {
  if (point.temperature > 120) {
    return RequestedAction.Melt
  }
  if (canMoveDown(state, point)) {
    return RequestedAction.MoveDown
  }
  return RequestedAction.None
}
