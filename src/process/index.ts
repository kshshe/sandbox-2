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
import { gasProcessor } from './processors/gas'
import { fireGasProcessor } from './processors/fireGas'
import { liquidGasProcessor } from './processors/liquidGas'
import { electricityProcessor } from './processors/electricity'
import { metalProcessor } from './processors/metal'
import { sourceProcessor } from './processors/source'
import { liquidMetalProcessor } from './processors/liquidMetal'
import { impulseGeneratorProcessor } from './processors/impulseGenerator'

import { drawDelayed, drawQueue, drawTemperature, redrawPoint } from '../draw'
import { getPointOnCoordinate } from '../utils/getPointOnCoordinate'
import { getColor } from '../utils/getColor'
import { FREEZE_MAP, INFECT_MAP, MELT_MAP, PointType, POINT_INITIAL_DATA, UPDATE_EVERY_TICK, VISIBLE_HUMIDITY } from '../data'
import store from '../interface/store'
import { findNeighbours, NEIGHBOUR_DIRECTIONS } from './utils/findNeighbours'
import { parallelize } from "thread-like";
import { MAX_SPEED } from '../constants'
import { deletePoint } from '../utils/deletePoint'
import { isInline } from '../utils/isInline'
import { updateElecticityDirections } from './backgroundProcesses/updateElecticytyDirections'

const TICKS_PER_SECOND = 60
const INFECTION_STEP_TICKS = 700
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
  [PointType.Gas]: gasProcessor,
  [PointType.FireGas]: fireGasProcessor,
  [PointType.LiquidGas]: liquidGasProcessor,
  [PointType.Electricity]: electricityProcessor,
  [PointType.Metal]: metalProcessor,
  [PointType.Source]: sourceProcessor,
  [PointType.LiquidMetal]: liquidMetalProcessor,
  [PointType.ImpulseGenerator]: impulseGeneratorProcessor,
  [PointType.Grounding]: () => RequestedAction.None,
  [PointType.Wall]: () => RequestedAction.None,
  [PointType.Hot]: () => RequestedAction.None,
  [PointType.Star]: () => RequestedAction.None,
  [PointType.Cold]: () => RequestedAction.None,
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
      deletePoint(point)
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
  if (isInline()) {
    return
  }
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
      `${tick} ticks`,
    ].filter(Boolean)
    metaElement.innerHTML = data.map(line => `<div>${line}</div>`).join('')
  }
  const canvasElement = document.querySelector('canvas.main')
  if (canvasElement) {
    canvasElement.style.borderColor = getColor(
      PointType.NonExistentElement,
      state.temperature,
      0,
      true,
    )
  }
}

const TEMPERATURE_CHANGE_COEFFICIENT = TICKS_PER_SECOND / 5
const TEMPERATURE_CHANGE_COEFFICIENT_FOR_AIR = TICKS_PER_SECOND / 5

const processTemperaturesMap = (state: GameState) => {
  const temperaturesMap = state.temperaturesMap
  const currentDirection = NEIGHBOUR_DIRECTIONS[Math.floor(Math.random() * NEIGHBOUR_DIRECTIONS.length)]
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
      temperaturesMap[x][y] = current
    }
  }
  for (let x = 0; x < state.borders.horizontal; x++) {
    for (let y = 0; y < state.borders.vertical; y++) {
      const point = state.pointsByCoordinate[x][y]
      if (point?.fixedTemperature) {
        continue
      }
      let current = temperaturesMap[x][y]
      const neighbourCoordinate = {
        x: x + currentDirection.x,
        y: y + currentDirection.y,
      }
      if (neighbourCoordinate.x >= 0 && neighbourCoordinate.y >= 0 && neighbourCoordinate.x < state.borders.horizontal && neighbourCoordinate.y < state.borders.vertical) {
        const neighbour = temperaturesMap[neighbourCoordinate.x]?.[neighbourCoordinate.y] || state.baseTemperature
        const diff = (neighbour - current) / TEMPERATURE_CHANGE_COEFFICIENT
        current += diff
        temperaturesMap[neighbourCoordinate.x][neighbourCoordinate.y] = neighbour - diff
      }
      temperaturesMap[x][y] = current
    }
  }
  state.points.forEach(function updatePointTemperature(point) {
    if (point.toBeRemoved) {
      return
    }
    if (point.fixedTemperature) {
      return
    }
    const temp = temperaturesMap[point.coordinate.x][point.coordinate.y]
    if (!isNaN(temp)) {
      point.temperature =
        temperaturesMap[point.coordinate.x][point.coordinate.y]
      if (!point.lastProcessedTemperature || Math.abs(point.temperature - point.lastProcessedTemperature) > 0.5) {
        state.processQueue.add(point)
      }
      if (point.type === PointType.Metal || point.type === PointType.LiquidMetal) {
        redrawPoint(point.coordinate)
      }
    }
  })
}

const processFreeBorders = (state: GameState) => {
  state.points.forEach((point) => {
    if (point.toBeRemoved) {
      return
    }
    const shouldStay =
      point.coordinate.x > 1 &&
      point.coordinate.y > 1 &&
      point.coordinate.x < state.borders.horizontal - 2 &&
      point.coordinate.y < state.borders.vertical - 2
    if (!shouldStay) {
      deletePoint(point)
    }
  })
}

const HUMIDITY_CHANGE_COEFFICIENT = TICKS_PER_SECOND * 10
const HUMIDITY_CHANGE_COEFFICIENT_FOR_AIR = HUMIDITY_CHANGE_COEFFICIENT * 1

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
          current = store.baseHumidity
        } else {
          const diff = (store.baseHumidity - current)
          current += diff / HUMIDITY_CHANGE_COEFFICIENT_FOR_AIR
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
    if (point.toBeRemoved) {
      return
    }
    if (point.fixedHumidity) {
      return
    }
    const humidity = humidityMap[point.coordinate.x][point.coordinate.y]
    if (!isNaN(humidity)) {
      point.humidity = humidityMap[point.coordinate.x][point.coordinate.y]
      if (!point.lastProcessedHumidity || Math.abs(point.humidity - point.lastProcessedHumidity) > 0.5) {
        state.processQueue.add(point)
      }
      if (VISIBLE_HUMIDITY[point.type]) {
        redrawPoint(point.coordinate)
      }
    }
  })
}

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
    if (point.toBeRemoved) {
      continue
    }
    if (point.lastProcessedTick === tick && store.speed !== MAX_SPEED) {
      state.processQueue.add(point)
      continue
    }
    const odlCoordinate = { ...point.coordinate }
    const action = PROCESSORS[point.type](state, point, tick)
    point.lastProcessedTemperature = point.temperature
    point.lastProcessedHumidity = point.humidity
    point.lastProcessedTick = tick
    if (UPDATE_EVERY_TICK[point.type] || action !== RequestedAction.None || point.wasInfected) {
      state.processQueue.add(point)
    }
    const neighbors = findNeighbours(state, point)
    if (!store.processTemperature) {
      const infectMap = INFECT_MAP[point.type]
      if (infectMap) {
        neighbors.forEach(neighbor => {
          const shouldBeInfected = infectMap[neighbor.type]
          if (shouldBeInfected) {
            neighbor.type = shouldBeInfected
            const initialData = POINT_INITIAL_DATA[shouldBeInfected]
            if (initialData) {
              neighbor.temperature = initialData.temperature || state.baseTemperature
              neighbor.humidity = initialData.humidity || 0
            }
            neighbor.wasInfected = true
            neighbor.infectedTick = tick
            redrawPoint(neighbor.coordinate)
          }
        })
      }
    }
    if (point.wasInfected) {
      const stepsNeeded = INFECTION_STEP_TICKS * Math.random()
      if ((point.infectedTick || 0) < tick - stepsNeeded) {
        neighbors.forEach(neighbor => {
          state.processQueue.add(neighbor)
        })
        point.wasInfected = false
      }
    }
    if (action === RequestedAction.None) {
      continue
    }
    neighbors.forEach(neighbor => {
      state.processQueue.add(neighbor)
    })
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

let debugCanvasStored: HTMLCanvasElement | null = null
function startDrawing() {
  requestAnimationFrame(() => {
    drawDelayed();
    if (store.debug) {
      debugCanvasStored = debugCanvasStored || document.querySelector('canvas.debug') as HTMLCanvasElement
      drawQueue(debugCanvasStored)
    }
    if (store.showTemperature && tick % 5 === 0) {
      drawTemperature()
    }
    startDrawing();
  })
}

export const startEngine = async () => {
  processGameTick()
  startDrawing();
  updateElecticityDirections()
  while (true) {
    const start = Date.now()
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
      state.points.forEach(point => {
        point.age++
      })
      tick++
      if (tick % 100 === 0) {
        state.points = state.points.filter(point => !point.toBeRemoved)
      }
    }
    const end = Date.now()
    const elapsed = end - start
    const currentTimeout = 1000 / TICKS_PER_SECOND / (state.speed * state.speed) - elapsed
    await new Promise((resolve) => setTimeout(resolve, currentTimeout))
  }
}
