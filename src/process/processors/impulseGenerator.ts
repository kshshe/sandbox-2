import { Processor, RequestedAction } from '../types'
import { metalProcessor } from './metal'

export const IMPULSE_TARGET = 2000

export const impulseGeneratorProcessor: Processor = (state, point, tick) => {
  if (point.impulseElectricityPower && point.impulseElectricityPower > IMPULSE_TARGET) {
    point.electricityPower = point.impulseElectricityPower
    point.impulseElectricityPower = 0
    metalProcessor(state, point, tick)
  }

  point.impulseElectricityPower = (point.impulseElectricityPower || 0) + (point.electricityPower || 0)

  return RequestedAction.NoneButContinue
}
