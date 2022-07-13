import { getOrCreateGameState, PointType } from '../gameState'
import { mixColors }  from './mixColors'

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

const COLD = '#0000FF'
const HOT = '#FF0000'

const BASE_TEMP = 5;
const MIN_DIFF = 2;
const MAX_DIFF = 150;
const MAX_RATIO = 0.8;

export const getColor = (type: PointType, temperature: number = BASE_TEMP): string => {
  const state = getOrCreateGameState()
  const typeColor = COLORS[type]
  const tempDiff = Math.abs(temperature - BASE_TEMP)
  if (!state.showTemperature || tempDiff < MIN_DIFF) {
    return typeColor
  }
  const ratio = Math.min(tempDiff / MAX_DIFF, MAX_RATIO)
  return mixColors(typeColor, temperature > 0 ? HOT : COLD, ratio)
}
