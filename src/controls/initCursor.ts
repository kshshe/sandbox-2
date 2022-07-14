import { SCALE } from "../constants"
import { getOrCreateGameState } from "../gameState"

const setCursorSize = (cursor: HTMLDivElement) => {
    const state = getOrCreateGameState()
    const size = SCALE * state.brushSize * 2
    cursor.style.height = `${size}px`
    cursor.style.width = `${size}px`
    cursor.style.top = `-${size/2}px`
    cursor.style.left = `-${size/2}px`
}

export const initCursor = (canvas: HTMLCanvasElement) => {
    const cursor = document.querySelector('.cursor') as HTMLDivElement
    if (!cursor) {
        return
    }
    canvas.addEventListener('wheel', e => {
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
    canvas.addEventListener('mousemove', e => {
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
    })
}