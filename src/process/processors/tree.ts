import { PointType } from '../../gameState'
import { Processor, RequestedAction } from '../types'
import { findNeighbours, NEIGHBOUR_DIRECTIONS_BOTTOM, NEIGHBOUR_DIRECTIONS_BOTTOM_SIDE, NEIGHBOUR_DIRECTIONS_TOP, NEIGHBOUR_DIRECTIONS_TOP_SIDE } from '../utils/findNeighbours'
import { addNewPoint } from '../../utils/addNewPoint'
import { updateHumidity } from '../utils/updateHumidity'

export const treeProcessor: Processor = (state, point) => {
  if (point.temperature > 10) {
    point.temperature = 700 * 8
    return RequestedAction.Melt
  }

  const bottomNeighbours = findNeighbours(state, point, [...NEIGHBOUR_DIRECTIONS_BOTTOM_SIDE, ...NEIGHBOUR_DIRECTIONS_BOTTOM])
  if (bottomNeighbours.length === 0) {
    return RequestedAction.Die
  }

  updateHumidity(state, point)

  if (point.humidity > 3) {
    point.treeGrowTimer = (point.treeGrowTimer||0) + 1;
  }

  if (point.humidity > 3 && point.treeGrowTimer && point.treeGrowTimer > 80) {
    const topNeighbours = findNeighbours(state, point, NEIGHBOUR_DIRECTIONS_TOP)
    if (topNeighbours.length === 0) {
      addNewPoint({
        x: point.coordinate.x ,
        y: point.coordinate.y - 1,
      }, PointType.Tree)
    }
  }

  return RequestedAction.None
}
