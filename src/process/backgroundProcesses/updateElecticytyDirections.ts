import { PointType } from '../../data';
import { GameState, getOrCreateGameState, PointData } from '../../gameState';
import { findNeighbours } from '../utils/findNeighbours';
import { parallelize } from "thread-like";

export const CAN_CONDUCT_ELECTRICITY: Partial<Record<PointType, true>> = {
    [PointType.Metal]: true,
    [PointType.LiquidMetal]: true,
    [PointType.ImpulseGenerator]: true,
}

const getNextNeighbours = (state: GameState, point: PointData) => {
    return findNeighbours(state, point).filter(p => CAN_CONDUCT_ELECTRICITY[p.type] && (p.electricityDirection === undefined || p.isElectricityDirectionOld))
}

export const updateElecticityDirections = parallelize(function* () {
    while (true) {
        const state = getOrCreateGameState()
        const pointsCanConductElectricity = state.points.filter(p => CAN_CONDUCT_ELECTRICITY[p.type])
        for (let i = 0; i < pointsCanConductElectricity.length; i++) {
            const point = pointsCanConductElectricity[i]
            point.isElectricityDirectionOld = true
        }

        const pointsQueue: Array<{
            closestGrounding: PointData
            point: PointData
        }> = []

        const groundings = state.points.filter(p => p.type === PointType.Grounding)

        for (let i = 0; i < groundings.length; i++) {
            const grounding = groundings[i]
            const neighbours = findNeighbours(state, grounding).filter(p => CAN_CONDUCT_ELECTRICITY[p.type])

            for (let j = 0; j < neighbours.length; j++) {
                const neighbour = neighbours[j]
                const directionToGrounding = {
                    x: grounding.coordinate.x - neighbour.coordinate.x,
                    y: grounding.coordinate.y - neighbour.coordinate.y,
                }
                neighbour.electricityDirection = directionToGrounding
                neighbour.isElectricityDirectionOld = false
                const nextNeighbours = getNextNeighbours(state, neighbour)
                for (let k = 0; k < nextNeighbours.length; k++) {
                    pointsQueue.push({
                        closestGrounding: neighbour,
                        point: nextNeighbours[k],
                    })
                }
            }

            yield
        }

        for (const {
            point,
            closestGrounding
        } of pointsQueue) {
            if (point.electricityDirection && !point.isElectricityDirectionOld) {
                continue
            }
            const directionToGrounding = {
                x: closestGrounding.coordinate.x - point.coordinate.x,
                y: closestGrounding.coordinate.y - point.coordinate.y,
            }
            point.electricityDirection = directionToGrounding
            point.isElectricityDirectionOld = false
            const nextNeighbours = getNextNeighbours(state, point)
            for (let k = 0; k < nextNeighbours.length; k++) {
                pointsQueue.push({
                    closestGrounding: point,
                    point: nextNeighbours[k],
                })
            }

            yield
        }

        state.points
            .filter(point => CAN_CONDUCT_ELECTRICITY[point.type] && point.isElectricityDirectionOld)
            .forEach(point => {
                point.electricityDirection = undefined
                point.isElectricityDirectionOld = false
            })

        yield
    }
})