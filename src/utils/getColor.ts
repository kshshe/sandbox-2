import { COLORS, PointType, Tools } from '../data'
import { getOrCreateGameState } from '../gameState'
import { mixColors } from './mixColors'

const COLD = '#0000FF'
const HOT = '#FF0000'
const WET = '#000000'

const BASE_TEMP = 5
const MIN_DIFF = 2
const MAX_DIFF = 700
const MAX_RATIO = 0.8

const cache = new Map<string, string>()

export const getColor = (
  type: PointType | Tools,
  temperature: number = BASE_TEMP,
  humidity: number = 0,
  force: boolean = false,
): string => {
  const roundedTemperature = Math.round(temperature)
  const roundedHumidity = Math.round(humidity)
  const state = getOrCreateGameState()
  const showTemperature = !state.showTemperature && type === PointType.Metal && roundedTemperature > 0)
  const cacheKey = `${type}-${roundedTemperature}-${roundedHumidity}-${force}-${showTemperature}`
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) as string
  }
  const typeColor = mixColors(
    COLORS[type],
    WET,
    Math.min(roundedHumidity / 200, 1),
  )
  const tempDiff = Math.abs(roundedTemperature - BASE_TEMP)
  if (!showTemperature || tempDiff < MIN_DIFF) {
    cache.set(cacheKey, typeColor)
    return typeColor
  }
  const ratio = Math.min(tempDiff / MAX_DIFF, MAX_RATIO)
  const color = mixColors(typeColor, roundedTemperature > 0 ? HOT : COLD, ratio)
  cache.set(cacheKey, color)
  return color
}
