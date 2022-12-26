export interface Loadable {
  loaded: boolean | null
  load: Promise<any>
}

export * from './image'
export * from './sound'