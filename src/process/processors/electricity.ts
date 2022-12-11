import { PointType } from '../../data'
import { redrawPoint } from '../../draw'
import { CAN_CONDUCT_ELECTRICITY } from '../backgroundProcesses/updateElecticytyDirections'
import { Processor, RequestedAction } from '../types'
import { canMoveDown, canMoveLeftDown, canMoveRightDown } from '../utils/canMove'
import { findNeighbours } from '../utils/findNeighbours'

export const electricityProcessor: Processor = (state, point) => {
  const neighbors = findNeighbours(state, point).filter((p) => CAN_CONDUCT_ELECTRICITY[p.type])
  if (neighbors.length > 0) {
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)]
    randomNeighbor.electricityPower = (randomNeighbor.electricityPower || 0) + 1
    redrawPoint(randomNeighbor.coordinate)
    return RequestedAction.Die
  }

  const availableActions = [
    canMoveDown(state, point) && RequestedAction.MoveDown,
    canMoveLeftDown(state, point) && RequestedAction.MoveLeftDown,
    canMoveRightDown(state, point) && RequestedAction.MoveRightDown,
  ].filter(Boolean) as RequestedAction[]

  if (availableActions.length > 0) {
    return availableActions[Math.floor(Math.random() * availableActions.length)]
  }

  return RequestedAction.Die
}
