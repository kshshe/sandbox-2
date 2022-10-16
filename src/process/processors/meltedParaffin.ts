import { PointType } from '../../data'
import { Processor, RequestedAction } from '../types'
import { findNeighbours, NEIGHBOUR_DIRECTIONS_TOP, NEIGHBOUR_DIRECTIONS_TOP_SIDE } from '../utils/findNeighbours'
import { cloneProcessor } from './clone'
import { waterProcessor } from './water'

export const meltedParaffinProcessor: Processor = (state, point, tick) => {
  if (point.temperature < 80) {
    return RequestedAction.Freeze
  }
  if (point.temperature > 200) {
    if (point.paraffinWasIgnitedTimes && point.paraffinWasIgnitedTimes > 20) {
      return RequestedAction.Die
    }
    const topNeighbors = findNeighbours(state, point, [...NEIGHBOUR_DIRECTIONS_TOP, ...NEIGHBOUR_DIRECTIONS_TOP_SIDE])
    if (topNeighbors.length < 3) {
      if (Math.random() > 0.5) {
        point.temperature = 100
        point.paraffinWasIgnitedTimes = (point.paraffinWasIgnitedTimes || 0) + 1
        return cloneProcessor(state, {...point, cloningType: PointType.Fire}, tick)
      }
    }
  }
  return waterProcessor(state, {
    ...point,
    temperature: 10,
  }, tick)
}
