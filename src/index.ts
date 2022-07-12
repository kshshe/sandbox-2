import { getOrCreateGameState, PointType } from './gameState'
import { setBorders } from './utils/setBorders'
import { startEngine } from './process'
import { SCALE } from './constants'
import { drawInitial } from './draw'
import { initControls } from './controls/initControls'
import { getColor } from './utils/getColor'

const init = () => {
  const root = document.getElementById('root')
  const controls = document.querySelector('.controls')
  if (!root) {
    throw new Error('Root element not found')
  }
  if (!controls) {
    throw new Error('Controls element not found')
  }
  const proportions = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
  const canvas = document.createElement('canvas')
  canvas.width = proportions.width
  canvas.height = proportions.height
  root.appendChild(canvas)

  Object.values(PointType).forEach((type) => {
    const button = document.createElement('button')
    button.classList.add('control')
    button.classList.add(`control--${type}`)
    button.style.backgroundColor = getColor(type)
    button.addEventListener('click', () => {
      const state = getOrCreateGameState()
      state.currentType = type
    })
    controls.appendChild(button)
  })

  setBorders(proportions.width / SCALE, proportions.height / SCALE)

  initControls(canvas)

  // @ts-ignore
  window.gameState = getOrCreateGameState()

  drawInitial(canvas)
  startEngine()
}

window.addEventListener('load', init)
