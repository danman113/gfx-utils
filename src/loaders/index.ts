export interface Loadable {
  loaded: boolean
  load: Promise<any>
}

export * from './image'
export * from './sound'