import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { z } from 'zod'

const validators = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/validators.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: validators.exports, require: () => ({ z }) })

class DatabaseError extends Error {
  constructor(code) { super('private database diagnostic'); this.code = code }
}
function setup({ existing = null, lookupError, createError, signInError } = {}) {
  const calls = { created: 0, signedIn: 0, logs: [] }
  const mocks = {
    '@/lib/auth': {
      signIn: async () => { calls.signedIn++; if (signInError) throw signInError },
      signOut: async () => {},
    },
    '@/lib/db': { db: { user: {
      findUnique: async () => { if (lookupError) throw lookupError; return existing },
      create: async ({ data }) => {
        if (createError) throw createError
        assert.equal(data.password, 'hashed-password')
        calls.created++
      },
    } } },
    bcryptjs: { default: { hash: async () => 'hashed-password' } },
    '@/lib/validators': validators.exports,
    'next-auth': { AuthError: class extends Error {} },
    '@prisma/client': { Prisma: { PrismaClientKnownRequestError: DatabaseError } },
  }
  const exports = {}
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/actions/auth.actions.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, { exports, require: name => {
    assert.ok(name in mocks, `Unexpected import: ${name}`)
    return mocks[name]
  }, console: { error: (...args) => calls.logs.push(args) }, Error })
  return { register: exports.register, calls }
}
const input = { name: 'Test Customer', email: 'customer@example.com', password: 'secret123', confirmPassword: 'secret123' }

test('valid signup creates the account and signs in', async () => {
  const { register, calls } = setup()
  const result = await register(input)
  assert.equal(result.success, true)
  assert.equal(result.redirectTo, '/')
  assert.equal(calls.created, 1)
  assert.equal(calls.signedIn, 1)
})
test('invalid input never reaches account creation', async () => {
  const { register, calls } = setup()
  assert.equal((await register({ ...input, confirmPassword: 'different' })).success, false)
  assert.equal(calls.created, 0)
})
test('existing email and concurrent duplicate return a form error', async () => {
  for (const options of [{ existing: { id: 'existing' } }, { createError: new DatabaseError('P2002') }]) {
    const { register, calls } = setup(options)
    const result = await register(input)
    assert.match(result.error, /already exists/)
    assert.equal(calls.signedIn, 0)
  }
})
test('database failures return a safe form error instead of throwing', async () => {
  for (const options of [{ lookupError: new DatabaseError('P1001') }, { createError: new Error('sensitive connection details') }]) {
    const { register, calls } = setup(options)
    const result = await register(input)
    assert.equal(result.success, false)
    assert.match(result.error, /try again later/)
    assert.equal(calls.signedIn, 0)
    assert.doesNotMatch(JSON.stringify(calls.logs), /sensitive|secret123|customer@example/)
  }
})
test('failed automatic sign-in keeps the created account and sends customer to login', async () => {
  const { register, calls } = setup({ signInError: new Error('session failure') })
  const result = await register(input)
  assert.equal(result.success, true)
  assert.equal(result.redirectTo, '/login?registered=true')
  assert.equal(calls.created, 1)
})
