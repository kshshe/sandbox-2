import { PointType } from '../../data'
import { Processor, RequestedAction } from '../types'
import { canMoveLeft, canMoveLeftUp, canMoveRight, canMoveRightUp, canMoveUp } from '../utils/canMove'

export const fireProcessor: Processor = (state, point) => {
  if (point.type === PointType.IceFire && point.temperature > 0) {
    return RequestedAction.Die
  }
  if ([PointType.Fire, PointType.BFire].includes(point.type) && point.temperature < 0) {
    return RequestedAction.Die
  }
  if ((point.age > 10 && Math.random() < 0.2) || point.age > 40) {
    return RequestedAction.Die
  }

  const availableActionsFirstPriority = [
    canMoveUp(state, point) && RequestedAction.MoveUp,
    canMoveLeftUp(state, point) && RequestedAction.MoveLeftUp,
    canMoveRightUp(state, point) && RequestedAction.MoveRightUp,
  ].filter(Boolean) as RequestedAction[]

  if (availableActionsFirstPriority.length > 0) {
    return availableActionsFirstPriority[Math.floor(Math.random() * availableActionsFirstPriority.length)]
  }

  const availableActions = [
    canMoveLeft(state, point) && RequestedAction.MoveLeft,
    canMoveRight(state, point) && RequestedAction.MoveRight,
  ].filter(Boolean) as RequestedAction[]

  if (availableActions.length > 0) {
    return availableActions[Math.floor(Math.random() * availableActions.length)]
  }

  return RequestedAction.None
}
