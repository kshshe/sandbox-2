import { Processor, RequestedAction } from '../types'
import { canMoveDown } from '../utils/canMove'

export const sandProcessor: Processor = (state, point) => {
  const canMoveResult = canMoveDown(state, point)
  if (canMoveResult) {
    if (typeof canMoveResult === 'function') {
      canMoveResult()
    }
    return RequestedAction.MoveDown
  }
  return RequestedAction.None
}
