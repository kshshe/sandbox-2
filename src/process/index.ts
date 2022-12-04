import {
  Coordinate,
  GameState,
  getOrCreateGameState,
  PointData,
} from '../gameState'
import { Processor, RequestedAction } from './types'

import { sandProcessor } from './processors/sand'
import { waterProcessor } from './processors/water'
import { steamProcessor } from './processors/steam'
import { iceProcessor } from './processors/ice'
import { dryIceProcessor } from './processors/dryIce'
import { lavaProcessor } from './processors/lava'
import { fireProcessor } from './processors/fire'
import { stoneProcessor } from './processors/stone'
import { meltedGlassProcessor } from './processors/meltedGlass'
import { staticGlassProcessor } from './processors/staticGlass'
import { fuelProcessor } from './processors/fuel'
import { voidProcessor } from './processors/void'
import { cloneProcessor } from './processors/clone'
import { acidProcessor } from './processors/acid'
import { treeProcessor } from './processors/tree'
import { concreteProcessor } from './processors/concrete'
import { staticStoneProcessor } from './processors/staticStone'
import { woodProcessor } from './processors/wood'
import { fireWoodProcessor } from './processors/fireWood'
import { cinderProcessor } from './processors/cinder'
import { snowProcessor } from './processors/snow'
import { fireCharcoalProcessor } from './processors/fireCharcoal'
import { charcoalProcessor } from './processors/charcoal'
import { spongeProcessor } from './processors/sponge'
import { sawdustProcessor } from './processors/sawdust'
import { fireSawdustProcessor } from './processors/fireSawdust'
import { paraffinProcessor } from './processors/paraffin'
import { meltedParaffinProcessor } from './processors/meltedParaffin'
import { candlewickProcessor } from './processors/candlewick'
import { fireCandlewickProcessor } from './processors/fireCandlewick'

import { drawDelayed, redrawPoint } from '../draw'
import { getPointOnCoordinate } from '../utils/getPointOnCoordinate'
import { getColor } from '../utils/getColor'
import { FREEZE_MAP, MELT_MAP, PointType, VISIBLE_HUMIDITY } from '../data'
import store from '../interface/store'
import { findNeighbours } from './utils/findNeighbours'
import { parallelize } from "thread-like";

const TICKS_PER_SECOND = 60
let tick = 0

const PROCESSORS: Record<PointType, Processor> = {
  [PointType.Sand]: sandProcessor,
  [PointType.Water]: waterProcessor,
  [PointType.Ice]: iceProcessor,
  [PointType.DryIce]: dryIceProcessor,
  [PointType.Snow]: snowProcessor,
  [PointType.Steam]: steamProcessor,
  [PointType.Lava]: lavaProcessor,
  [PointType.Fire]: fireProcessor,
  [PointType.BFire]: fireProcessor,
  [PointType.IceFire]: fireProcessor,
  [PointType.Stone]: stoneProcessor,
  [PointType.StaticStone]: staticStoneProcessor,
  [PointType.MeltedGlass]: meltedGlassProcessor,
  [PointType.StaticGlass]: staticGlassProcessor,
  [PointType.Concrete]: concreteProcessor,
  [PointType.Fuel]: fuelProcessor,
  [PointType.Acid]: acidProcessor,
  [PointType.Void]: voidProcessor,
  [PointType.Clone]: cloneProcessor,
  [PointType.Tree]: treeProcessor,
  [PointType.FireWood]: fireWoodProcessor,
  [PointType.Wood]: woodProcessor,
  [PointType.Cinder]: cinderProcessor,
  [PointType.Charcoal]: charcoalProcessor,
  [PointType.FireCharcoal]: fireCharcoalProcessor,
  [PointType.Sawdust]: sawdustProcessor,
  [PointType.FireSawdust]: fireSawdustProcessor,
  [PointType.Sponge]: spongeProcessor,
  [PointType.Paraffin]: paraffinProcessor,
  [PointType.MeltedParaffin]: meltedParaffinProcessor,
  [PointType.Candlewick]: candlewickProcessor,
  [PointType.FireCandlewick]: fireCandlewickProcessor,
  [PointType.Hot]: () => RequestedAction.None,
  [PointType.Cold]: () => RequestedAction.None,
  [PointType.Metal]: () => RequestedAction.None,
  [PointType.NonExistentElement]: () => RequestedAction.None,
}

const swap = (point: PointData, to: Coordinate) => {
  const pointInitialCoordinate: Coordinate = {
    x: point.coordinate.x,
    y: point.coordinate.y,
  }
  const pointThere = getPointOnCoordinate(to)
  if (pointThere) {
    pointThere.coordinate = { x: -1, y: -1 }
  }
  point.coordinate = to
  if (pointThere) {
    pointThere.coordinate = pointInitialCoordinate
  }
  redrawPoint(pointInitialCoordinate)
  redrawPoint(to)
}

const applyAction = (
  state: GameState,
  action: RequestedAction,
  point: PointData,
): void => {
  switch (action) {
    case RequestedAction.Freeze:
      point.type = FREEZE_MAP[point.type] || point.type
      if (point.type === PointType.Water) {
        point.humidity = 100
      }
      break
    case RequestedAction.Melt:
      point.type = MELT_MAP[point.type] || point.type
      if (point.type === PointType.Water) {
        point.humidity = 100
        point.fixedHumidity = true
      }
      break
    case RequestedAction.MoveDown:
      swap(point, { ...point.coordinate, y: point.coordinate.y + 1 })
      break
    case RequestedAction.MoveLeft:
      swap(point, { ...point.coordinate, x: point.coordinate.x - 1 })
      break
    case RequestedAction.MoveRight:
      swap(point, { ...point.coordinate, x: point.coordinate.x + 1 })
      break
    case RequestedAction.MoveUp:
      swap(point, { ...point.coordinate, y: point.coordinate.y - 1 })
      break
    case RequestedAction.MoveLeftDown:
      swap(point, {
        x: point.coordinate.x - 1,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveRightDown:
      swap(point, {
        x: point.coordinate.x + 1,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveLeftLeftDown:
      swap(point, {
        x: point.coordinate.x - 2,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveRightRightDown:
      swap(point, {
        x: point.coordinate.x + 2,
        y: point.coordinate.y + 1,
      })
      break
    case RequestedAction.MoveRightUp:
      swap(point, {
        x: point.coordinate.x + 1,
        y: point.coordinate.y - 1,
      })
      break
    case RequestedAction.MoveLeftUp:
      swap(point, {
        x: point.coordinate.x - 1,
        y: point.coordinate.y - 1,
      })
      break
    case RequestedAction.Die:
      delete state.pointsByCoordinate[point.coordinate.x][point.coordinate.y]
      state.processQueue.delete(point)
      state.points = state.points.filter((p) => p !== point)
      redrawPoint(point.coordinate)
      break
    default:
      break
  }
}

const processRoomTemp = (state: GameState) => {
  if (state.points.length > 0) {
    const averageTemp =
      state.points.reduce((acc, cur) => acc + cur.temperature, 0) /
      state.points.length
    state.temperature = averageTemp
  } else {
    state.temperature = state.baseTemperature
  }
}

const updateMeta = (state: GameState) => {
  const metaElement = document.querySelector('.meta')
  const queueSizeElement = document.querySelector('.queueSize')
  if (queueSizeElement) {
    const size = state.processQueue.size
    queueSizeElement.style.width = `${size / 4}px`
    if (size > 1500) {
      queueSizeElement.classList.add('big')
    } else {
      queueSizeElement.classList.remove('big')
    }
    if (size < 400) {
      queueSizeElement.classList.add('small')
    } else {
      queueSizeElement.classList.remove('small')
    }
  }
  if (metaElement) {
    const data = [
      store.processTemperature && `${state.temperature.toFixed(2)} ℃`,
      `${state.points.length} points`,
    ].filter(Boolean)
    metaElement.innerHTML = data.map(line => `<div>${line}</div>`).join('')
  }
  const canvasElement = document.querySelector('canvas')
  if (canvasElement) {
    canvasElement.style.borderColor = getColor(
      PointType.NonExistentElement,
      state.temperature,
      0,
      true,
    )
  }
}

const TEMPERATURE_CHANGE_COEFFICIENT = TICKS_PER_SECOND * 3
const TEMPERATURE_CHANGE_COEFFICIENT_FOR_AIR = TICKS_PER_SECOND * 1

const processTemperaturesMap = (state: GameState) => {
  const temperaturesMap = state.temperaturesMap
  for (let x = 0; x < state.borders.horizontal; x++) {
    temperaturesMap[x] = temperaturesMap[x] || []
    for (let y = 0; y < state.borders.vertical; y++) {
      const point = state.pointsByCoordinate[x][y]
      let current = temperaturesMap[x][y]
      if (point) {
        current = point.temperature
      } else {
        if (current === undefined) {
          current = state.baseTemperature
        } else {
          current =
            current +
            (state.baseTemperature - current) /
              TEMPERATURE_CHANGE_COEFFICIENT_FOR_AIR
        }
      }
      if (x > 0) {
        const left = temperaturesMap[x - 1][y]
        const diff = (left - current) / TEMPERATURE_CHANGE_COEFFICIENT
        current += diff
        temperaturesMap[x - 1][y] -= diff
      }
      if (y > 0) {
        const top = temperaturesMap[x][y - 1]
        const diff = (top - current) / TEMPERATURE_CHANGE_COEFFICIENT
        current += diff
        temperaturesMap[x][y - 1] -= diff
      }
      if (x > 0 && y > 0) {
        const topLeft = temperaturesMap[x - 1][y - 1]
        const diff = (topLeft - current) / TEMPERATURE_CHANGE_COEFFICIENT
        current += diff
        temperaturesMap[x - 1][y - 1] -= diff
      }
      temperaturesMap[x][y] = current
    }
  }
  state.points.forEach(function updatePointTemperature(point) {
    if (point.fixedTemperature) {
      return
    }
    const temp = temperaturesMap[point.coordinate.x][point.coordinate.y]
    if (!isNaN(temp)) {
      point.temperature =
        temperaturesMap[point.coordinate.x][point.coordinate.y]
      if (!point.lastProcessedTemperature || Math.abs(point.temperature - point.lastProcessedTemperature) > 3) {
        state.processQueue.add(point)
      }
      if (point.type === PointType.Metal) {
        redrawPoint(point.coordinate)
      }
    }
  })
}

const processFreeBorders = (state: GameState) => {
  state.points = state.points.filter((point) => {
    const shouldStay =
      point.coordinate.x > 1 &&
      point.coordinate.y > 1 &&
      point.coordinate.x < state.borders.horizontal - 2 &&
      point.coordinate.y < state.borders.vertical - 2
    if (!shouldStay) {
      delete state.pointsByCoordinate[point.coordinate.x][point.coordinate.y]
      state.processQueue.delete(point)
      redrawPoint(point.coordinate)
    }
    return shouldStay
  })
}

const HUMIDITY_CHANGE_COEFFICIENT = TICKS_PER_SECOND * 10
const HUMIDITY_CHANGE_COEFFICIENT_FOR_AIR = HUMIDITY_CHANGE_COEFFICIENT * 5

const processHumidityMap = (state: GameState) => {
  const humidityMap = state.humidityMap
  for (let x = 0; x < state.borders.horizontal; x++) {
    humidityMap[x] = humidityMap[x] || []
    for (let y = 0; y < state.borders.vertical; y++) {
      const point = state.pointsByCoordinate[x][y]
      let current = humidityMap[x][y]
      if (point) {
        current = point.humidity
      } else {
        if (current === undefined) {
          current = 0
        } else {
          if (store.dynamicWater && current > 80) {
            current = 80
          } else if (!store.dynamicWater) {
            current = current / HUMIDITY_CHANGE_COEFFICIENT_FOR_AIR
          }
        }
      }
      if (x > 0) {
        const left = humidityMap[x - 1][y]
        const diff = (left - current) / HUMIDITY_CHANGE_COEFFICIENT
        current += diff
        humidityMap[x - 1][y] -= diff
      }
      if (y > 0) {
        const top = humidityMap[x][y - 1]
        const diff = (top - current) / HUMIDITY_CHANGE_COEFFICIENT
        current += diff
        humidityMap[x][y - 1] -= diff
      }
      if (x > 0 && y > 0) {
        const topLeft = humidityMap[x - 1][y - 1]
        const diff = (topLeft - current) / HUMIDITY_CHANGE_COEFFICIENT
        current += diff
        humidityMap[x - 1][y - 1] -= diff
      }
      humidityMap[x][y] = current
    }
  }
  state.points.forEach(function updatePointHumidity(point) {
    if (point.fixedHumidity && !store.dynamicWater) {
      return
    }
    const humidity = humidityMap[point.coordinate.x][point.coordinate.y]
    if (!isNaN(humidity)) {
      point.humidity = humidityMap[point.coordinate.x][point.coordinate.y]
      if (!point.lastProcessedHumidity || Math.abs(point.humidity - point.lastProcessedHumidity) > 3) {
        state.processQueue.add(point)
      }
      if (VISIBLE_HUMIDITY[point.type]) {
        redrawPoint(point.coordinate)
      }
    }
  })
}

let now = Date.now()
let lastProcessedTimeShouldBeLessThan = 0

let queueTick = 0
const processGameTick = parallelize(function* () {
  const startState = getOrCreateGameState()
  for (const point of startState.processQueue) {
    const state = getOrCreateGameState()
    if (state !== startState) {
      break
    }
    queueTick++
    if (queueTick % 100 === 0) {
      yield
    }
    state.processQueue.delete(point)
    if (point.lastProcessedTime > lastProcessedTimeShouldBeLessThan) {
      state.processQueue.add(point)
      continue
    }
    const odlCoordinate = { ...point.coordinate }
    const action = PROCESSORS[point.type](state, point, tick)
    point.age++
    point.lastProcessedTemperature = point.temperature
    point.lastProcessedHumidity = point.humidity
    point.lastProcessedTime = now
    if (action === RequestedAction.None) {
      continue
    }
    const neighbors = findNeighbours(state, point)
    neighbors.forEach(neighbor => {
      state.processQueue.add(neighbor)
    })
    state.processQueue.add(point)
    if (action === RequestedAction.NoneButContinue) {
      continue
    }
    applyAction(state, action, point)
    redrawPoint(odlCoordinate)
    redrawPoint(point.coordinate)
  }
  requestAnimationFrame(() => {
    processGameTick()
  })
})

function startDrawing() {
  requestAnimationFrame(() => {
    drawDelayed();
    startDrawing();
  })
}

export const startEngine = async () => {
  processGameTick()
  startDrawing();
  while (true) {
    const state = getOrCreateGameState()
    if (state.playing) {
      if (store.processTemperature) {
        if (tick % TICKS_PER_SECOND === 0) {
          processRoomTemp(state)
        }
        processTemperaturesMap(state)
      }
      if (store.processHumidity) {
        processHumidityMap(state)
      }
      if (state.freeBorders) {
        processFreeBorders(state)
      }
      updateMeta(state)
      tick++
      now = Date.now()
    }
    const currentTimeout = 1000 / TICKS_PER_SECOND / (state.speed * state.speed)
    lastProcessedTimeShouldBeLessThan = now - currentTimeout / 2
    await new Promise((resolve) => setTimeout(resolve, currentTimeout))
  }
}
