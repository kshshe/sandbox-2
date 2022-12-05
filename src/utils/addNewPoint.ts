import { POINTS_LIMIT } from '../constants'
import { PointType, POINT_INITIAL_DATA } from '../data'
import { drawPoint } from '../draw'
import { Coordinate, GameState, getOrCreateGameState, PointData } from '../gameState'
import { findNeighbours } from '../process/utils/findNeighbours'
import { deletePoint } from './deletePoint'
import { getPointOnCoordinate } from './getPointOnCoordinate'

const updateCoordinate = (
  point: PointData,
  coordinateFrom: Coordinate,
  coordinateTo: Coordinate,
): void => {
  const state = getOrCreateGameState()
  try {
    delete state.pointsByCoordinate[coordinateFrom.x][coordinateFrom.y]
  } catch {}
  if (!state.pointsByCoordinate[coordinateTo.x]) {
    state.pointsByCoordinate[coordinateTo.x] = []
  }
  state.pointsByCoordinate[coordinateTo.x][coordinateTo.y] = point
}

const createPointObject = (
  state: GameState,
  coordinate: Coordinate,
  type: PointType,
  defaultData?: Partial<PointData>
): PointData => {
  let localCoordinate = {
    x: coordinate.x,
    y: coordinate.y,
  }
  const point: PointData = {
    type,
    temperature: state.baseTemperature || 0,
    humidity: 0,
    age: 1,
    fixedHumidity: false,
    fixedTemperature: false,
    ...(POINT_INITIAL_DATA[type] || {}),
    ...defaultData,
    get coordinate() {
      return localCoordinate
    },
    set coordinate(newCoordinate: Coordinate) {
      const from = { x: localCoordinate.x, y: localCoordinate.y }
      localCoordinate.x = newCoordinate.x
      localCoordinate.y = newCoordinate.y
      updateCoordinate(point, from, {
        x: newCoordinate.x,
        y: newCoordinate.y,
      })
    },
  }

  return point
}

export const restorePoint = (pointData: PointData) => {
  const state = getOrCreateGameState()
  const point = createPointObject(
    state,
    pointData.coordinate,
    pointData.type,
    pointData,
  )
  state.pointsByCoordinate[point.coordinate.x][point.coordinate.y] = point
  drawPoint(point.coordinate)
  state.points.push(point)
  state.processQueue.add(point)
}

export const addNewPoint = (coordinate: Coordinate, type?: 'Eraser' | PointType) => {
  const state = getOrCreateGameState()
  if (coordinate.x < 0 || coordinate.y < 0) {
    return
  }
  if (
    coordinate.x > state.borders.horizontal - 1||
    coordinate.y > state.borders.vertical - 1
  ) {
    return
  }
  const typeToAdd = type || state.currentType
  if (typeToAdd === 'Eraser') {
    const pointThere = getPointOnCoordinate(coordinate)
    if (pointThere) {
      const neighbors = findNeighbours(state, pointThere)
      neighbors.forEach((neighbor) => {
        state.processQueue.add(neighbor)
      })
      deletePoint(pointThere)
      drawPoint(pointThere.coordinate)
    }
    return
  }
  if (state.points.length > POINTS_LIMIT) {
    return
  }
  const pointThere = getPointOnCoordinate(coordinate)
  if (pointThere) {
    return
  }
  const point = createPointObject(state, coordinate, typeToAdd)
  state.pointsByCoordinate[coordinate.x][coordinate.y] = point
  drawPoint(coordinate)
  state.points.push(point)
  state.processQueue.add(point)
}

// @ts-ignore
window.addNewPoint = addNewPoint
