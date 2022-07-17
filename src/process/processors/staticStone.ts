import { Processor, RequestedAction } from '../types'

export const staticStoneProcessor: Processor = (state, point) => {
  if (point.temperature > 1300) {
    return RequestedAction.Melt
  }
  return RequestedAction.None
}
