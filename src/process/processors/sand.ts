import { redrawPoint } from '../../draw'
import { Processor, RequestedAction } from '../types'
import { canMoveDown, canMoveLeftDown, canMoveLeftLeftDown, canMoveRightDown, canMoveRightRightDown } from '../utils/canMove'
import { findNeighbours } from '../utils/findNeighbours'

export const sandProcessor: Processor = (state, point) => {
  if (point.temperature > 120) {
    return RequestedAction.Melt
  }
  if (canMoveDown(state, point)) {
    return RequestedAction.MoveDown
  }

  const neighboursHumidity = findNeighbours(state, point).map(neighbour => neighbour.humidity);
  if (neighboursHumidity.length < 8) {
    const diff = 8 - neighboursHumidity.length;
    neighboursHumidity.push(...new Array(diff).fill(0));
  }

  const averageHumidity = neighboursHumidity.reduce((acc, curr) => acc + curr, 0) / 8;
  const humidityDiff = averageHumidity - point.humidity;
  if (humidityDiff > 0.5) {
    point.humidity = point.humidity + humidityDiff / 60;
    redrawPoint(point.coordinate);
  }

  const availableActionsFirstPriority = [
    canMoveLeftDown(state, point) && RequestedAction.MoveLeftDown,
    canMoveRightDown(state, point) && RequestedAction.MoveRightDown,
  ].filter(Boolean) as RequestedAction[]

  if (availableActionsFirstPriority.length > 0) {
    return availableActionsFirstPriority[Math.floor(Math.random() * availableActionsFirstPriority.length)]
  }

  if (point.humidity > 20) {
    const availableActionsSecondPriority = [
      canMoveLeftLeftDown(state, point) && RequestedAction.MoveLeftLeftDown,
      canMoveRightRightDown(state, point) && RequestedAction.MoveRightRightDown,
    ].filter(Boolean) as RequestedAction[]

    if (availableActionsSecondPriority.length > 0) {
      return availableActionsSecondPriority[Math.floor(Math.random() * availableActionsSecondPriority.length)]
    }
  }
  
  return RequestedAction.None
}
