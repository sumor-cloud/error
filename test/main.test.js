import { describe, expect, it } from '@jest/globals'
import defineError from '../src/index.js'

describe('main', () => {
  it('error name code data', () => {
    const Error1 = defineError({ name: 'DemoError' })
    const error = new Error1('code')
    expect(error.name).toEqual('DemoError')
    expect(error.code).toEqual('code')
    expect(error.data).toEqual({})
  })
  it('wrong data', () => {
    const Error1 = defineError({ name: 'DemoError' })
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
})
