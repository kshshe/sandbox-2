import { PointType } from '../gameState'

const COLORS: Record<PointType, string> = {
  [PointType.Sand]: '#ffd800',
  [PointType.Water]: '#00adff',
  [PointType.Ice]: '#c9eeff',
  [PointType.Steam]: '#efefef',
  [PointType.Lava]: '#ff642e',
  [PointType.Fire]: '#ff992e',
  [PointType.StaticStone]: '#a7a7a7',
  [PointType.StaticGlass]: '#f2f4ff',
  [PointType.MeltedGlass]: '#ffe6d3',
  [PointType.Fuel]: '#2eff5e',
  [PointType.Hot]: '#c53300',
  [PointType.Cold]: '#0078af',
  [PointType.Void]: '#000000',
  [PointType.Clone]: '#00a927',
}

export const getColor = (type: PointType): string => {
  return COLORS[type]
}
