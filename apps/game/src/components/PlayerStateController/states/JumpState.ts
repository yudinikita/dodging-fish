import Player from '../../Player'

export default class IdleState {
  private player: Player

  constructor(player: Player) {
    this.player = player
  }

  enter() {
    const frameName = this.player.frameName
    const jumpFrame = frameName.slice(0, -1) + 'f'

    this.player.setFrame(jumpFrame)
  }
}
