import { Coordinate, getOrCreateGameState, PointData } from '../gameState'

export const getPointOnCoordinate = (
  coordinate: Coordinate,
): PointData | null => {
  const state = getOrCreateGameState()
  return state.pointsByCoordinate[coordinate.x]?.[coordinate.y] || null
}
