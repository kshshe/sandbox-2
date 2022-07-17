import { PointType } from '../../data'
import { Processor, RequestedAction } from '../types'
import {
  findNeighbours,
  NEIGHBOUR_DIRECTIONS_BOTTOM,
  NEIGHBOUR_DIRECTIONS_TOP,
  NEIGHBOUR_DIRECTIONS_TOP_SIDE,
} from '../utils/findNeighbours'
import { addNewPoint } from '../../utils/addNewPoint'

export const treeProcessor: Processor = (state, point) => {
  if (point.temperature > 10) {
    point.temperature = 700 * 8
    return RequestedAction.Melt
  }

  if (point.temperature < 1) {
    return RequestedAction.None
  }

  const sideNeighbours = findNeighbours(state, point, NEIGHBOUR_DIRECTIONS_TOP_SIDE)
  if (sideNeighbours.length !== 0) {
    return RequestedAction.None
  }

  const bottomNeighbours = findNeighbours(state, point, NEIGHBOUR_DIRECTIONS_BOTTOM)
  if (bottomNeighbours.length === 0) {
    return RequestedAction.Die
  }

  if (point.humidity > 1) {
    point.treeGrowTimer = (point.treeGrowTimer || 0) + 1
  }

  if (point.humidity > 1 && point.treeGrowTimer && point.treeGrowTimer > 10) {
    const topNeighbours = findNeighbours(state, point, NEIGHBOUR_DIRECTIONS_TOP)
    if (topNeighbours.length === 0) {
      addNewPoint(
        {
          x: point.coordinate.x,
          y: point.coordinate.y - 1,
        },
        PointType.Tree,
      )
    }
  }

  return RequestedAction.None
}
