import { IllegalArgumentException } from "./exceptions/illegal-argument.exception"

export function requireArgument(condition: boolean, message?: string) {
  if (!condition) throw new IllegalArgumentException(message)
}
