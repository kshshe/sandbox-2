import { redrawPoint } from '../draw'
import { getOrCreateGameState, PointData } from '../gameState'

export const deletePoint = (point: PointData) => {
    const state = getOrCreateGameState()
    try {
        delete state.pointsByCoordinate[point.coordinate.x][point.coordinate.y]
    } catch {}
    point.toBeRemoved = true
    state.processQueue.delete(point)
    redrawPoint(point.coordinate)
}