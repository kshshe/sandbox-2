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

const cache = new Map<string, string>()

export const getColor = (
  type: PointType,
  temperature: number = BASE_TEMP,
  humidity: number = 0,
  force: boolean = false,
): string => {
  const roundedTemperature = Math.round(temperature)
  const roundedHumidity = Math.round(humidity)
  const cacheKey = `${type}-${roundedTemperature}-${roundedHumidity}-${force}`
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) as string
  }
  const state = getOrCreateGameState()
  const typeColor = mixColors(COLORS[type], WET, Math.min(roundedHumidity / 200, 1))
  const tempDiff = Math.abs(roundedTemperature - BASE_TEMP)
  const showTemperature =
    force ||
    state.showTemperature ||
    (type === PointType.Metal && roundedTemperature > 0)
  if (!showTemperature || tempDiff < MIN_DIFF) {
    cache.set(cacheKey, typeColor)
    return typeColor
  }
  const ratio = Math.min(tempDiff / MAX_DIFF, MAX_RATIO)
  const color = mixColors(typeColor, roundedTemperature > 0 ? HOT : COLD, ratio)
  cache.set(cacheKey, color)
  return color
}
