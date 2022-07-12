import { Processor, RequestedAction } from '../types'
import { canMoveDown } from '../utils/canMove'

export const sandProcessor: Processor = (state, point) => {
  if (canMoveDown(state, point)) {
    return RequestedAction.MoveDown
  }
  return RequestedAction.None
}
