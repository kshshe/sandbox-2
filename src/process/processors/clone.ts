import { Processor, RequestedAction } from '../types'
import { findNeighbours, NEIGHBOUR_DIRECTIONS } from '../utils/findNeighbours'
import { PointType } from '../../data'
import { addNewPoint } from '../../utils/addNewPoint'

export const cloneProcessor: Processor = (state, point) => {
  if (!point.cloningType) {
    const neighbours = findNeighbours(state, point)
    const cloneNeighbour = neighbours.find(
      (neighbour) =>
        neighbour.type === PointType.Clone && neighbour.cloningType,
    )
    if (cloneNeighbour) {
      point.cloningType = cloneNeighbour.cloningType
      return RequestedAction.None
    }
    const nonCloneNeighbour = neighbours.find(
      (neighbour) => neighbour.type !== PointType.Clone,
    )
    if (nonCloneNeighbour) {
      point.cloningType = nonCloneNeighbour.type
      return RequestedAction.None
    }
  } else {
    const randomDirection =
      NEIGHBOUR_DIRECTIONS[
        Math.floor(Math.random() * NEIGHBOUR_DIRECTIONS.length)
      ]
    const coordinate = {
      x: point.coordinate.x + randomDirection.x,
      y: point.coordinate.y + randomDirection.y,
    }
    const pointThere = state.pointsByCoordinate[coordinate.x]?.[coordinate.y]
    if (!pointThere) {
      addNewPoint(coordinate, point.cloningType)
    }
  }
  return RequestedAction.None
}
