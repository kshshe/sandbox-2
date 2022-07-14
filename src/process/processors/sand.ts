import { PointType } from '../../gameState'
import { addNewPoint } from '../../utils/addNewPoint'
import { updateHumidity } from '../utils/updateHumidity'
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
  if (point.temperature > 120) {
    return RequestedAction.Melt
  }
  if (canMoveDown(state, point)) {
    return RequestedAction.MoveDown
  }

  updateHumidity(state, point)

  const availableActionsFirstPriority = [
    canMoveLeftDown(state, point) && RequestedAction.MoveLeftDown,
    canMoveRightDown(state, point) && RequestedAction.MoveRightDown,
  ].filter(Boolean) as RequestedAction[]

  if (availableActionsFirstPriority.length > 0) {
    return availableActionsFirstPriority[
      Math.floor(Math.random() * availableActionsFirstPriority.length)
    ]
  }

  const topNeighbours = findNeighbours(state, point, NEIGHBOUR_DIRECTIONS_TOP)
  if (point.humidity > 15 && topNeighbours.length === 0) {
    point.treeGrowTimer = (point.treeGrowTimer || 0) + 1
  } else {
    point.treeGrowTimer = 0
  }

  if (point.humidity > 15 && point.treeGrowTimer && point.treeGrowTimer > 150) {
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
