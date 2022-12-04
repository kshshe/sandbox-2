import { Processor, RequestedAction } from '../types'
import { waterProcessor } from './water'

export const concreteProcessor: Processor = (state, point, tick) => {
  if (point.humidity < 20) {
    return RequestedAction.Freeze
  }
  return waterProcessor(state, {
    ...point,
    temperature: 10,
  }, tick)
}
