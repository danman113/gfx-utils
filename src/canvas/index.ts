import { vec2 } from 'gl-matrix'

export interface Mouse {
  x: number
  y: number
  position: vec2
  buttons: boolean[]
  buttonsClicked: boolean[]
  touches: Map<Number, Touch>
  action: boolean
  clicked: boolean
  wheelDeltaX: number
  wheelDeltaY: number
}

export const createCanvas = (parent: HTMLElement = document.body): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  parent.appendChild(canvas)
  return canvas
}

export const setCanvasDimensions = (
  element: HTMLCanvasElement,
  maxWidth: number,
  maxHeight: number,
  highDPI: boolean = false
) => {
  const dpi = highDPI ? window.devicePixelRatio : 1
  element.width = maxWidth * dpi
  element.height = maxHeight * dpi
  element.style.width = String(maxWidth) + 'px'
  element.style.height = String(maxHeight) + 'px'
}

const getWindowDimensions = (highDPI: boolean = false) => {
  const dpi = highDPI ? window.devicePixelRatio : 1
  let width = window.innerWidth * dpi
  let height = window.innerHeight * dpi
  return [width, height]
}

export const fullscreenCanvas = (
  element: HTMLCanvasElement,
  hook: (e: UIEvent) => void = () => {},
  highDPI: boolean = false,
) => {
  let dimensions = getWindowDimensions(highDPI)
  setCanvasDimensions(element, dimensions[0], dimensions[1], highDPI)

  window.addEventListener('resize', (e) => {
    dimensions = getWindowDimensions(highDPI)
    setCanvasDimensions(element, dimensions[0], dimensions[1], highDPI)
    hook(e)
  })
  return () => dimensions
}

export const setupMouseHandlers = (element: HTMLCanvasElement): (() => Mouse) => {
  let wheelDeltaX: number
  let wheelDeltaY: number
  const mouse: Mouse = {
    x: 0,
    y: 0,
    position: vec2.create(),
    buttons: [],
    buttonsClicked: [],
    touches: new Map(),
    action: false,
    clicked: false,
    wheelDeltaX: 0,
    wheelDeltaY: 0,
  }

  let clickedThisPoll = false
  let downThisPoll = false
  element.addEventListener('mousemove', (e) => {
    if (e.offsetX || e.offsetY) {
      mouse.x = e.offsetX
      mouse.y = e.offsetY
      mouse.position[0] = mouse.x
      mouse.position[1] = mouse.y
    }
  })

  element.addEventListener('mousedown', (e) => {
    mouse.buttons[e.button] = true
    downThisPoll = true
  })

  element.addEventListener('mouseup', (e) => {
    mouse.buttons[e.button] = false
    mouse.buttonsClicked[e.button] = true
    clickedThisPoll = true
  })

  element.addEventListener('mouseleave', (e) => {
    mouse.buttons.length = 0
    mouse.buttonsClicked.length = 0
  })

  element.addEventListener('mouseout', (e) => {
    mouse.buttons.length = 0
    mouse.buttonsClicked.length = 0
  })

  element.addEventListener('blur', (e) => {
    mouse.buttons.length = 0
    mouse.buttonsClicked.length = 0
  })

  element.addEventListener('wheel', (e) => {
    e.preventDefault()
    // This fixes an issue with firefox, as deltaX is in page units, rather than pixels
    let browserOffset = e.deltaMode === 1 ? 125 / 3 : 1
    wheelDeltaX = e.deltaX * browserOffset
    wheelDeltaY = e.deltaY * browserOffset
  })

  element.addEventListener('touchstart', (e) => {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      downThisPoll = true
      mouse.touches.set(touch.identifier, touch)
    }
  })

  element.addEventListener('touchmove', (e) => {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      mouse.touches.set(touch.identifier, touch)
    }
  })

  element.addEventListener('touchcancel', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      mouse.touches.delete(touch.identifier)
      clickedThisPoll = true
      mouse.buttons[0] = false
      mouse.buttonsClicked[0] = false
    }
  })

  element.addEventListener('touchend', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      mouse.touches.delete(touch.identifier)
      clickedThisPoll = true
      mouse.buttons[0] = false
      mouse.buttonsClicked[0] = true
    }
  })

  element.addEventListener('contextmenu', (e) => e.preventDefault())
  element.addEventListener('dragenter', (e) => e.preventDefault())

  const poll = () => {
    for (let [_, touch] of mouse.touches) {
      mouse.x = touch.clientX
      mouse.y = touch.clientY
      mouse.position[0] = mouse.x
      mouse.position[1] = mouse.y
      mouse.buttons[0] = true
    }

    if (!clickedThisPoll && mouse.buttonsClicked) mouse.buttonsClicked.length = 0
    mouse.clicked = clickedThisPoll
    mouse.action = downThisPoll
    mouse.wheelDeltaX = wheelDeltaX
    mouse.wheelDeltaY = wheelDeltaY
    wheelDeltaX = 0
    wheelDeltaY = 0
    clickedThisPoll = false
    downThisPoll = false
    return mouse
  }
  return poll
}

export type KeySet = Set<string>
export interface KeyPollReturnType {
  pressed: KeySet
  held: KeySet
  up: KeySet
}
export type KeyCallback = (n: string) => void
export const setupKeyboardHandler = (
  element: HTMLCanvasElement | Window,
  onKeyDown?: KeyCallback,
  onKeyUp?: KeyCallback,
  tabIndex: number = 1
): (() => KeyPollReturnType) => {
  const pressed: KeySet = new Set()
  const held: KeySet = new Set()
  const up: KeySet = new Set()
  if (element instanceof HTMLCanvasElement) {
    (element as HTMLCanvasElement).tabIndex = tabIndex
  }
  element.addEventListener('keydown', (e: Event) => {
    e.preventDefault()
    const { code: key } = e as KeyboardEvent
    pressed.add(key)
    held.add(key)
    if (onKeyDown) onKeyDown(key)
  })

  element.addEventListener('keyup', (e) => {
    e.preventDefault()
    const { code: key } = e as KeyboardEvent
    held.delete(key)
    up.add(key)
    if (onKeyUp) onKeyUp(key)
  })

  const poll = () => {
    // @perf reduce allocations here with same API?
    const ret = {
      pressed: new Set(pressed),
      held: new Set(held),
      up: new Set(up),
    }

    pressed.clear()
    up.clear()
    return ret
  }
  return poll
}

export const MAX_FRAME_TIME = 5
export const draw = (cb: (dt: number) => void, fps: number = 60) => {
  let then = 0
  const fpsQuotient = 1000 / fps
  const func = (now: number = 0) => {
    const dt = Math.min((now - then) / fpsQuotient, MAX_FRAME_TIME)
    then = now
    cb(dt)
    window.requestAnimationFrame(func)
  }
  return func
}
