import { POINTS_LIMIT } from '../constants'
import { PointType, POINT_INITIAL_DATA } from '../data'
import { drawPoint } from '../draw'
import {
  Coordinate,
  getOrCreateGameState,
  PointData,
} from '../gameState'
import { getCoordinateKey } from './getCoordinateKey'
import { getPointOnCoordinate } from './getPointOnCoordinate'

const updateCoordinate = (
  point: PointData,
  coordinateFrom: Coordinate,
  coordinateTo: Coordinate,
): void => {
  const state = getOrCreateGameState()
  delete state.pointsByCoordinate[getCoordinateKey(coordinateFrom)]
  state.pointsByCoordinate[getCoordinateKey(coordinateTo)] = point
}

const createPointObject = (
  coordinate: Coordinate,
  type: PointType,
): PointData => {
  let { x, y } = coordinate
  let pauseUpdates = false
  let localCoordinate = {
    get x() {
      return x
    },
    get y() {
      return y
    },
    set x(value) {
      if (!pauseUpdates) {
        updateCoordinate(point, { x, y }, { x: value, y })
      }
      x = value
    },
    set y(value) {
      if (!pauseUpdates) {
        updateCoordinate(point, { x, y }, { x, y: value })
      }
      y = value
    },
  }
  const point: PointData = {
    get coordinate() {
      return localCoordinate
    },
    set coordinate(newCoordinate: Coordinate) {
      pauseUpdates = true
      const from = { x, y }
      if (newCoordinate.x !== localCoordinate.x) {
        localCoordinate.x = newCoordinate.x
      }
      if (newCoordinate.y !== localCoordinate.y) {
        localCoordinate.y = newCoordinate.y
      }
      updateCoordinate(point, from, {
        x: newCoordinate.x,
        y: newCoordinate.y,
      })
      pauseUpdates = false
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
      delete state.pointsByCoordinate[getCoordinateKey(pointThere.coordinate)]
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
  state.pointsByCoordinate[getCoordinateKey(coordinate)] = point
  drawPoint(coordinate)
  state.points.push(point)
}

// @ts-ignore
window.addNewPoint = addNewPoint
