import { types } from 'mobx-state-tree';
import { DEFAULT_SCALE } from '../constants';

const gameStateModel = types.model({
    brushSize: types.number,
    baseTemperature: types.number,
    freeBorders: types.boolean,
    showTemperature: types.boolean,
    speed: types.number,
    pause: types.boolean,
    dynamicWater: types.boolean,
    scale: types.number,
    isDrawing: types.boolean,
}).actions(self => ({
    setProperty(key, value) {
        localStorage.setItem(key, `${value}`)
        self[key] = value
    }
}))

const storedScale = localStorage.getItem('scale')

export const INITIAL_STATE = {
    brushSize: 3,
    baseTemperature: 5,
    speed: 5,
    freeBorders: false,
    showTemperature: false,
    pause: false,
    isDrawing: false,
    dynamicWater: false,
    scale: DEFAULT_SCALE,
}

export default gameStateModel.create({
    ...INITIAL_STATE,
    dynamicWater: localStorage.getItem('dynamicWater') === 'true',
    scale: storedScale ? parseInt(storedScale) : DEFAULT_SCALE,
})