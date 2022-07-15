import { POINTS_LIMIT } from '../constants'
import { PointType, POINT_INITIAL_DATA } from '../data'
import { drawPoint } from '../draw'
import { Coordinate, getOrCreateGameState, PointData } from '../gameState'
import { getPointOnCoordinate } from './getPointOnCoordinate'

const updateCoordinate = (
  point: PointData,
  coordinateFrom: Coordinate,
  coordinateTo: Coordinate,
): void => {
  const state = getOrCreateGameState()
  delete state.pointsByCoordinate[coordinateFrom.x][coordinateFrom.y]
  if (!state.pointsByCoordinate[coordinateTo.x]) {
    state.pointsByCoordinate[coordinateTo.x] = []
  }
  state.pointsByCoordinate[coordinateTo.x][coordinateTo.y] = point
}

const createPointObject = (
  coordinate: Coordinate,
  type: PointType,
): PointData => {
  let localCoordinate = {
    x: coordinate.x,
    y: coordinate.y,
  }
  const point: PointData = {
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
    type,
    temperature: 0,
    humidity: 0,
    age: 1,
    fixedTemperature: false,
    ...(POINT_INITIAL_DATA[type] || {}),
  }

  return point
}

export const addNewPoint = (coordinate: Coordinate, type?: PointType) => {
  const state = getOrCreateGameState()
  if (coordinate.x < 0 || coordinate.y < 0) {
    return
  }
  if (
    coordinate.x > state.borders.horizontal ||
    coordinate.y > state.borders.vertical
  ) {
    return
  }
  const typeToAdd = type || state.currentType
  if (typeToAdd === 'Eraser') {
    const pointThere = getPointOnCoordinate(coordinate)
    if (pointThere) {
      state.points = state.points.filter((point) => point !== pointThere)
      delete state.pointsByCoordinate[pointThere.coordinate.x][pointThere.coordinate.y]
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
  const point = createPointObject(coordinate, typeToAdd)
  state.pointsByCoordinate[coordinate.x][coordinate.y] = point
  drawPoint(coordinate)
  state.points.push(point)
}

// @ts-ignore
window.addNewPoint = addNewPoint
