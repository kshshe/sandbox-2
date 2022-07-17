import { GameState, PointData } from '../../gameState'

export type Direction = { x: number; y: number }

export const DIRECTIONS = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  leftUp: { x: -1, y: -1 },
  rightUp: { x: 1, y: -1 },
  leftDown: { x: -1, y: 1 },
  rightDown: { x: 1, y: 1 },
}

export const NEIGHBOUR_DIRECTIONS_TOP: Direction[] = [DIRECTIONS.up]

export const NEIGHBOUR_DIRECTIONS_TOP_SIDE: Direction[] = [
  DIRECTIONS.leftUp,
  DIRECTIONS.rightUp,
]

export const NEIGHBOUR_DIRECTIONS_BOTTOM_SIDE: Direction[] = [
  DIRECTIONS.leftDown,
  DIRECTIONS.rightDown,
]

export const NEIGHBOUR_DIRECTIONS_BOTTOM: Direction[] = [
  DIRECTIONS.down,
]

export const NEIGHBOUR_DIRECTIONS_EQUAL: Direction[] = [
  DIRECTIONS.left,
  DIRECTIONS.right,
]

export const NEIGHBOUR_DIRECTIONS: Direction[] = [
  ...NEIGHBOUR_DIRECTIONS_TOP,
  ...NEIGHBOUR_DIRECTIONS_TOP_SIDE,
  ...NEIGHBOUR_DIRECTIONS_BOTTOM,
  ...NEIGHBOUR_DIRECTIONS_BOTTOM_SIDE,
  ...NEIGHBOUR_DIRECTIONS_EQUAL,
]

export const findNeighbours = (
  state: GameState,
  point: PointData,
  directions: Direction[] = NEIGHBOUR_DIRECTIONS,
): PointData[] => {
  const { x, y } = point.coordinate
  const neighbours: PointData[] = []
  directions.forEach((direction) => {
    const neighbour = state.pointsByCoordinate[x + direction.x]?.[y + direction.y]
    if (neighbour) {
      neighbours.push(neighbour)
    }
  })
  return neighbours
}
