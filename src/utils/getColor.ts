import { COLORS, PointType } from '../data'
import { getOrCreateGameState } from '../gameState'
import { mixColors } from './mixColors'

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
