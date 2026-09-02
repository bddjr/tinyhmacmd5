import md5 from 'tinyhmacmd5';
import crypto from 'node:crypto';
import assert from 'node:assert'

console.log()
console.log('--- Pure 513MB Test (No prior small tests) ---');

const data = crypto.randomBytes(513 * 1024 * 1024);

console.time('tinyhmacmd5 MD5 timer');
let a = md5(data);
console.timeEnd('tinyhmacmd5 MD5 timer');
console.time('node:crypto MD5 timer');
let b = crypto.hash('md5', data, 'hex')
console.timeEnd('node:crypto MD5 timer');
assert.strictEqual(a, b, `Failed to test MD5`)

const key = crypto.randomBytes(16)

console.time('tinyhmacmd5 HMAC-MD5 timer');
a = md5(data, key);
console.timeEnd('tinyhmacmd5 HMAC-MD5 timer');
console.time('node:crypto HMAC-MD5 timer');
b = crypto.createHmac('md5', key).update(data).digest('hex')
console.timeEnd('node:crypto HMAC-MD5 timer');
assert.strictEqual(a, b, `Failed to test HMAC-MD5`)
