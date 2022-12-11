import { Processor, RequestedAction } from '../types'
import { metalProcessor } from './metal'
import { waterProcessor } from './water'

export const liquidMetalProcessor: Processor = (state, point, tick) => {
  if (point.temperature < 660) {
    return RequestedAction.Freeze
  }

  metalProcessor(state, point, tick)
  return waterProcessor(state, {
    ...point,
    temperature: 5,
  }, tick)
}
