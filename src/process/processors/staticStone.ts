import { Processor, RequestedAction } from '../types'

export const staticStoneProcessor: Processor = (state, point) => {
  if (point.temperature > 200) {
    return RequestedAction.Melt
  }
  return RequestedAction.None
}
