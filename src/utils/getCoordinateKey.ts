import { Coordinate } from "../gameState";

export const getCoordinateKey = (coordinate: Coordinate): string => {
    return `${coordinate.x}-${coordinate.y}`;
}
