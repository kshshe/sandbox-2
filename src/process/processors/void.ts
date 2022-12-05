import { Processor, RequestedAction } from '../types'
import { findNeighbours } from '../utils/findNeighbours'
import { redrawPoint } from '../../draw'
import { PointType } from '../../data'
import { deletePoint } from '../../utils/deletePoint'

export const voidProcessor: Processor = (state, point) => {
  const neighbours = findNeighbours(state, point)
  neighbours.forEach((neighbour) => {
    if (neighbour.type !== PointType.Void) {
      deletePoint(neighbour)
      point.temperature += 3
    }
  })
  return RequestedAction.None
}
