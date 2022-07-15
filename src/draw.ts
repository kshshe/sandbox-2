import { Coordinate, getOrCreateGameState } from './gameState'
import { getColor } from './utils/getColor'
import { debug, SCALE } from './constants'
import { getPointOnCoordinate } from './utils/getPointOnCoordinate'
import { getCoordinateKey } from './utils/getCoordinateKey'
import { PointType } from './data'

const resetCanvasBg = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

let lastCtx: CanvasRenderingContext2D | null = null

const pointsToRedraw = new Map<string, Coordinate>()

export const drawPoint = (coordinate: Coordinate) => {
  const ctx = lastCtx
  if (!ctx) {
    return
  }
  const point = getPointOnCoordinate(coordinate)
  const { x, y } = coordinate
  if (!point) {
    if (debug) {
      ctx.fillText('', x * SCALE, (y + 1) * SCALE)
    }
    ctx.fillStyle = '#fff'
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
  } else {
    const { type } = point
    ctx.fillStyle = getColor(
      type,
      point.temperature,
      [PointType.Sand, PointType.Tree].includes(point.type)
        ? point.humidity
        : 0,
    )
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
    if (point.type === PointType.Tree) {
      ctx.fillStyle = '#305b00'
      ctx.fillRect(x * SCALE, y * SCALE, 1, SCALE)
      ctx.fillRect((1+ x)* SCALE - 1, y * SCALE, 1, SCALE)
    }
    if (debug) {
      ctx.fillText('', x * SCALE, (y + 1) * SCALE)
      ctx.fillStyle = '#000'
      ctx.font = '7px Arial'
      ctx.fillText(
        `${Math.round(point.temperature)}`,
        x * SCALE,
        (y + 1) * SCALE,
      )
    }
  }
}

export const redrawPoint = (coordinate: Coordinate) => {
  const coordinateKey = getCoordinateKey(coordinate)
  pointsToRedraw.set(coordinateKey, coordinate)
  return
}

export const drawDelayed = () => {
  pointsToRedraw.forEach((coordinate) => {
    drawPoint(coordinate)
  })
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
