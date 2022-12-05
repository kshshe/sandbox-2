import { Coordinate, getOrCreateGameState } from './gameState'
import { getColor } from './utils/getColor'
import { getPointOnCoordinate } from './utils/getPointOnCoordinate'
import { PointType, VISIBLE_HUMIDITY } from './data'
import store from './interface/store'

const resetCanvasBg = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

let lastCtx: CanvasRenderingContext2D | null = null

const pointsToRedraw = new Map<string, Coordinate>()

export const drawTemp = (coordinate: Coordinate, temp: number) => {
  const ctx = lastCtx
  if (!ctx) {
    return
  }
  const { x, y } = coordinate
  ctx.fillStyle = getColor(PointType.NonExistentElement, temp)
  ctx.fillRect(x * store.scale, y * store.scale, store.scale, store.scale)
}

export const drawPoint = (coordinate: Coordinate) => {
  const ctx = lastCtx
  if (!ctx) {
    return
  }
  const point = getPointOnCoordinate(coordinate)
  const { x, y } = coordinate
  if (!point) {
    ctx.fillStyle = '#fff'
    ctx.fillRect(x * store.scale, y * store.scale, store.scale, store.scale)
  } else {
    const { type } = point
    ctx.fillStyle = getColor(
      type,
      point.temperature,
      VISIBLE_HUMIDITY[point.type]
        ? point.humidity
        : 0,
    )
    ctx.fillRect(x * store.scale, y * store.scale, store.scale, store.scale)
    if (point.type === PointType.Tree) {
      ctx.fillStyle = '#305b00'
      ctx.fillRect(x * store.scale, y * store.scale, 1, store.scale)
      ctx.fillRect((1 + x) * store.scale - 1, y * store.scale, 1, store.scale)
    }
  }
}

export const redrawPoint = (coordinate: Coordinate) => {
  pointsToRedraw.set(`${coordinate.x}-${coordinate.y}`, coordinate)
  return
}

export const drawDelayed = () => {
  const state = getOrCreateGameState()
  if (state.showTemperature) {
    for (let x = 0; x < state.borders.horizontal; x++) {
      for (let y = 0; y < state.borders.vertical; y++) {
        const point = state.pointsByCoordinate[x][y]
        if (point) {
          drawPoint({ x, y })
        } else {
          drawTemp({ x, y }, state.temperaturesMap[x][y])
        }
      }
    }
  } else {
    pointsToRedraw.forEach((coordinate) => {
      drawPoint(coordinate)
    })
  }
  pointsToRedraw.clear()
}

export function drawInitial(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not get context')
  }
  lastCtx = ctx
  resetCanvasBg(ctx)
  const state = getOrCreateGameState()
  state.points.forEach((point) => {
    if (!point.toBeRemoved) {
      drawPoint(point.coordinate)
    }
  })
}

// @ts-ignore
window.drawInitial = drawInitial
