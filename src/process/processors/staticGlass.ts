import { Processor, RequestedAction } from '../types'

export const staticGlassProcessor: Processor = (state, point) => {
  if (point.temperature > 120) {
    return RequestedAction.Melt
  }
  return RequestedAction.None
}
