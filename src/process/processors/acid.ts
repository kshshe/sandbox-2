import { redrawPoint } from '../../draw'
import { PointType } from '../../data'
import { Processor, RequestedAction } from '../types'
import {
  findNeighbours,
  NEIGHBOUR_DIRECTIONS_BOTTOM,
  NEIGHBOUR_DIRECTIONS_BOTTOM_SIDE,
  NEIGHBOUR_DIRECTIONS_EQUAL,
  NEIGHBOUR_DIRECTIONS_TOP,
  NEIGHBOUR_DIRECTIONS_TOP_SIDE,
} from '../utils/findNeighbours'
import { waterProcessor } from './water'
import { deletePoint } from '../../utils/deletePoint'

export const acidProcessor: Processor = (state, point, tick) => {
  const neighbours = findNeighbours(state, point, [
    ...NEIGHBOUR_DIRECTIONS_BOTTOM,
    ...NEIGHBOUR_DIRECTIONS_BOTTOM_SIDE,
    ...NEIGHBOUR_DIRECTIONS_EQUAL,
    ...NEIGHBOUR_DIRECTIONS_TOP,
    ...NEIGHBOUR_DIRECTIONS_TOP_SIDE,
  ]).filter((n) => ![PointType.Clone, point.type].includes(n.type))
  if (neighbours.length > 0) {
    const topNeighbour = neighbours[0]
    deletePoint(topNeighbour)
    if (point.acidUsedTimes && point.acidUsedTimes > 0) {
      return RequestedAction.Die
    }
    point.acidUsedTimes = 1
    return RequestedAction.NoneButContinue
  }

  return waterProcessor(state, {
    ...point,
    temperature: 10,
  }, tick)
}
