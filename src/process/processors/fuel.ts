import { Processor, RequestedAction } from '../types'
import { waterProcessor } from './water'

export const fuelProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 180) {
    point.temperature = 900 * 10
    return RequestedAction.Melt
  }
  return waterProcessor(state, {
    ...point, 
    temperature: 10
  }, tick)
}
