import { PointType } from '../../data'
import { Processor, RequestedAction } from '../types'
import {
  findNeighbours,
  NEIGHBOUR_DIRECTIONS_BOTTOM,
  NEIGHBOUR_DIRECTIONS_BOTTOM_SIDE,
  NEIGHBOUR_DIRECTIONS_TOP,
  NEIGHBOUR_DIRECTIONS_TOP_SIDE,
} from '../utils/findNeighbours'
import { addNewPoint } from '../../utils/addNewPoint'
import { deletePoint } from '../../utils/deletePoint'

export const treeProcessor: Processor = (state, point) => {
  if (point.temperature > 50) {
    point.temperature = 700 * 3
    return RequestedAction.Melt
  }

  if (point.temperature < 1) {
    return RequestedAction.None
  }

  const bottomNeighbours = findNeighbours(state, point, [...NEIGHBOUR_DIRECTIONS_BOTTOM, ...NEIGHBOUR_DIRECTIONS_BOTTOM_SIDE]).filter(p => p.type === PointType.Sand || p.type === PointType.Tree)
  if (bottomNeighbours.length === 0) {
    return RequestedAction.Die
  }

  if (point.humidity > 1) {
    const topNeighbours = findNeighbours(state, point, [...NEIGHBOUR_DIRECTIONS_TOP, ...NEIGHBOUR_DIRECTIONS_TOP_SIDE]).filter(p => p.type !== PointType.Water)
    if (topNeighbours.length === 0) {
      let xModifier = 0
      if (Math.random() > 0.4) {
        if (Math.random() > 0.5) {
          xModifier = 1
        } else {
          xModifier = -1
        }
      }
      const newPointCoordinate = {
        x: point.coordinate.x + xModifier,
        y: point.coordinate.y - 1,
      }
      const pointThere = state.pointsByCoordinate[newPointCoordinate.x]?.[newPointCoordinate.y]
      if (pointThere) {
        deletePoint(pointThere)
      }
      addNewPoint(
        newPointCoordinate,
        PointType.Tree,
      )
    }
  }

  return RequestedAction.None
}
