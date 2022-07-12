import { addNewPoint } from '../utils/addNewPoint'
import { SCALE } from '../constants'

type Position = { x: number, y: number }

const drawNewPoint = (
  canvas: HTMLCanvasElement,
  position: Position,
) => {
  const rect = canvas.getBoundingClientRect()
  const relativePosition = {
    x: position.x - rect.left,
    y: position.y - rect.top,
  }
  const x = Math.floor(relativePosition.x / SCALE)
  const y = Math.floor(relativePosition.y / SCALE)
  addNewPoint({ x, y })
}

const listen = (
  element: HTMLCanvasElement,
  events: Array<keyof HTMLElementEventMap>,
  callback: (position: Position) => void,
) => {
  events.forEach((event) => {
    console.log(`Adding listener for ${event}`)
    element.addEventListener(event, e => {
      callback({
        // @ts-ignore
        x: e.clientX || e.touches?.[0]?.clientX, y: e.clientY || e.touches?.[0]?.clientY,
      })
    })
  })
}

const HOLD_ADD_TIMEOUT = 50
export const initDraw = (canvas: HTMLCanvasElement) => {
  let isDragging = false
  let addInterval: number | null = null
  let lastMousePosition = { x: 0, y: 0 }
  listen(canvas, ['mousedown', 'touchstart'], (position) => {
    isDragging = true
    lastMousePosition = { ...position }
    if (addInterval) {
      clearInterval(addInterval)
    }
    addInterval = setInterval(() => {
      drawNewPoint(canvas, lastMousePosition)
    }, HOLD_ADD_TIMEOUT)
  })
  listen(canvas, ['mouseup', 'touchend'], () => {
    isDragging = false
    if (addInterval) {
      clearInterval(addInterval)
    }
  })
  listen(canvas, ['mousemove', 'touchmove'], (position) => {
    if (isDragging) {
      lastMousePosition = { ...position }
      drawNewPoint(canvas, position)
    }
  })
}
