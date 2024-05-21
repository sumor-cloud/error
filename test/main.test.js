import { describe, expect, it } from '@jest/globals'
import defineError from '../src/index.js'

describe('main', () => {
  it('error name code data', () => {
    const Error1 = defineError({})
    const error = new Error1('code')
    // expect(error.name).toEqual('DemoError')
    expect(error.code).toEqual('code')
    expect(error.data).toEqual({})

    const Error2 = defineError({})
    const error2 = new Error2('code')
    // expect(error2.name).toEqual('SumorError')
    expect(error2.code).toEqual('code')
    expect(error2.data).toEqual({})
  })
  it('wrong data', () => {
    const Error1 = defineError({})
    const error1 = new Error1('code', 'data')
    expect(error1.data).toEqual({})
    const error2 = new Error1('code', { data: 'data' })
    expect(error2.data).toEqual({ data: 'data' })
    const error3 = new Error1('code', function () {})
    expect(error3.data).toEqual({})
    const error4 = new Error1('code', [])
    expect(error4.data).toEqual({})
    const error5 = new Error1('code', null)
    expect(error5.data).toEqual({})
    const error6 = new Error1('code', /./)
    expect(error6.data).toEqual({})
  })
  it('define error', () => {
    const MyError = defineError({
      code: {
        USER_NOT_FOUND: 'User not found',
        USER_EXISTED: 'User {name} existed'
      }
    })

    const error1 = new MyError('USER_NOT_FOUND')
    expect(error1.code).toEqual('USER_NOT_FOUND')
    expect(error1.message).toEqual('User not found')
    expect(error1.data).toEqual({})

    const error2 = new MyError('USER_EXISTED', { name: 'Alice' })
    expect(error2.code).toEqual('USER_EXISTED')
    expect(error2.message).toEqual('User Alice existed')
    expect(error2.data).toEqual({ name: 'Alice' })
  })
  it('Multi-language', () => {
    const MyError = defineError({
      language: 'en', // default language
      code: {
        USER_NOT_FOUND: 'User not found',
        USER_EXISTED: 'User {name} existed'
      },
      i18n: {
        zh: {
          USER_NOT_FOUND: '用户未找到',
          USER_EXISTED: '用户 {name} 已存在'
        }
      }
    })

    const error = new MyError('USER_EXISTED', { name: 'Alice' })
    error.language = 'en' // change Error language
    expect(error.message).toEqual('User Alice existed')

    error.language = 'zh' // change Error language
    expect(error.message).toEqual('用户 Alice 已存在')
  })
  it('Convert Error to JSON', () => {
    const MyError = defineError({
      code: {
        USER_NOT_FOUND: 'User not found',
        USER_EXISTED: 'User {name} existed'
      }
    })

    const error = new MyError('USER_EXISTED', { name: 'Alice' })
    expect(error.json()).toEqual({ code: 'USER_EXISTED', message: 'User Alice existed' })
  })
  it('Underlying Error', () => {
    const MyError = defineError({
      code: {
        FIELD_VERIFY_FAILED: 'Field verify failed',
        FIELD_CANNOT_EMPTY: 'Field {name} cannot be empty',
        FIELD_TOO_LONG: 'Field {name} is too long'
      }
    })

    const error = new MyError('FIELD_VERIFY_FAILED', {}, [
      new MyError('FIELD_CANNOT_EMPTY', { name: 'username' }),
      new MyError('FIELD_TOO_LONG', { name: 'password' })
    ])

    expect(error.json()).toEqual({
      code: 'FIELD_VERIFY_FAILED',
      message: 'Field verify failed',
      errors: [
        {
          code: 'FIELD_CANNOT_EMPTY',
          message: 'Field username cannot be empty'
        },
        {
          code: 'FIELD_TOO_LONG',
          message: 'Field password is too long'
        }
      ]
    })
  })
  it('Combine Standard Error', () => {
    const MyError = defineError({
      code: {
        FIELD_VERIFY_FAILED: 'Field verify failed',
        FIELD_CANNOT_EMPTY: 'Field {name} cannot be empty',
        FIELD_TOO_LONG: 'Field {name} is too long'
      }
    })

    const error = new MyError('FIELD_VERIFY_FAILED', {}, [
      new MyError('FIELD_CANNOT_EMPTY', { name: 'username' }),
      new MyError('FIELD_TOO_LONG', { name: 'password' }),
      new Error('Unknown Error')
    ])

    expect(error.json()).toEqual({
      code: 'FIELD_VERIFY_FAILED',
      message: 'Field verify failed',
      errors: [
        {
          code: 'FIELD_CANNOT_EMPTY',
          message: 'Field username cannot be empty'
        },
        {
          code: 'FIELD_TOO_LONG',
          message: 'Field password is too long'
        },
        {
          code: 'UNKNOWN_ERROR',
          message: 'Unknown Error'
        }
      ]
    })
  })

  it('Translate with underlying error', () => {
    const MyError = defineError({
      code: {
        FIELD_VERIFY_FAILED: 'Field verify failed',
        FIELD_CANNOT_EMPTY: 'Field {name} cannot be empty',
        FIELD_TOO_LONG: 'Field {name} is too long'
      },
      i18n: {
        zh: {
          FIELD_VERIFY_FAILED: '字段验证失败',
          FIELD_CANNOT_EMPTY: '字段 {name} 不能为空',
          FIELD_TOO_LONG: '字段 {name} 过长'
        }
      }
    })

    const error = new MyError('FIELD_VERIFY_FAILED', {}, [
      new MyError('FIELD_CANNOT_EMPTY', { name: 'username' }),
      new MyError('FIELD_TOO_LONG', { name: 'password' }),
      new Error('Unknown Error')
    ])

    error.language = 'zh'
    expect(error.json()).toEqual({
      code: 'FIELD_VERIFY_FAILED',
      message: '字段验证失败',
      errors: [
        {
          code: 'FIELD_CANNOT_EMPTY',
          message: '字段 username 不能为空'
        },
        {
          code: 'FIELD_TOO_LONG',
          message: '字段 password 过长'
        },
        {
          code: 'UNKNOWN_ERROR',
          message: 'Unknown Error'
        }
      ]
    })
  })

  it('Cross Different Error Class', () => {
    const MyError = defineError({
      code: {
        FIELD_VERIFY_FAILED: 'Field verify failed'
      },
      i18n: {
        zh: {
          FIELD_VERIFY_FAILED: '字段验证失败'
        }
      }
    })

    const MyError2 = defineError({
      code: {
        FIELD_CANNOT_EMPTY: 'Field {name} cannot be empty',
        FIELD_TOO_LONG: 'Field {name} is too long'
      },
      i18n: {
        zh: {
          FIELD_CANNOT_EMPTY: '字段 {name} 不能为空',
          FIELD_TOO_LONG: '字段 {name} 过长'
        }
      }
    })

    const error = new MyError('FIELD_VERIFY_FAILED', {}, [
      new MyError2('FIELD_CANNOT_EMPTY', { name: 'username' }),
      new MyError2('FIELD_TOO_LONG', { name: 'password' }),
      new Error('Unknown Error')
    ])

    expect(error.json()).toEqual({
      code: 'FIELD_VERIFY_FAILED',
      message: 'Field verify failed',
      errors: [
        {
          code: 'FIELD_CANNOT_EMPTY',
          message: 'Field username cannot be empty'
        },
        {
          code: 'FIELD_TOO_LONG',
          message: 'Field password is too long'
        },
        {
          code: 'UNKNOWN_ERROR',
          message: 'Unknown Error'
        }
      ]
    })

    error.language = 'zh'
    expect(error.json()).toEqual({
      code: 'FIELD_VERIFY_FAILED',
      message: '字段验证失败',
      errors: [
        {
          code: 'FIELD_CANNOT_EMPTY',
          message: '字段 username 不能为空'
        },
        {
          code: 'FIELD_TOO_LONG',
          message: '字段 password 过长'
        },
        {
          code: 'UNKNOWN_ERROR',
          message: 'Unknown Error'
        }
      ]
    })
  })
})
