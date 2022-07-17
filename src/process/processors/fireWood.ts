import { Processor, RequestedAction } from '../types'

export const fireWoodProcessor: Processor = (state, point) => {
  if (point.age > 1000) {
    return RequestedAction.Die
  }

  return RequestedAction.None
}
