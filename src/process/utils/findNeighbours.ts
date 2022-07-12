import { GameState, PointData } from "../../gameState";
import { getCoordinateKey } from "../../utils/getCoordinateKey";

export const findNeighbours = (state: GameState, point: PointData): PointData[] => {
  const { x, y } = point.coordinate;
  const neighbours: PointData[] = [];
  const directions = [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ];
  directions.forEach(direction => {
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