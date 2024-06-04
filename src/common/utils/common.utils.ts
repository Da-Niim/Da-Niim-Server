import { Constructor } from "../type"

export function createInstance<T>(ctor: Constructor<T>, ...args: any[]): T {
  return new ctor(...args)
}
