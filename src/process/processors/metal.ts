import { PointType } from '../../data'
import { redrawPoint } from '../../draw'
import { PointData } from '../../gameState'
import { CAN_CONDUCT_ELECTRICITY } from '../backgroundProcesses/updateElecticytyDirections'
import { Processor, RequestedAction } from '../types'
import { findNeighbours } from '../utils/findNeighbours'

const TEMPERATURE_INCREASE_PER_POWER = 0.03

const moveElectricity = (point: PointData, neighbour: PointData, coefficient: number = 1) => {
  const tempDiff = TEMPERATURE_INCREASE_PER_POWER * (point.electricityPower || 0)

  point.temperature = (point.temperature || 0) + tempDiff
  neighbour.temperature = (neighbour.temperature || 0) + tempDiff

  neighbour.electricityPower = (neighbour.electricityPower || 0) + (point.electricityPower || 0) * coefficient
  point.electricityPower = 0

  redrawPoint(point.coordinate)
  redrawPoint(neighbour.coordinate)
}

export const metalProcessor: Processor = (state, point, tick) => {
  if (point.temperature > 660 && point.type === PointType.Metal) {
    return RequestedAction.Melt
  }

  const hasWaterNeighbours = findNeighbours(state, point).some(
    (p) => p.type === PointType.Water
  )
  if (hasWaterNeighbours && tick % 10 === 0 && Math.random() > 0.99 && point.type === PointType.Metal) {
    point.type = PointType.Rust
    redrawPoint(point.coordinate)
    return RequestedAction.NoneButContinue
  }

  if (point.electricityPower) {
    const groundingNeighbours = findNeighbours(state, point).filter(
      (p) => p.type === PointType.Grounding
    )
    if (groundingNeighbours.length !== 0) {
      point.electricityPower = 0
      redrawPoint(point.coordinate)
      return RequestedAction.NoneButContinue
    }
    
    if (point.electricityDirection) {
      const metalNeighbourInDirection = findNeighbours(state, point, [point.electricityDirection]).find(
        (p) => CAN_CONDUCT_ELECTRICITY[p.type] && (!p.electricityPower || p.electricityPower < (point.electricityPower || 0))
      )
      if (metalNeighbourInDirection) {
        moveElectricity(point, metalNeighbourInDirection)

        return RequestedAction.NoneButContinue
      }
    }

    const metalNeighbours = findNeighbours(state, point).filter(
      (p) => CAN_CONDUCT_ELECTRICITY[p.type]
    ).filter(p => !p.electricityPower || p.electricityPower < (point.electricityPower || 0))

    if (metalNeighbours.length !== 0) {
      const randomNeighbour = metalNeighbours[Math.floor(Math.random() * metalNeighbours.length)]

      moveElectricity(point, randomNeighbour, 0.7)

      return RequestedAction.NoneButContinue
    }
  }

  return hasWaterNeighbours ? RequestedAction.NoneButContinue : RequestedAction.None
}
