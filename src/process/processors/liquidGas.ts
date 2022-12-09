import { Processor, RequestedAction } from '../types'
import { waterProcessor } from './water'

export const liquidGasProcessor: Processor = (state, point, tick) => {
  if (point.temperature > -80) {
    return RequestedAction.Melt
  }

  return waterProcessor(state, {...point, temperature: 5}, tick)
}
