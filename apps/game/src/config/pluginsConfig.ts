import { FloatingNumbersPlugin } from '@/plugins/FloatingNumbers'

const plugins = {
  scene: [
    {
      key: 'floatingNumbers',
      plugin: FloatingNumbersPlugin,
      sceneKey: 'floatingNumbers',
      mapping: 'floatingNumbers',
      systemKey: 'floatingNumbers',
    },
  ],
}

export default plugins
