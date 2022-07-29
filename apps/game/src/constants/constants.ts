const DEBUG = true

const SCALE = 1

const width = 375
const height = 667

const constants = {
  SCALE,
  WIDTH: width * SCALE,
  HEIGHT: height * SCALE,
  DEBUG,
  FONT: {
    FAMILY: '"Noto Sans", sans-serif',
    COLOR: '#ffffff',
  },
  CURSOR: {
    DEFAULT: 'url(assets/cursors/default.cur), default',
    POINTER: 'url(assets/cursors/pointer.cur), pointer',
  },
  SCENES: {
    LOADING: 'loading-scene',
    MAIN_MENU: 'main-menu-scene',
  },
  SPIKE: {
    WIDTH: 42,
    HEIGHT: 22,
  },
}

export default constants
