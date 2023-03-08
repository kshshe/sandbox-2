import { Processor } from '../types'
import { sandProcessor } from './sand'

export const rustProcessor: Processor = (state, point, tick) => {
  return sandProcessor(state, {...point, temperature: 10, humidity: 0}, tick)
}
