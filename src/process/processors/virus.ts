import { redrawPoint } from '../../draw';
import { PointType } from '../../gameState';
import { POINT_INITIAL_DATA } from '../../utils/addNewPoint';
import { Processor, RequestedAction } from '../types'
import { canMoveDown, canMoveLeftDown, canMoveRightDown } from '../utils/canMove'
import { findNeighbours } from '../utils/findNeighbours'

const TRANSFORM_DEFAULT_TIMEOUT = 30

export const virusProcessor: Processor = (state, point) => {
  const neighbours = findNeighbours(state, point);
  if (!point.transformInto) {
    const target = neighbours.find(n => n.type !== PointType.Virus);
    if (target) {
      point.transformInto = target.type;
      point.transformTimeout = TRANSFORM_DEFAULT_TIMEOUT;
      return RequestedAction.None
    }
  }

  if (point.transformInto) {
    if (point.transformTimeout) {
      neighbours.forEach(n => {
        if (n.type !== PointType.Virus && !n.virusImmunity) {
          n.type = PointType.Virus;
          n.transformInto = point.transformInto; 
          n.transformTimeout = TRANSFORM_DEFAULT_TIMEOUT;
          redrawPoint(n.coordinate)
        }
      })
      point.transformTimeout--;
    } else {
      point.type = point.transformInto;
      point.fixedTemperature = false;
      if (POINT_INITIAL_DATA[point.type]) {
        Object.assign(point, POINT_INITIAL_DATA[point.type]);
      }
      point.virusImmunity = TRANSFORM_DEFAULT_TIMEOUT * 2;
      redrawPoint(point.coordinate)
      point.transformInto = undefined;
      return RequestedAction.None
    }
  }

  if (canMoveDown(state, point)) {
    return RequestedAction.MoveDown
  }

  const availableActionsFirstPriority = [
    canMoveLeftDown(state, point) && RequestedAction.MoveLeftDown,
    canMoveRightDown(state, point) && RequestedAction.MoveRightDown,
  ].filter(Boolean) as RequestedAction[]

  if (availableActionsFirstPriority.length > 0) {
    return availableActionsFirstPriority[Math.floor(Math.random() * availableActionsFirstPriority.length)]
  }
  
  return RequestedAction.None
}
