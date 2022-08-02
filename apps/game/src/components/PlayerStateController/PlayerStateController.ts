import Player from '../Player'
import IdleState from './states/IdleState'
import JumpState from './states/JumpState'

export type PlayerStateType = 'idle' | 'jump'

export default class PlayerStateController {
  private states: { [key: string]: { enter: () => void } }

  private currentState = { enter: () => {} }

  constructor(player: Player) {
    this.states = {
      idle: new IdleState(player),
      jump: new JumpState(player),
    }
  }

  setState(name: PlayerStateType) {
    if (this.currentState === this.states[name]) {
      return
    }

    this.currentState = this.states[name]
    this.currentState.enter()
  }
}
