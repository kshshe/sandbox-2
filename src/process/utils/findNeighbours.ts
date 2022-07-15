import { GameState, PointData } from '../../gameState'
import { getCoordinateKey } from '../../utils/getCoordinateKey'

export type Direction = {x: number, y: number};

export const NEIGHBOUR_DIRECTIONS_TOP: Direction[] = [
  { x: 0, y: -1 },
]

export const NEIGHBOUR_DIRECTIONS_TOP_SIDE: Direction[] = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
]

export const NEIGHBOUR_DIRECTIONS_BOTTOM_SIDE: Direction[] = [
  { x: -1, y: 1 },
  { x: 1, y: 1 },
]

export const NEIGHBOUR_DIRECTIONS_BOTTOM: Direction[] = [
  { x: 0, y: 1 },
]

export const NEIGHBOUR_DIRECTIONS_EQUAL: Direction[] = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
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
    const neighbour =
      state.pointsByCoordinate[
        getCoordinateKey({
          x: x + direction.x,
          y: y + direction.y,
        })
      ]
    if (neighbour) {
      neighbours.push(neighbour)
    }
  })
  return neighbours
}
