import { Processor, RequestedAction } from '../types'

export const paraffinProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 80) {
    return RequestedAction.Melt
  }
  return RequestedAction.None
}
