import { PointType } from '../../data'
import { Processor, RequestedAction } from '../types'
import { cloneProcessor } from './clone'

export const fireSawdustProcessor: Processor = (state, point, tick) => {
  if (point.age > 250) {
    if (Math.random() < 0.3) {
      point.temperature = 5
      point.humidity = 50
      point.fixedTemperature = false
      return RequestedAction.Freeze
    }
    return RequestedAction.Die
  }

  if (Math.random() > 0.99) {
    return cloneProcessor(state, {...point, cloningType: PointType.Fire}, tick)
  }

  return RequestedAction.None
}
