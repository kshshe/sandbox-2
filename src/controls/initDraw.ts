import { addNewPoint } from '../utils/addNewPoint'
import { SCALE } from '../constants'
import { Coordinate, getOrCreateGameState } from '../gameState'

type Position = { x: number, y: number }

const getCircleCoordinatesInRadius = (
  center: Coordinate,
  radius: number,
): Coordinate[] => {
  const state = getOrCreateGameState()
  const { horizontal, vertical } = state.borders
  const coordinates: Coordinate[] = []
  for (let x = center.x - radius; x <= center.x + radius; x++) {
    const circleWidthOnX = Math.floor(Math.sqrt(radius ** 2 - Math.abs((x - center.x)) ** 2))
    for (let y = center.y - circleWidthOnX; y <= center.y + circleWidthOnX; y++) {
      if (
        x >= 0 &&
        x <= horizontal &&
        y >= 0 &&
        y <= vertical
      ) {
        coordinates.push({ x, y })
      }
    }
  }
  return coordinates
}

const drawNewPoint = (
  canvas: HTMLCanvasElement,
  position: Position,
) => {
  const state = getOrCreateGameState()
  const brushSize = Math.max(state.brushSize, 1)
  const rect = canvas.getBoundingClientRect()
  const relativePosition = {
    x: position.x - rect.left,
    y: position.y - rect.top,
  }
  const x = Math.floor(relativePosition.x / SCALE)
  const y = Math.floor(relativePosition.y / SCALE)
  getCircleCoordinatesInRadius({ x, y }, brushSize).forEach(coordinate => {
    addNewPoint(coordinate)
  })
}

const listen = (
  element: HTMLCanvasElement,
  events: Array<keyof HTMLElementEventMap>,
  callback: (position: Position) => void,
) => {
  events.forEach((event) => {
    console.log(`Adding listener for ${event}`)
    element.addEventListener(event, e => {
      e.preventDefault()
      callback({
        // @ts-ignore
        x: e.clientX || e.touches?.[0]?.clientX, y: e.clientY || e.touches?.[0]?.clientY,
      })
    })
  })
}

const HOLD_ADD_TIMEOUT = 20
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
