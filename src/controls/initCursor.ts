import { SCALE } from '../constants'
import { PointType } from '../data'
import { getOrCreateGameState } from '../gameState'
import { getColor } from '../utils/getColor'

const setCursorSize = (cursor: HTMLDivElement) => {
  const state = getOrCreateGameState()
  const size = SCALE * state.brushSize * 2
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
    if (humidity !== undefined && temperature !== undefined) {
      cursorMeta.innerText = `${temperature.toFixed(0)}°C, ${humidity.toFixed(0)}%`
      cursorMeta.style.backgroundColor = getColor(PointType.Void, temperature, 0, true)
    } else {
      cursorMeta.innerText = ''
    }
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

    const pointX = Math.floor(x / SCALE)
    const pointY = Math.floor(y / SCALE)

    updateMeta(pointX, pointY)
    clearInterval(updateMetaInterval)
    updateMetaInterval = setInterval(() => {
      updateMeta(pointX, pointY)
    }, 300)
  })
}
