import { redrawPoint } from '../../draw'
import { CAN_CONDUCT_ELECTRICITY } from '../backgroundProcesses/updateElecticytyDirections'
import { Processor, RequestedAction } from '../types'
import { findNeighbours } from '../utils/findNeighbours'

export const sourceProcessor: Processor = (state, point) => {
  const neighbors = findNeighbours(state, point).filter((p) => CAN_CONDUCT_ELECTRICITY[p.type])
  if (neighbors.length > 0) {
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)]
    randomNeighbor.electricityPower = (randomNeighbor.electricityPower || 0) + 1
    redrawPoint(randomNeighbor.coordinate)
    return RequestedAction.NoneButContinue
  }

  return RequestedAction.None
}
