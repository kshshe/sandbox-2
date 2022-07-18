import { PointType } from '../../data'
import { Processor, RequestedAction } from '../types'
import { cloneProcessor } from './clone'
import { sandProcessor } from './sand'


export const fireCharcoalProcessor: Processor = (state, point, tick) => {
  if (point.age > 5000) {
    if (Math.random() < 0.05) {
      point.temperature = 5
      point.humidity = 50
      point.fixedTemperature = false
      return RequestedAction.Freeze
    }
    if (Math.random() < 0.1) {
      return RequestedAction.Die
    }
  }

  return sandProcessor(state, {
    ...point,
    humidity: 0,
    temperature: 0
    }, tick)
}
