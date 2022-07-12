import {getOrCreateGameState} from '../gameState'

export const setBorders = (
    horizontal: number,
    vertical: number,
) => {
    const state = getOrCreateGameState()
    console.log(`Borders: ${Math.floor(horizontal)}x${Math.floor(vertical)}`)
    state.borders = {
        horizontal: Math.floor(horizontal),
        vertical:  Math.floor(vertical),
    }
}