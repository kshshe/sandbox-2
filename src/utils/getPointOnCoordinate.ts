import { Coordinate, getOrCreateGameState, PointData } from '../gameState'
import { getCoordinateKey } from './getCoordinateKey'

export const getPointOnCoordinate = (
  coordinate: Coordinate,
): PointData | null => {
  const state = getOrCreateGameState()
  const key = getCoordinateKey(coordinate)
  return state.pointsByCoordinate[key] || null
}
