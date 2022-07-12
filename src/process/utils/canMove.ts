import { Coordinate, GameState, getOrCreateGameState, PointData, PointType } from '../../gameState'
import { getCoordinateKey } from '../../utils/getCoordinateKey'

const fluids = [PointType.Water, PointType.Steam, PointType.Lava]
const powders = [PointType.Sand]

const IGNORE_MAP: Partial<Record<PointType, PointType[]>> = {
  [PointType.Steam]: [...powders, ...fluids],
  [PointType.Sand]: fluids,
}

type MoveChecker = (state: GameState, point: PointData) => boolean

export const canMoveTo = (point: PointData, coordinate: Coordinate): boolean => {
  const state = getOrCreateGameState()
  const pointKey = getCoordinateKey(coordinate)
  const pointThere = state.pointsByCoordinate[pointKey]
  if (pointThere) {
    return !!IGNORE_MAP[point.type]?.includes(pointThere.type)
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

export const canMoveLeftUp: MoveChecker = (state, point) => {
  return (
    point.coordinate.x > 0 &&
    point.coordinate.y > 0 &&
    canMoveTo(point, {
      x: point.coordinate.x - 1,
      y: point.coordinate.y - 1,
    })
  )
}

export const canMoveRightUp: MoveChecker = (state, point) => {
  return (
    point.coordinate.x < state.borders.horizontal - 1 &&
    point.coordinate.y > 0 &&
    canMoveTo(point, {
      x: point.coordinate.x + 1,
      y: point.coordinate.y - 1,
    })
  )
}
