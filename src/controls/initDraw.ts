import { addNewPoint } from '../utils/addNewPoint'
import { SCALE } from '../constants'
import { Coordinate, getOrCreateGameState } from '../gameState'
import { Tools } from '../data';
import { redrawPoint } from '../draw';

type Position = { x: number; y: number }

const getCircleCoordinatesInRadius = (
  center: Coordinate,
  radius: number,
): Coordinate[] => {
  const state = getOrCreateGameState()
  const { horizontal, vertical } = state.borders
  const coordinates: Coordinate[] = []
  for (let x = center.x - radius; x <= center.x + radius; x++) {
    const circleWidthOnX = Math.floor(
      Math.sqrt(radius ** 2 - Math.abs(x - center.x) ** 2),
    )
    for (
      let y = center.y - circleWidthOnX;
      y <= center.y + circleWidthOnX;
      y++
    ) {
      if (x >= 0 && x <= horizontal && y >= 0 && y <= vertical) {
        coordinates.push({ x, y })
      }
    }
  }
  return coordinates
}

const drawNewPoint = (canvas: HTMLCanvasElement, position: Position, forceEraser: boolean = false) => {
  const state = getOrCreateGameState()
  const brushSize = Math.max(state.brushSize, 1)
  const rect = canvas.getBoundingClientRect()
  const relativePosition = {
    x: position.x - rect.left,
    y: position.y - rect.top,
  }
  const x = Math.floor(relativePosition.x / SCALE)
  const y = Math.floor(relativePosition.y / SCALE)
  getCircleCoordinatesInRadius({ x, y }, brushSize - 1).forEach(
    (coordinate) => {
      const tool = state.currentType as Tools
      if (Tools[tool]) {
        const point = state.pointsByCoordinate[coordinate.x][coordinate.y]
        if (point) {
          if (tool === Tools.Cool && !point.fixedTemperature) {
            point.temperature -= 1
          }
          if (tool === Tools.Heat && !point.fixedTemperature) {
            point.temperature += 1
          }
          redrawPoint(coordinate)
        } else {
          if (tool === Tools.Cool) {
            state.temperaturesMap[coordinate.x][coordinate.y] -= 1
          }
          if (tool === Tools.Heat) {
            state.temperaturesMap[coordinate.x][coordinate.y] += 1
          }
        }
      } else {
        addNewPoint(coordinate, forceEraser ? 'Eraser' : undefined)
      }
    },
  )
}

const listen = (
  element: HTMLCanvasElement,
  events: Array<keyof HTMLElementEventMap>,
  callback: (position: Position, e: MouseEvent | TouchEvent) => void,
) => {
  events.forEach((event) => {
    console.log(`Adding listener for ${event}`)
    element.addEventListener(event, (e) => {
      e.preventDefault()
      callback(
        {
          // @ts-ignore
          x: e.clientX || e.touches?.[0]?.clientX,
          // @ts-ignore
          y: e.clientY || e.touches?.[0]?.clientY,
        },
        e as MouseEvent | TouchEvent,
      )
    })
  })
}

const HOLD_ADD_TIMEOUT = 20
export const initDraw = (canvas: HTMLCanvasElement) => {
  let isDragging = false
  let isEraser = false
  let addInterval: number | null = null
  let lastMousePosition = { x: 0, y: 0 }
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
  listen(canvas, ['mouseout'], () => {
    isDragging = false
    if (addInterval) {
      clearInterval(addInterval)
    }
  })
  listen(canvas, ['mousedown', 'touchstart'], (position, event) => {
    if ((event as MouseEvent).button === 2) {
      isEraser = true
    }
    isDragging = true
    lastMousePosition = { ...position }
    if (addInterval) {
      clearInterval(addInterval)
    }
    addInterval = setInterval(() => {
      drawNewPoint(canvas, lastMousePosition, isEraser)
    }, HOLD_ADD_TIMEOUT)
  })
  listen(canvas, ['mouseup', 'touchend'], () => {
    isEraser = false
    isDragging = false
    if (addInterval) {
      clearInterval(addInterval)
    }
  })
  listen(canvas, ['mousemove', 'touchmove'], (position) => {
    if (isDragging) {
      lastMousePosition = { ...position }
      drawNewPoint(canvas, position, isEraser)
    }
  })
}
