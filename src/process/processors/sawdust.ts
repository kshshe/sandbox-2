import { Processor, RequestedAction } from '../types'
import { sandProcessor } from './sand';

export const sawdustProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 200) {
    point.temperature = 800
    point.age = 0
    point.fixedTemperature = true;
    return RequestedAction.Melt
  }

  return sandProcessor(state, {
    ...point,
    temperature: 0,
    humidity: 0 
  }, tick)
}
