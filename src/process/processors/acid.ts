import { redrawPoint } from '../../draw'
import { PointType } from '../../gameState'
import { getCoordinateKey } from '../../utils/getCoordinateKey'
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

export const acidProcessor: Processor = (state, point) => {
  const neighbours = findNeighbours(state, point, [
    ...NEIGHBOUR_DIRECTIONS_BOTTOM,
    ...NEIGHBOUR_DIRECTIONS_BOTTOM_SIDE,
    ...NEIGHBOUR_DIRECTIONS_EQUAL,
    ...NEIGHBOUR_DIRECTIONS_TOP,
    ...NEIGHBOUR_DIRECTIONS_TOP_SIDE,
  ]).filter((n) => ![PointType.Clone, point.type].includes(n.type))
  if (neighbours.length > 0) {
    const topNeighbour = neighbours[0]
    delete state.pointsByCoordinate[getCoordinateKey(topNeighbour.coordinate)]
    state.points = state.points.filter((p) => p !== topNeighbour)
    topNeighbour.type = PointType.NonExistentElement
    redrawPoint(topNeighbour.coordinate)
    if (point.acidUsedTimes && point.acidUsedTimes > 0) {
      return RequestedAction.Die
    }
    point.acidUsedTimes = 1
    return RequestedAction.None
  }

  return waterProcessor(state, {
    ...point,
    temperature: 10,
  })
}
