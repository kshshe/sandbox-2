import { Coordinate, getOrCreateGameState } from './gameState'
import { getColor } from './utils/getColor'
import { SCALE } from './constants'
import { getPointOnCoordinate } from './utils/getPointOnCoordinate'
import { PointType, VISIBLE_HUMIDITY } from './data'

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
  ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
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
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
  } else {
    const { type } = point
    ctx.fillStyle = getColor(
      type,
      point.temperature,
      VISIBLE_HUMIDITY[point.type]
        ? point.humidity
        : 0,
    )
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
    if (point.type === PointType.Tree) {
      ctx.fillStyle = '#305b00'
      ctx.fillRect(x * SCALE, y * SCALE, 1, SCALE)
      ctx.fillRect((1 + x) * SCALE - 1, y * SCALE, 1, SCALE)
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
    drawPoint(point.coordinate)
  })
}

// @ts-ignore
window.drawInitial = drawInitial
