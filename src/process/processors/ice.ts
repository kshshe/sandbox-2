import { Processor, RequestedAction } from '../types'

export const iceProcessor: Processor = (state, point) => {
  if (point.temperature > 0) {
    return RequestedAction.Melt
  }
  return RequestedAction.None
}
