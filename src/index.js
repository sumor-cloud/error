// import getI18n from '@sumor/i18n'
import type from './type.js'

export default options => {
  const name = options.name || 'SumorError'
  return class SumorError extends Error {
    constructor(code, data) {
      super()
      this.name = name
      this.code = code
      if (type(data) === 'object') {
        this.data = data
      } else {
        this.data = {}
      }
    }
  }
}
