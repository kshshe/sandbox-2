import { IGNORE_MAP } from '../../data'
import {
  Coordinate,
  GameState,
  getOrCreateGameState,
  PointData,
} from '../../gameState'

type MoveChecker = (state: GameState, point: PointData) => boolean

export const canMoveTo = (
  point: PointData,
  coordinate: Coordinate,
): boolean => {
  const state = getOrCreateGameState()
  const pointThere = state.pointsByCoordinate[coordinate.x]?.[coordinate.y]
  if (pointThere) {
    return (
      pointThere.type !== point.type &&
      !!IGNORE_MAP[point.type]?.[pointThere.type]
    )
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

export const canMoveLeftLeftDown: MoveChecker = (state, point) => {
  return (
    point.coordinate.x > 1 &&
    point.coordinate.y < state.borders.vertical - 1 &&
    canMoveTo(point, {
      x: point.coordinate.x - 2,
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

export const canMoveRightRightDown: MoveChecker = (state, point) => {
  return (
    point.coordinate.x < state.borders.horizontal - 2 &&
    point.coordinate.y < state.borders.vertical - 1 &&
    canMoveTo(point, {
      x: point.coordinate.x + 2,
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
