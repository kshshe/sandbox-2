import { Processor, RequestedAction } from '../types'
import { gasMovementProcessor } from './gas'
import { cloneProcessor } from './clone'

export const fireGasProcessor: Processor = (state, point, tick) => {
  if (point.age > 30) {
    return RequestedAction.Die
  }

  if (point.isInitialGas) {
    cloneProcessor(state, point, tick)
  }

  return gasMovementProcessor(state, point, tick)
}
