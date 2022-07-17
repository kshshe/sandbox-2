import { PointType } from '../../data'
import { Processor, RequestedAction } from '../types'
import { cloneProcessor } from './clone'

export const fireWoodProcessor: Processor = (state, point, tick) => {
  if (point.age > 1000) {
    return RequestedAction.Die
  }

  if (Math.random() > 0.5) {
    return cloneProcessor(state, {...point, cloningType: PointType.Fire}, tick)
  }

  return RequestedAction.None
}
