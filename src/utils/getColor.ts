import { COLORS, PointType, Tools } from '../data'
import { getOrCreateGameState } from '../gameState'
import { mixColors } from './mixColors'

const COLD = '#0000FF'
const HOT = '#FF0000'
const WET = '#000000'

const BASE_TEMP = 5
const MAX_DIFF = 700
const MAX_RATIO = 0.8

export const getColor = (
  type: PointType | Tools,
  temperature: number = BASE_TEMP,
  humidity: number = 0,
  force: boolean = false,
): string => {
  const state = getOrCreateGameState()
  const showTemperature = !state.showTemperature && type === PointType.Metal && temperature > 0
  if (showTemperature || humidity > 0 || force) {
    let color = COLORS[type]
    if (humidity > 0) {
      color = mixColors(
        COLORS[type],
        WET,
        Math.min(humidity / 200, 1),
      )
    }
    if (showTemperature) {
      const tempDiff = Math.abs(temperature - BASE_TEMP)
      const ratio = Math.min(tempDiff / MAX_DIFF, MAX_RATIO)
      color = mixColors(color, temperature > 0 ? HOT : COLD, ratio)
    }
    return color
  } else {
    return COLORS[type]
  }
}
