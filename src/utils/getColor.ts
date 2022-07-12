import { PointType } from "../gameState";

const COLORS: Record<PointType, string> = {
    [PointType.Sand]: '#ffd800',
    [PointType.Water]: '#00adff',
    [PointType.Ice]: '#c9eeff',
    [PointType.Steam]: '#efefef',
    [PointType.Lava]: '#ff642e',
    [PointType.StaticStone]: '#a7a7a7',
}

export const getColor = (type: PointType): string => {
    return COLORS[type];
}