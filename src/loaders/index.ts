export interface Loadable {
  loaded: boolean
  load: Promise<any>
}