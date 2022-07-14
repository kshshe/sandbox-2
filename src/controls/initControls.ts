import { initDraw } from './initDraw'
import { initCursor } from './initCursor'

export const initControls = (canvas: HTMLCanvasElement) => {
    initDraw(canvas)
    initCursor(canvas)
}
