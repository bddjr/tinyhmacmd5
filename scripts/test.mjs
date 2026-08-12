import fs from 'node:fs'
import crypto from 'node:crypto'

/**
 * @param {string | NodeJS.ArrayBufferView<ArrayBufferLike>} data
 */
const nodeMD5 = (data) => crypto.createHash('md5').update(data).digest('hex')

/**
 * @param {string | NodeJS.ArrayBufferView<ArrayBufferLike>} data
 * @param {crypto.KeyLike} key
 */
const nodeHmacMD5 = (data, key) => crypto.createHmac('md5', key).update(data).digest('hex')

let test663Once = true

/**
 * @param {typeof import("tinyhmacmd5").default} md5
 */
function test(md5) {
    /**
     * @param {string | Uint8Array} data
     * @param {string | Uint8Array} key
     */
    function test(data, key) {
        console.log('data:', data)
        console.log('key:', key)

        let a = md5(data), b = nodeMD5(data)
        console.log('md5: tinyhmacmd5:', a, 'nodejs:', b)
        if (a !== b)
            throw Error(`Failed to test md5`)

        a = md5(data, key), b = nodeHmacMD5(data, key)
        console.log('hmacmd5: tinyhmacmd5:', a, 'nodejs:', b)
        if (a !== b)
            throw Error(`Failed to test hmacmd5`)

        console.log()

    }

    test('', crypto.randomBytes(4).toString('hex'))
    test('1', crypto.randomBytes(4).toString('hex'))
    test('12', crypto.randomBytes(5).toString('hex'))
    test('123', crypto.randomBytes(6).toString('hex'))
    test('1234', crypto.randomBytes(7).toString('hex'))
    test('Hello world', crypto.randomBytes(8).toString('hex'))
    test('Hello world!', crypto.randomBytes(9).toString('hex'))
    test('Hello world!👋', crypto.randomBytes(10).toString('hex'))
    test('Hello world!👋', crypto.randomBytes(63))
    test('Hello world!👋', crypto.randomBytes(64))
    test('Hello world!👋', crypto.randomBytes(65))
    test('Hello world!👋', 'HMAC key 🔑')
    test('The quick brown fox jumps over the lazy dog', 'HMAC key 🔑')
    test(Uint8Array.of(1, 2, 3), Uint8Array.of(4, 5, 6))
    test('', '')

    for (let i = 0; i < 3; i++) {
        const data = crypto.randomUUID()
        const key = crypto.randomUUID()
        test(data, key)
    }

    test("Hi There", new Uint8Array(16).fill(0x0b))
    test("what do ya want for nothing?", "Jefe")
    test(new Uint8Array(50).fill(0xDD), new Uint8Array(16).fill(0xAA))

    // 663 MiB
    if (test663Once) {
        test663Once = false
        test(crypto.randomBytes(663 * 1024 * 1024), crypto.randomBytes(16))
    }

    console.log('ok')
    console.log()
}

console.log('test browser.min.js');

; (0, eval)(fs.readFileSync('browser.min.js').toString())
if (typeof md5 != 'function')
    throw Error(`browser.min.js is invalid`)
test(md5)
delete global.md5

console.log('=======================');
console.log('test main.js');
console.log();

import md5 from "tinyhmacmd5";
test(md5)
