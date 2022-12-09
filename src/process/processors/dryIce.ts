import { Processor, RequestedAction } from '../types'
import { sandProcessor } from './sand'

export const dryIceProcessor: Processor = (state, point, tick) => {
  if (point.temperature > -80) {
    return RequestedAction.Melt
  }
  return sandProcessor(state, {
    ...point,
    humidity: 0,
  }, tick)
}
