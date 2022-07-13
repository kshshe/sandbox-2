import { getOrCreateGameState, PointType } from '../gameState'
import { mixColors } from './mixColors'

const COLORS: Record<PointType, string> = {
  [PointType.Sand]: '#ffd800',
  [PointType.Water]: '#00adff',
  [PointType.Ice]: '#c9eeff',
  [PointType.Steam]: '#efefef',
  [PointType.Lava]: '#ff642e',
  [PointType.Fire]: '#ff992e',
  [PointType.BFire]: '#8ddaff',
  [PointType.IceFire]: '#8ddaff',
  [PointType.Stone]: '#a7a7a7',
  [PointType.StaticGlass]: '#f2f4ff',
  [PointType.MeltedGlass]: '#ffe6d3',
  [PointType.Fuel]: '#2eff5e',
  [PointType.Acid]: '#60ff2e',
  [PointType.Hot]: '#c53300',
  [PointType.Cold]: '#0078af',
  [PointType.Void]: '#000000',
  [PointType.Clone]: '#00a927',
  [PointType.Virus]: '#d900ff',
  [PointType.Metal]: '#e5e5e5',
  [PointType.NonExistentElement]: '#ffffff',
}

const COLD = '#0000FF'
const HOT = '#FF0000'
const WET = '#000000'

const BASE_TEMP = 5
const MIN_DIFF = 2
const MAX_DIFF = 150
const MAX_RATIO = 0.8

export const getColor = (
  type: PointType,
  temperature: number = BASE_TEMP,
  humidity: number = 0,
  force: boolean = false,
): string => {
  const state = getOrCreateGameState()
  const typeColor = mixColors(COLORS[type], WET, Math.min(humidity / 200, 1))
  const tempDiff = Math.abs(temperature - BASE_TEMP)
  const showTemperature =
    force ||
    state.showTemperature ||
    (type === PointType.Metal && temperature > 0)
  if (!showTemperature || tempDiff < MIN_DIFF) {
    return typeColor
  }
  const ratio = Math.min(tempDiff / MAX_DIFF, MAX_RATIO)
  return mixColors(typeColor, temperature > 0 ? HOT : COLD, ratio)
}
