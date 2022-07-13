import { GameState, PointData } from "../../gameState";
import { getCoordinateKey } from "../../utils/getCoordinateKey";

export const NEIGHBOUR_DIRECTIONS = [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ]

export const findNeighbours = (state: GameState, point: PointData): PointData[] => {
  const { x, y } = point.coordinate;
  const neighbours: PointData[] = [];
  NEIGHBOUR_DIRECTIONS.forEach(direction => {
    const neighbour = state.pointsByCoordinate[getCoordinateKey({
        x: x + direction.x,
        y: y + direction.y,
    })];
    if (neighbour) {
      neighbours.push(neighbour);
    }
  });
  return neighbours;
}