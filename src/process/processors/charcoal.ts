import { Processor, RequestedAction } from '../types'
import { sandProcessor } from './sand'

export const charcoalProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 300) {
    point.temperature = 2000
    point.age = 0
    point.fixedTemperature = true;
    return RequestedAction.Melt
  }

  return sandProcessor(state, {
    ...point,
    humidity: 0,
    temperature: 0
  }, tick)
}
