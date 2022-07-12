import {
  Coordinate,
  getOrCreateGameState,
  PointData,
  PointType,
} from '../gameState'
import { getCoordinateKey } from './getCoordinateKey'
import { getPointOnCoordinate } from './getPointOnCoordinate'

export const addNewPoint = (coordinate: Coordinate, type?: PointType) => {
  const state = getOrCreateGameState()
  if (coordinate.x < 0 || coordinate.y < 0) {
    return
  }
  if (coordinate.x > state.borders.horizontal || coordinate.y > state.borders.vertical) {
    return
  }
  const pointThere = getPointOnCoordinate(coordinate)
  if (pointThere) {
    return
  }
  const typeToAdd = type || state.currentType
  const point: PointData = {
    coordinate,
    type: typeToAdd
  }
  state.pointsByCoordinate[getCoordinateKey(coordinate)] = point
  state.points.push(point)
}
