import Player from '../../Player'

export default class IdleState {
  private player: Player

  constructor(player: Player) {
    this.player = player
  }

  enter() {
    this.player.setFrame('fish_001a')
  }
}
