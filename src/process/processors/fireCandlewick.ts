import { PointType } from '../../data'
import { Processor, RequestedAction } from '../types'
import { findNeighbours } from '../utils/findNeighbours'
import { cloneProcessor } from './clone'

export const fireCandlewickProcessor: Processor = (state, point, tick) => {
  if (point.age > 100) {
    const neighbours = findNeighbours(state, point)
    const differentTypeNeighbours = neighbours.filter(n => n.type !== point.type && n.type !== PointType.Fire)
    if (differentTypeNeighbours.length === 0 || point.age > 10000) {
      return RequestedAction.Die
    }
  }

  if (Math.random() > 0.4) {
    return cloneProcessor(state, {...point, cloningType: PointType.Fire}, tick)
  }

  return RequestedAction.None
}
