import { PointType } from '../../data'
import { redrawPoint } from '../../draw'
import { PointData } from '../../gameState'
import { Processor, RequestedAction } from '../types'
import { findNeighbours } from '../utils/findNeighbours'

const TEMPERATURE_INCREASE_PER_POWER = 0.1

const moveElectricity = (point: PointData, neighbour: PointData, coefficient: number = 1) => {
  const tempDiff = TEMPERATURE_INCREASE_PER_POWER * (point.electricityPower || 0)

  point.temperature = (point.temperature || 0) + tempDiff
  neighbour.temperature = (neighbour.temperature || 0) + tempDiff

  neighbour.electricityPower = (neighbour.electricityPower || 0) + (point.electricityPower || 0) * coefficient
  point.electricityPower = 0

  redrawPoint(point.coordinate)
  redrawPoint(neighbour.coordinate)
}

export const metalProcessor: Processor = (state, point) => {
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
        (p) => p.type === PointType.Metal && (!p.electricityPower || p.electricityPower < (point.electricityPower || 0))
      )
      if (metalNeighbourInDirection) {
        moveElectricity(point, metalNeighbourInDirection)

        return RequestedAction.NoneButContinue
      }
    }

    const metalNeighbours = findNeighbours(state, point).filter(
      (p) => p.type === PointType.Metal
    ).filter(p => !p.electricityPower || p.electricityPower < (point.electricityPower || 0))

    if (metalNeighbours.length !== 0) {
      const randomNeighbour = metalNeighbours[Math.floor(Math.random() * metalNeighbours.length)]

      moveElectricity(point, randomNeighbour, 0.99)

      return RequestedAction.NoneButContinue
    }
  }

  return RequestedAction.None
}
