import { PointType } from "../gameState";

const COLORS: Record<PointType, string> = {
    [PointType.Sand]: '#ffd800',
    [PointType.Water]: '#00adff',
}

export const getColor = (type: PointType): string => {
    return COLORS[type];
}