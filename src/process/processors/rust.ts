import { PointType } from '../../data'
import { Processor, RequestedAction } from '../types'
import { findNeighbours } from '../utils/findNeighbours'
import { sandProcessor } from './sand'

export const rustProcessor: Processor = (state, point, tick) => {
  const hasMetalNeighbours = findNeighbours(state, point).some(
    (p) => p.type === PointType.Metal
  )
  if (hasMetalNeighbours) {
    return RequestedAction.None;
  }
  return sandProcessor(state, {...point, temperature: 10, humidity: 0}, tick)
}
