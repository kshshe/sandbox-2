import { Processor, RequestedAction } from '../types'
import { findNeighbours } from '../utils/findNeighbours'
import { redrawPoint } from '../../draw'
import { PointType } from '../../data'

export const voidProcessor: Processor = (state, point) => {
  const neighbours = findNeighbours(state, point)
  neighbours.forEach((neighbour) => {
    if (neighbour.type !== PointType.Void) {
      neighbour.type = PointType.NonExistentElement
      delete state.pointsByCoordinate[neighbour.coordinate.x][neighbour.coordinate.y]
      state.points = state.points.filter((p) => p !== neighbour)
      redrawPoint(neighbour.coordinate)
    }
  })
  return RequestedAction.None
}
