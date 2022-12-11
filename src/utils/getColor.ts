import { COLORS, PointType, Tools } from '../data'
import { getOrCreateGameState } from '../gameState'
import { mixColors } from './mixColors'
import { CAN_CONDUCT_ELECTRICITY } from '../process/backgroundProcesses/updateElecticytyDirections'

const COLD = '#0000FF'
const HOT = '#FF0000'
const WET = '#000000'
const ELECTRIFIED = '#FFFF00'

const BASE_TEMP = 5
const MAX_DIFF = 700
const MAX_RATIO = 0.8

export const getColor = (
  type: PointType | Tools,
  temperature: number = BASE_TEMP,
  humidity: number = 0,
  force: boolean = false,
  electricityPower: number = 0,
): string => {
  const state = getOrCreateGameState()
  const showTemperature = !state.showTemperature && type === PointType.Metal && temperature > 0
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
  if (CAN_CONDUCT_ELECTRICITY[type as PointType] && electricityPower > 0.1) {
    color = mixColors(color, ELECTRIFIED, Math.min(electricityPower / 3, 0.6))
  }
  return color
}
