import { Rectangle } from './math/collision/rectangle'

export const align = <T extends Rectangle>(
  box: T,
  container: Rectangle,
  percentageX: number = 0,
  percentageY: number = 0
): T => {
  box.x = container.width * percentageX - box.width * percentageX
  box.y = container.height * percentageY - box.height * percentageY
  return box
}

export enum Breakpoint {
  small = 800,
  medium = 1100,
  large = 1366,
}

export const isInBreakpoint = (width: number, bp: Breakpoint) => width < bp
export const isSmall = (width: number) => isInBreakpoint(width, Breakpoint.small)
export const isMedium = (width: number) => isInBreakpoint(width, Breakpoint.medium)
export const isLarge = (width: number) => isInBreakpoint(width, Breakpoint.large)
