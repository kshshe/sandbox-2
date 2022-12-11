import { PointType } from '../data'
import { getOrCreateGameState } from '../gameState'
import store from '../interface/store'
import { IMPULSE_TARGET } from '../process/processors/impulseGenerator'
import { getColor } from '../utils/getColor'

const getArrow = (direction: { x: number; y: number }) => {
  const angle = Math.atan2(direction.y, direction.x)
  const angleDeg = (angle * 180) / Math.PI
  return `<div class="arrow-container">
    <div class="arrow" style="transform: rotate(${angleDeg}deg)"></div>
  </div>`
}

const setCursorSize = (cursor: HTMLDivElement) => {
  const state = getOrCreateGameState()
  const size = store.scale * state.brushSize * 2
  cursor.style.color =
    state.currentType === 'Eraser' ? 'black' : getColor(state.currentType)
  cursor.style.height = `${size}px`
  cursor.style.width = `${size}px`
  cursor.style.top = `-${size / 2}px`
  cursor.style.left = `-${size / 2}px`
}

let updateMetaInterval: number | undefined

export const initCursor = (canvas: HTMLCanvasElement) => {
  const cursor = document.querySelector('.cursor') as HTMLDivElement
  const cursorMeta = document.querySelector('.cursor_meta') as HTMLDivElement
  if (!cursor || !cursorMeta) {
    return
  }

  const updateMeta = (x: number, y: number) => {
    const state = getOrCreateGameState()
    const humidity = state.humidityMap[x]?.[y]
    const temperature = state.temperaturesMap[x]?.[y]
    const pointThere = state.pointsByCoordinate[x]?.[y]
  
    cursorMeta.innerHTML = [
      store.processTemperature && temperature && `t: ${temperature.toFixed(0)}°C`,
      store.processHumidity && humidity && `Humidity: ${humidity.toFixed(0)}%`,
      pointThere && `Age: ${pointThere.age}`,
      pointThere?.electricityPower && `Power: ${pointThere.electricityPower.toFixed(2)}`,
      pointThere?.electricityDirection && `Direction: ${getArrow(pointThere.electricityDirection)}`,
      pointThere?.impulseElectricityPower && `Impulse preparing: ${Math.round(100 * pointThere.impulseElectricityPower / IMPULSE_TARGET)}%`,
      pointThere && `Type: ${pointThere.type}`,
      pointThere?.cloningType && `Clones: ${pointThere.cloningType}`,
    ]
    .filter(Boolean)
      .map((line) => `<div>${line}</div>`)
      .join('').trim() || 'Nothing here'
    cursorMeta.style.backgroundColor = getColor(
      PointType.Void,
      temperature,
      0,
      true,
    )
  }

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault()
    const state = getOrCreateGameState()
    if (e.deltaY > 0 && state.brushSize > 1) {
      state.brushSize--
    }
    if (e.deltaY < 0 && state.brushSize < 10) {
      state.brushSize++
    }
    setCursorSize(cursor)
  })
  canvas.addEventListener('mouseover', () => {
    setCursorSize(cursor)
    cursor.classList.add('cursor--active')
  })
  let firstMove = true
  canvas.addEventListener('mouseout', () => {
    firstMove = true
    cursor.classList.remove('cursor--active')
  })
  canvas.addEventListener('mousemove', (e) => {
    if (firstMove) {
      firstMove = false
      setCursorSize(cursor)
      cursor.classList.add('cursor--active')
      return
    }
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cursor.style.transform = `translate(${x}px, ${y}px)`

    const pointX = Math.floor(x / store.scale)
    const pointY = Math.floor(y / store.scale)

    updateMeta(pointX, pointY)
    clearInterval(updateMetaInterval)
    updateMetaInterval = setInterval(() => {
      updateMeta(pointX, pointY)
    }, 300)
  })
}
