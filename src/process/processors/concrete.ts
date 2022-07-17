import { Processor, RequestedAction } from '../types'
import { waterProcessor } from './water'

export const concreteProcessor: Processor = (state, point, tick) => {
  if (point.humidity < 20) {
    return RequestedAction.Freeze
  }
  if (point.humidity < 30) {
    if (tick % 4 === 0) {
      return RequestedAction.None
    }
  }
  if (point.humidity < 40) {
    if (tick % 3 === 0) {
      return RequestedAction.None
    }
  }
  if (tick % 2 === 0) {
    return RequestedAction.None
  }
  return waterProcessor(state, {
    ...point,
    temperature: 10,
  }, tick)
}
