import { redrawPoint } from '../draw'
import {
  Coordinate,
  getOrCreateGameState,
  PointData,
  PointType,
} from '../gameState'
import { getCoordinateKey } from './getCoordinateKey'
import { getPointOnCoordinate } from './getPointOnCoordinate'

const POINT_INITIAL_DATA: Partial<Record<PointType, Partial<PointData>>> = {
  [PointType.Ice]: {
    temperature: -100
  },
  [PointType.Water]: {
    temperature: 5
  },
  [PointType.Steam]: {
    temperature: 95
  },
  [PointType.Lava]: {
    temperature: 300
  },
  [PointType.Fire]: {
    temperature: 700
  },
  [PointType.Hot]: {
    temperature: 1200,
    fixedTemperature: true
  },
  [PointType.Cold]: {
    temperature: -700,
    fixedTemperature: true
  }
}

const updateCoordinate = (point: PointData, coordinateFrom: Coordinate, coordinateTo: Coordinate): void => {
  const state = getOrCreateGameState()
  delete state.pointsByCoordinate[getCoordinateKey(coordinateFrom)]
  state.pointsByCoordinate[getCoordinateKey(coordinateTo)] = point
}

const createPointObject = (coordinate: Coordinate, type: PointType): PointData => {
  let {x, y} = coordinate
  let localCoordinate = {
    get x() {
      return x
    },
    get y() {
      return y
    },
    set x(value) {
      updateCoordinate(point, {x, y}, {x: value, y})
      x = value
    },
    set y(value) {
      updateCoordinate(point, {x, y}, {x, y: value})
      y = value
    }
  }
  const point: PointData = {
    get coordinate() {
      return localCoordinate
    },
    set coordinate(newCoordinate: Coordinate) {
      if (newCoordinate.x !== localCoordinate.x) {
        localCoordinate.x = newCoordinate.x
      }
      if (newCoordinate.y !== localCoordinate.y) {
        localCoordinate.y = newCoordinate.y
      }
    },
    type,
    temperature: 0,
    age: 1,
    fixedTemperature: false,
    ...(POINT_INITIAL_DATA[type] || {})
  }

  return point
}

export const addNewPoint = (coordinate: Coordinate, type?: PointType) => {
  const state = getOrCreateGameState()
  if (coordinate.x < 0 || coordinate.y < 0) {
    return
  }
  if (coordinate.x > state.borders.horizontal || coordinate.y > state.borders.vertical) {
    return
  }
  const typeToAdd = type || state.currentType
  if (typeToAdd === 'Eraser') {
    const pointThere = getPointOnCoordinate(coordinate)
    if (pointThere) {
      state.points = state.points.filter(point => point !== pointThere)
      delete state.pointsByCoordinate[getCoordinateKey(pointThere.coordinate)]
      redrawPoint(pointThere.coordinate)
    }
    return
  }
  const pointThere = getPointOnCoordinate(coordinate)
  if (pointThere) {
    return
  }
  const point = createPointObject(coordinate, typeToAdd)
  state.pointsByCoordinate[getCoordinateKey(coordinate)] = point
  redrawPoint(coordinate)
  state.points.push(point)
}
