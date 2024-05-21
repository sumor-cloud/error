# error

A [Sumor Cloud](https://sumor.cloud) Tool.  
[More Documentation](https://sumor.cloud)
A error handling library support multi-language, predefine error code and passing data.

[![CI](https://github.com/sumor-cloud/error/actions/workflows/ci.yml/badge.svg)](https://github.com/sumor-cloud/error/actions/workflows/ci.yml)
[![Test](https://github.com/sumor-cloud/error/actions/workflows/ut.yml/badge.svg)](https://github.com/sumor-cloud/error/actions/workflows/ut.yml)
[![Coverage](https://github.com/sumor-cloud/error/actions/workflows/coverage.yml/badge.svg)](https://github.com/sumor-cloud/error/actions/workflows/coverage.yml)
[![Audit](https://github.com/sumor-cloud/error/actions/workflows/audit.yml/badge.svg)](https://github.com/sumor-cloud/error/actions/workflows/audit.yml)

## Installation

```bash
npm i @sumor/error --save
```

## Prerequisites

### Node.JS version

Require Node.JS version 16.x or above

### require Node.JS ES module

As this package is written in ES module,
please change the following code in your `package.json` file:

```json
{
  "type": "module"
}
```

## Usage

### Define Error

```js
import defineError from '@sumor/error'

const MyError = defineError({
  code: {
    USER_NOT_FOUND: 'User not found',
    USER_EXISTED: 'User {name} existed'
  }
})

throw new MyError('USER_NOT_FOUND')
// output: Error: User not found

throw new MyError('USER_EXISTED', { name: 'Alice' })
// output: Error: User Alice existed
```

### Multi-language

```js
import defineError from '@sumor/error'

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
console.log(error)
// output: Error: User Alice existed

error.language = 'zh' // change Error language
console.log(error)
// output: Error: 用户 Alice 已存在
```

### Convert Error to JSON

```js
import defineError from '@sumor/error'

const MyError = defineError({
  code: {
    USER_NOT_FOUND: 'User not found',
    USER_EXISTED: 'User {name} existed'
  }
})

const error = new MyError('USER_EXISTED', { name: 'Alice' })
console.log(error.json())
// output: {"code":"USER_EXISTED","message":"User Alice existed"}
```

### Underlying Error

```js
import defineError from '@sumor/error'

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
  new MyError('FIELD_TOO_LONG', { name: 'password' })
])

console.log(error.json())
/* 
output: 
{
  "code":"FIELD_VERIFY_FAILED",
  "message":"Field verify failed",
  "errors":[
    {
      "code":"FIELD_CANNOT_EMPTY",
      "message":"Field username cannot be empty"
    },{
      "code":"FIELD_TOO_LONG",
      "message":"Field password is too long"
    }
  ]
}
*/

error.language = 'zh'
console.log(error.json())
/*
output:
{
  "code":"FIELD_VERIFY_FAILED",
  "message":"字段验证失败",
  "errors":[
    {
      "code":"FIELD_CANNOT_EMPTY",
      "message":"字段 username 不能为空"
    },{
      "code":"FIELD_TOO_LONG",
      "message":"字段 password 过长"
    }
  ]
}
*/
```

### Combine Standard Error

```js
import defineError from '@sumor/error'

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

console.log(error.json())
/*
output:
{
  "code":"FIELD_VERIFY_FAILED",
  "message":"Field verify failed",
  "errors":[
    {
      "code":"FIELD_CANNOT_EMPTY",
      "message":"Field username cannot be empty"
    },{
      "code":"FIELD_TOO_LONG",
      "message":"Field password is too long"
    },{
      "code":"UNKNOWN_ERROR",
      "message":"Unknown Error"
    }
  ]
}
 */
```
