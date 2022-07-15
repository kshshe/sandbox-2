import { redrawPoint } from "../../draw";
import { GameState, PointData } from "../../gameState";
import { findNeighbours } from "./findNeighbours";

export const updateHumidity = (state: GameState, point: PointData, coefficient: number = 1) => {
  const neighboursHumidity = findNeighbours(state, point).map(neighbour => neighbour.humidity);
  if (neighboursHumidity.length < 8) {
    const diff = 8 - neighboursHumidity.length;
    neighboursHumidity.push(...new Array(diff).fill(0));
  }

  const averageHumidity = neighboursHumidity.reduce((acc, curr) => acc + curr, 0) / neighboursHumidity.length;
  const humidityDiff = averageHumidity * (coefficient) - point.humidity;
  if (humidityDiff) {
    point.humidity = point.humidity + humidityDiff / 60;
    redrawPoint(point.coordinate);
  }

}