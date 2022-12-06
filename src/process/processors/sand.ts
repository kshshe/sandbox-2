import { PointType } from '../../data'
import { addNewPoint } from '../../utils/addNewPoint'
import { deletePoint } from '../../utils/deletePoint'
import { Processor, RequestedAction } from '../types'
import {
  canMoveDown,
  canMoveLeftDown,
  canMoveLeftLeftDown,
  canMoveRightDown,
  canMoveRightRightDown,
} from '../utils/canMove'
import {
  findNeighbours,
  NEIGHBOUR_DIRECTIONS_TOP,
} from '../utils/findNeighbours'

export const sandProcessor: Processor = (state, point) => {
  if (point.temperature > 1300) {
    return RequestedAction.Melt
  }
  if (canMoveDown(state, point)) {
    return RequestedAction.MoveDown
  }

  const availableActionsFirstPriority = [
    canMoveLeftDown(state, point) && RequestedAction.MoveLeftDown,
    canMoveRightDown(state, point) && RequestedAction.MoveRightDown,
  ].filter(Boolean) as RequestedAction[]

  if (availableActionsFirstPriority.length > 0) {
    return availableActionsFirstPriority[
      Math.floor(Math.random() * availableActionsFirstPriority.length)
    ]
  }

  const topNeighbours = findNeighbours(state, point, NEIGHBOUR_DIRECTIONS_TOP).filter(p => p.type !== PointType.Water)

  if (point.humidity > 15 && point.temperature > 1) {
    if (topNeighbours.length === 0) {
      const newPointCoordinate = {
        x: point.coordinate.x,
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

  if (point.humidity > 20) {
    const availableActionsSecondPriority = [
      canMoveLeftLeftDown(state, point) && RequestedAction.MoveLeftLeftDown,
      canMoveRightRightDown(state, point) && RequestedAction.MoveRightRightDown,
    ].filter(Boolean) as RequestedAction[]

    if (availableActionsSecondPriority.length > 0) {
      return availableActionsSecondPriority[
        Math.floor(Math.random() * availableActionsSecondPriority.length)
      ]
    }
  }

  return RequestedAction.None
}
