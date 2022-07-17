import { Processor, RequestedAction } from '../types'
import { sandProcessor } from './sand'

export const cinderProcessor: Processor = (state, point, tick) => {
  if (point.humidity > 60) {
    return RequestedAction.Melt
  }
  return sandProcessor(state, {...point, temperature: 10, humidity: 0}, tick)
}
