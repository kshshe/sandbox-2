import { types } from 'mobx-state-tree';

const gameStateModel = types.model({
    brushSize: types.number,
    baseTemperature: types.number,
    freeBorders: types.boolean,
    showTemperature: types.boolean,
    speed: types.number,
    pause: types.boolean,
}).actions(self => ({
    setProperty(key, value) {
        self[key] = value
    }
}))

export default gameStateModel.create({
    brushSize: 3,
    baseTemperature: 5,
    speed: 5,
    freeBorders: false,
    showTemperature: false,
    pause: false,
})