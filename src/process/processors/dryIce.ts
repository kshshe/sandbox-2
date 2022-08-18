import { Processor, RequestedAction } from '../types'
import { sandProcessor } from './sand'

export const dryIceProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 0) {
    return RequestedAction.Die
  }
  return sandProcessor(state, {
    ...point,
    humidity: 0,
  }, tick)
}
