import { Processor, RequestedAction } from '../types'
import { waterProcessor } from './water'

export const meltedGlassProcessor: Processor = (state, point, tick) => {
  if (point.temperature < 70) {
    return RequestedAction.Freeze
  }
  return waterProcessor(state, {
    ...point, 
    temperature: 10
  }, tick)
}
