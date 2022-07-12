import { getOrCreateGameState } from './gameState'
import { getColor } from './utils/getColor'
import { SCALE } from './constants'

const resetCanvasBg = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function draw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not get context')
  }
  const state = getOrCreateGameState()
  resetCanvasBg(ctx)
  state.points.forEach((point) => {
    const { x, y } = point.coordinate
    const { type } = point
    ctx.fillStyle = getColor(type)
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
  })

  window.requestAnimationFrame(() => draw(canvas))
}
