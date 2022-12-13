import { Instance, types } from 'mobx-state-tree';
import { DEFAULT_SCALE } from '../constants';

const gameStateModel = types.model({
    brushSize: types.number,
    baseTemperature: types.number,
    baseHumidity: types.number,
    freeBorders: types.boolean,
    showTemperature: types.boolean,
    showTemperaturePercent: types.number,
    speed: types.number,
    pause: types.boolean,
    processTemperature: types.boolean,
    processHumidity: types.boolean,
    scale: types.number,
    isDrawing: types.boolean,
    showMoreSettings: types.boolean,
    debug: types.boolean,
}).actions(self => ({
    setProperty(key: keyof IGameStateModel, value: any, noDependents?: boolean) {
        localStorage.setItem(String(key), `${value}`)
        self[key] = value
        if (key === 'showTemperaturePercent' && !noDependents) {
            this.setProperty('showTemperature', value > 0, true)
        }
        if (key === 'showTemperature' && !noDependents) {
            this.setProperty('showTemperaturePercent', value ? 50 : 0, true)
        }
    }
}))

type IGameStateModel = Instance<typeof gameStateModel>

const storedScale = localStorage.getItem('scale')
const storedProcessHumidity = localStorage.getItem('processHumidity')
const storedProcessTemperature = localStorage.getItem('processTemperature')
const storedBaseHumidity = localStorage.getItem('baseHumidity')
const storedShowTemperaturePercent = localStorage.getItem('showTemperaturePercent')

export const INITIAL_STATE = {
    brushSize: 3,
    baseTemperature: 5,
    baseHumidity: 3,
    speed: 5,
    freeBorders: false,
    showTemperature: false,
    pause: false,
    isDrawing: false,
    scale: DEFAULT_SCALE,
    debug: false,
    showTemperaturePercent: 0
}

export default gameStateModel.create({
    ...INITIAL_STATE,
    showTemperature: storedShowTemperaturePercent && +storedShowTemperaturePercent > 0,
    baseHumidity: storedBaseHumidity ? +storedBaseHumidity : INITIAL_STATE.baseHumidity,
    processTemperature: storedProcessTemperature === null ? true : storedProcessTemperature === 'true',
    processHumidity: storedProcessHumidity === null ? false : storedProcessHumidity === 'true',
    scale: storedScale ? parseInt(storedScale) : DEFAULT_SCALE,
    showMoreSettings: localStorage.getItem('showMoreSettings') === 'true',
    debug: localStorage.getItem('debug') === 'true',
    showTemperaturePercent: storedShowTemperaturePercent ? +storedShowTemperaturePercent : INITIAL_STATE.showTemperaturePercent,
})