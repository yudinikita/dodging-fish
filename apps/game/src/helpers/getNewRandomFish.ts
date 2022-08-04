import Phaser from 'phaser'
import constants from '@/constants'

export default function getNewRandomFish(playerFishes: string[]): string {
  const allFishes = getAllFishes()

  const availableFishes = allFishes.filter(
    (fish) => !playerFishes.includes(fish)
  )

  return Phaser.Utils.Array.GetRandom(availableFishes)
}

const getAllFishes = () => {
  const allFishes = []

  if (allFishes.length === 0) {
    for (let index = 1; index <= constants.FISH.COUNT; index++) {
      const frameIndex = Phaser.Utils.String.Pad(index, 2, '0', 1)
      const fish = `fish_${frameIndex}a`

      allFishes.push(fish)
    }
  }

  return allFishes
}
