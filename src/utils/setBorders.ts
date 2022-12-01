import {getOrCreateGameState} from '../gameState'

export const setBorders = (
    horizontal: number,
    vertical: number,
) => {
    const state = getOrCreateGameState()
    state.borders = {
        horizontal: Math.floor(horizontal),
        vertical:  Math.floor(vertical),
    }
    for (let x = 0; x < state.borders.horizontal; x++) {
        if (!state.pointsByCoordinate[x]) {
            state.pointsByCoordinate[x] = []
        }
    }
}