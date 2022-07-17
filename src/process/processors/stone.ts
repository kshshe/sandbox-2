import { Processor, RequestedAction } from '../types'
import { sandProcessor } from './sand'

export const stoneProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 1300) {
    return RequestedAction.Melt
  }
  return sandProcessor(state, {...point, temperature: 10, humidity: 0}, tick)
}
