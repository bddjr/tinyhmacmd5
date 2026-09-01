import fs from 'node:fs'
import crypto from 'node:crypto'
import assert from 'node:assert'

/**
 * @param {string | NodeJS.ArrayBufferView<ArrayBufferLike>} data
 */
const nodeMD5 = (data) => crypto.createHash('md5').update(data).digest('hex')

/**
 * @param {string | NodeJS.ArrayBufferView<ArrayBufferLike>} data
 * @param {crypto.KeyLike} key
 */
const nodeHmacMD5 = (data, key) => crypto.createHmac('md5', key).update(data).digest('hex')

let test513Once = true

/**
 * @param {typeof import("tinyhmacmd5").default} md5
 */
function test(md5) {
    /**
     * @param {string | Uint8Array | Uint8ClampedArray} data
     * @param {string | Uint8Array | Uint8ClampedArray} key
     */
    function test(data, key) {
        console.log('data:', data)
        console.log('key:', key)

        console.time("md5 timer")
        let a = md5(data)
        console.timeEnd("md5 timer")
        let b = nodeMD5(data)
        console.log('md5: tinyhmacmd5:', a, 'nodejs:', b)
        assert.strictEqual(a, b, `Failed to test MD5`)

        console.time("hmacmd5 timer")
        a = md5(data, key)
        console.timeEnd("hmacmd5 timer")
        b = nodeHmacMD5(data, key)
        console.log('hmacmd5: tinyhmacmd5:', a, 'nodejs:', b)
        assert.strictEqual(a, b, `Failed to test HMAC-MD5`)

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
    test('Hello world!👋', 'HMAC key 🔑')
    test('The quick brown fox jumps over the lazy dog', 'HMAC key 🔑')
    test(Uint8Array.of(1, 2, 3), Uint8Array.of(4, 5, 6))

    test(Uint8ClampedArray.of(1, 2, 3), Uint8ClampedArray.of(4, 5, 6))

    for (const n of [55, 56, 57, 63, 64, 65, 119, 120, 121]) {
        for (const k of [0, 1, 63, 64, 65, 128]) {
            test(crypto.randomBytes(n), crypto.randomBytes(k))
        }
    }

    test('', '')
    test('a', 'a')

    for (let i = 0; i < 3; i++) {
        const data = crypto.randomUUID()
        const key = crypto.randomUUID()
        test(data, key)
    }

    test("Hi There", new Uint8Array(16).fill(0x0b))
    test("what do ya want for nothing?", "Jefe")
    test(new Uint8Array(50).fill(0xDD), new Uint8Array(16).fill(0xAA))

    console.log(`test output raw`)
    assert.strict(
        crypto.createHmac('md5', 'HMAC key 🔑').update('Hello world!👋').digest().equals(
            md5('Hello world!👋', 'HMAC key 🔑', true)
        ),
        `Failed to test output raw`
    )
    console.log()

    // 513 MiB
    if (test513Once) {
        test513Once = false
        test(crypto.randomBytes(513 * 1024 * 1024), crypto.randomBytes(16))
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
