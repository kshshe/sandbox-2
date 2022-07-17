import { Processor, RequestedAction } from '../types'
import { waterProcessor } from './water'

export const fuelProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 10) {
    point.temperature = 700 * 8
    return RequestedAction.Melt
  }
  return waterProcessor(state, {
    ...point, 
    temperature: 10
  }, tick)
}
