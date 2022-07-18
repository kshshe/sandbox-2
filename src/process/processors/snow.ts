import { Processor, RequestedAction } from '../types'
import { sandProcessor } from './sand'

export const snowProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 0) {
    return RequestedAction.Melt
  }
  
  return sandProcessor(state, {...point, humidity: 0}, tick)
}
