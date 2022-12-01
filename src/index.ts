import {
  getOrCreateGameState,
  resetState,
  restoreSavedState,
} from './gameState'
import { setBorders } from './utils/setBorders'
import { startEngine } from './process'
import { drawInitial } from './draw'
import { initControls } from './controls/initControls'
import { getColor } from './utils/getColor'
import { CONTROLLED_POINT_TYPES_BASE, CONTROLLED_POINT_TYPES_MORE, PointType, Tools } from './data'
import './interface/index'
import { autorun } from 'mobx'
import store from './interface/store'
import '@picocss/pico/css/pico.css'

type Divider = {divider: string}

const init = async () => {
  const root = document.getElementById('root')
  const controls = document.querySelector('.controls')
  const types = document.querySelector('.types')
  if (!root) {
    throw new Error('Root element not found')
  }
  if (!controls) {
    throw new Error('Controls element not found')
  }
  if (!types) {
    throw new Error('Types element not found')
  }
  const canvas = document.createElement('canvas')
  autorun(() => {
    if (!store.showTemperature) {
      drawInitial(canvas)
    }
  })
  const setCanvasSize = () => {
    const proportions = {
      width: window.innerWidth - 10,
      height: window.innerHeight - 10,
    }
    canvas.width = proportions.width
    canvas.height = proportions.height
    setBorders(proportions.width / store.scale, proportions.height / store.scale)
    drawInitial(canvas)
  }
  autorun(() => {
    if (store.scale) {
      setCanvasSize()
      const gameState = getOrCreateGameState()
      gameState.points = gameState.points.filter(point => {
        return (
          point.coordinate.x < gameState.borders.horizontal &&
          point.coordinate.y < gameState.borders.vertical
        )
      })
      gameState.pointsByCoordinate.length = gameState.borders.horizontal
      gameState.pointsByCoordinate.forEach(row => {
        row.length = gameState.borders.vertical
      })
    }
  })
  setCanvasSize()
  window.addEventListener('resize', setCanvasSize)
  root.appendChild(canvas)

  const state = getOrCreateGameState()

  const controlTypes = [
    {divider: 'Main'},
    ...CONTROLLED_POINT_TYPES_BASE,
    'Eraser',
    {divider: 'Tools'},
    ...Object.values(Tools),
    ...CONTROLLED_POINT_TYPES_MORE,
  ] as Array<PointType | 'Eraser' | Tools | Divider>
  controlTypes.forEach((type) => {
    if ((type as Divider).divider) {
      const dividerElement = document.createElement('div')
      dividerElement.classList.add('divider')
      dividerElement.innerText = (type as Divider).divider
      types.appendChild(dividerElement)
      return
    }
    const button = document.createElement('button')
    button.classList.add('type')
    if (state.currentType === type) {
      button.classList.add('type--selected')
    }
    button.classList.add(`type--${type}`)
    button.style.backgroundColor = type === 'Eraser' ? 'white' : getColor(type as PointType | Tools);
    button.innerText = type as string;
    button.title = type as string;
    button.addEventListener('click', () => {
      const state = getOrCreateGameState()
      document.querySelectorAll('.type').forEach((control) => {
        control.classList.remove('type--selected')
      })
      button.classList.add('type--selected')
      state.currentType = type as PointType | Tools | 'Eraser'
    })
    types.appendChild(button)
  })

  const resetButton = document.createElement('button')
  resetButton.innerText = 'reset'
  resetButton.addEventListener('click', () => {
    resetState()
    setCanvasSize()
    drawInitial(canvas)
  })
  controls.appendChild(resetButton)

  initControls(canvas)

  // @ts-ignore
  window.gameState = state

  restoreSavedState()
  drawInitial(canvas)
  startEngine()
}

window.addEventListener('load', init)
