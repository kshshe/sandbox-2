import { PointType } from '../../data'
import { PointData } from '../../gameState'

export const exceptType = (type: PointType) => {
  return function exceptTypePredicate(neighbor: PointData) {
    return neighbor.type !== type
  }
}
