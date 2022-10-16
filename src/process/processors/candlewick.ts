import { Processor, RequestedAction } from '../types'

export const candlewickProcessor: Processor = (state, point) => {
  if (point.temperature > 300) {
    point.temperature = 400
    point.age = 0
    point.fixedTemperature = true;
    return RequestedAction.Melt
  }

  return RequestedAction.None
}
