import { Processor, RequestedAction } from '../types'
import { sandProcessor } from './sand'

export const stoneProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 200) {
    return RequestedAction.Melt
  }
  return sandProcessor(state, {...point, temperature: 10, humidity: 0}, tick)
}
