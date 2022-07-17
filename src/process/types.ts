import { GameState, PointData } from '../gameState'

export enum RequestedAction {
  None,
  MoveDown = 'MoveDown',
  MoveLeft = 'MoveLeft',
  MoveRight = 'MoveRight',
  MoveLeftDown = 'MoveLeftDown',
  MoveRightDown = 'MoveRightDown',
  MoveLeftLeftDown = 'MoveLeftLeftDown',
  MoveRightRightDown = 'MoveRightRightDown',
  MoveRightUp = 'MoveRightUp',
  MoveLeftUp = 'MoveLeftUp',
  MoveUp = 'MoveUp',
  Freeze = 'Freeze',
  Melt = 'Melt',
  Die = 'Die',
}

export type Processor = (state: GameState, point: PointData, tick: number) => RequestedAction
