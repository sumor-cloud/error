import getI18n from '@sumor/i18n'
import type from './type.js'

export default options => {
  const code = options.code || {}
  const i18nConfig = options.i18n || {}
  const language = options.language || 'en'
  i18nConfig.origin = Object.assign({}, code, i18nConfig.origin)

  return class SumorError extends Error {
    constructor(code, data, errors) {
      super()
      this.name = 'SumorError'
      this.code = code
      this._language = language
      this.errors = []
      if (errors) {
        if (errors instanceof Error) {
          this.errors = [errors]
        } else if (errors instanceof Array) {
          for (const error of errors) {
            if (error instanceof Error) {
              this.errors.push(error)
            }
          }
        }
      }
      if (type(data) === 'object') {
        this.data = data
      } else {
        this.data = {}
      }
    }

    set message(message) {
      throw new Error('message is readonly, please use code and data to set message.')
    }

    get message() {
      const i18n = getI18n(this.language, i18nConfig)
      return i18n(this.code, this.data)
    }

    get language() {
      return this._language
    }

    set language(val) {
      this._language = val || language
      for (const error of this.errors) {
        if (error.name === 'SumorError') {
          error.language = val
        }
      }
    }

    json() {
      const errors = this.errors.map(error => {
        if (error.name === 'SumorError') {
          return error.json()
        } else {
          return {
            code: error.code || 'UNKNOWN_ERROR',
            message: error.message
          }
        }
      })
      const result = {
        code: this.code,
        message: this.message
      }
      if (errors.length > 0) {
        result.errors = errors
      }
      return result
    }
  }
}
