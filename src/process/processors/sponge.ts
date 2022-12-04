import { Processor, RequestedAction } from '../types'
import { findNeighbours } from '../utils/findNeighbours'
import { redrawPoint } from '../../draw'
import { PointType } from '../../data'
import { cloneProcessor } from './clone'

export const spongeProcessor: Processor = (state, point, tick) => {
  const neighbours = findNeighbours(state, point)

  if (point.temperature > 150) {
    neighbours.forEach(neighbour => {
      if (neighbour.type === point.type) {
        neighbour.temperature = 300
        redrawPoint(neighbour.coordinate)
      }
    })
    if (Math.random() > 0.9) {
      cloneProcessor(state, {...point, cloningType: PointType.Fire}, tick)
    }
    return RequestedAction.Melt
  }

  neighbours.forEach((neighbour) => {
    if (neighbour.type === PointType.Water) {
      if (Math.random() > 0.96) {
        neighbour.type = PointType.NonExistentElement
        delete state.pointsByCoordinate[neighbour.coordinate.x][
          neighbour.coordinate.y
        ]
        state.processQueue.delete(point)
        state.points = state.points.filter((p) => p !== neighbour)
        redrawPoint(neighbour.coordinate)
        point.humidity = Math.min(100, point.humidity + 3)
      }
    }
  })
  return RequestedAction.None
}
