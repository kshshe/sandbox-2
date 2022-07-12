import { Coordinate, GameState, getOrCreateGameState, PointData, PointType } from '../../gameState'
import { getCoordinateKey } from '../../utils/getCoordinateKey'

const IGNORE_MAP: Partial<Record<PointType, PointType[]>> = {
  [PointType.Sand]: [PointType.Water],
}

type MoveChecker = (state: GameState, point: PointData) => boolean | (() => void)

export const canMoveTo = (point: PointData, coordinate: Coordinate): boolean | (() => void) => {
  const state = getOrCreateGameState()
  const pointKey = getCoordinateKey(coordinate)
  const pointThere = state.pointsByCoordinate[pointKey]
  if (pointThere) {
    if (IGNORE_MAP[point.type]?.includes(pointThere.type)) {
      const afterMove = () => {
        delete state.pointsByCoordinate[getCoordinateKey(point.coordinate)]
        pointThere.coordinate = {...point.coordinate}
        state.pointsByCoordinate[getCoordinateKey(pointThere.coordinate)] = pointThere
      }
      return afterMove
    }
    return false
  }
  return true
}

export const canMoveDown: MoveChecker = (state, point) => {
  return (
    point.coordinate.y < state.borders.vertical - 1 &&
    canMoveTo(point, {
      x: point.coordinate.x,
      y: point.coordinate.y + 1,
    })
  )
}

export const canMoveLeft: MoveChecker = (state, point) => {
  return (
    point.coordinate.x > 0 &&
    canMoveTo(point, {
      x: point.coordinate.x - 1,
      y: point.coordinate.y,
    })
  )
}

export const canMoveRight: MoveChecker = (state, point) => {
  return (
    point.coordinate.x < state.borders.horizontal - 1 &&
    canMoveTo(point, {
      x: point.coordinate.x + 1,
      y: point.coordinate.y,
    })
  )
}

export const canMoveUp: MoveChecker = (state, point) => {
  return (
    point.coordinate.y > 0 &&
    canMoveTo(point, {
      x: point.coordinate.x,
      y: point.coordinate.y - 1,
    })
  )
}

export const canMoveLeftDown: MoveChecker = (state, point) => {
  return (
    point.coordinate.x > 0 &&
    point.coordinate.y < state.borders.vertical - 1 &&
    canMoveTo(point, {
      x: point.coordinate.x - 1,
      y: point.coordinate.y + 1,
    })
  )
}

export const canMoveRightDown: MoveChecker = (state, point) => {
  return (
    point.coordinate.x < state.borders.horizontal - 1 &&
    point.coordinate.y < state.borders.vertical - 1 &&
    canMoveTo(point, {
      x: point.coordinate.x + 1,
      y: point.coordinate.y + 1,
    })
  )
}