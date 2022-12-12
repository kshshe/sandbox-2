import { Processor, RequestedAction } from '../types'
import { metalProcessor } from './metal'
import { waterProcessor } from './water'

export const liquidMetalProcessor: Processor = (state, point, tick) => {
  if (point.temperature < 600) {
    return RequestedAction.Freeze
  }

  const metalAction = metalProcessor(state, point, tick)
  const action = waterProcessor(state, {
    ...point,
    temperature: 5,
  }, tick)
  if (metalAction === RequestedAction.None && action === RequestedAction.None) {
    return RequestedAction.None
  }
  return action === RequestedAction.None ? RequestedAction.NoneButContinue : action
}
