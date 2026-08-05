/** @license https://github.com/bddjr/tinyhmacmd5/blob/HEAD/LICENSE */

// Adapted from https://github.com/blueimp/JavaScript-MD5

/** @type {"length"} */
let $length = "length"

/** @type {16} */
let $16 = 16

/** @type {number} */
let $2_32 = 2 ** 32

let $Math = Math

let floor = $Math.floor

/**
 * Add integers, wrapping at 2^32.
 *
 * @param {number} x First integer
 * @param {number} y Second integer
 * @returns {number} Sum
 */
let safeAdd = (x, y) => 0 | (0 | x) + (0 | y)

/**
 * Bitwise rotate a 32-bit number to the left.
 *
 * @param {number} num 32-bit number
 * @param {number} cnt Rotation count
 * @returns {number} Rotated number
 */
let bitRotateLeft = (num, cnt) => (num << cnt) | (num >>> (32 - cnt))

/** @type {number[]} MD5 constants cached in memory */
let K = Array(64)

/**
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 *
 * @param {number[]} x Array of little-endian words
 * @param {number} bitLen Bit length
 * @returns {[number, number, number, number]} MD5 Array
 */
let binlMD5 = (x, bitLen) => {
  var i = 0
    , olda
    , oldb
    , oldc
    , oldd
    , a = 1732584193
    , d = 271733878
    , c = ~a
    , b = ~d

  /** @type {number} */
  var k_i

  /**
  * @param {number} q
  * @param {number} a
  * @param {number} b
  * @param {number} x
  * @param {number} s
  * @returns {number} Result
  */
  var cmn = (q, a, b, x, s) => safeAdd(bitRotateLeft(
    safeAdd(a, q) + safeAdd(x, K[k_i++] ??= 0 | $2_32 * $Math.abs($Math.sin(k_i))),
    s
  ), b)

  /**
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} x
   * @param {number} s
   * @returns {number} Result
   */
  var ff = (a, b, c, d, x, s) => cmn((b & c) | (~b & d), a, b, x, s)

  /**
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} x
   * @param {number} s
   * @returns {number} Result
   */
  var gg = (a, b, c, d, x, s) => cmn((b & d) | (c & ~d), a, b, x, s)

  /**
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} x
   * @param {number} s
   * @returns {number} Result
   */
  var hh = (a, b, c, d, x, s) => cmn(b ^ c ^ d, a, b, x, s)

  /**
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} x
   * @param {number} s
   * @returns {number} Result
   */
  var ii = (a, b, c, d, x, s) => cmn(c ^ (b | ~d), a, b, x, s)

  var x0, x1, x2, x3, x4, x5, x6, x7,
    x8, x9, x10, x11, x12, x13, x14, x15

  var X = (/**@type {*}*/ _) => x[i++]

  var padLenIndex = floor((bitLen + 64) / 512) * $16 + 14

  // append padding
  x[floor(bitLen / 32)] |= 0x80 << bitLen % 32;
  x[padLenIndex] = 0 | bitLen;
  x[padLenIndex + 1] = 0 | bitLen / $2_32;

  for (; i < x[$length]; d = safeAdd(d, oldd)) {
    olda = a
    oldb = b
    oldc = c
    oldd = d

    k_i = 0

    a = ff(a, b, c, d, x0 = X(), 7)
    d = ff(d, a, b, c, x1 = X(), 12)
    c = ff(c, d, a, b, x2 = X(), 17)
    b = ff(b, c, d, a, x3 = X(), 22)
    a = ff(a, b, c, d, x4 = X(), 7)
    d = ff(d, a, b, c, x5 = X(), 12)
    c = ff(c, d, a, b, x6 = X(), 17)
    b = ff(b, c, d, a, x7 = X(), 22)
    a = ff(a, b, c, d, x8 = X(), 7)
    d = ff(d, a, b, c, x9 = X(), 12)
    c = ff(c, d, a, b, x10 = X(), 17)
    b = ff(b, c, d, a, x11 = X(), 22)
    a = ff(a, b, c, d, x12 = X(), 7)
    d = ff(d, a, b, c, x13 = X(), 12)
    c = ff(c, d, a, b, x14 = X(), 17)
    b = ff(b, c, d, a, x15 = X(), 22)

    a = gg(a, b, c, d, x1, 5)
    d = gg(d, a, b, c, x6, 9)
    c = gg(c, d, a, b, x11, 14)
    b = gg(b, c, d, a, x0, 20)
    a = gg(a, b, c, d, x5, 5)
    d = gg(d, a, b, c, x10, 9)
    c = gg(c, d, a, b, x15, 14)
    b = gg(b, c, d, a, x4, 20)
    a = gg(a, b, c, d, x9, 5)
    d = gg(d, a, b, c, x14, 9)
    c = gg(c, d, a, b, x3, 14)
    b = gg(b, c, d, a, x8, 20)
    a = gg(a, b, c, d, x13, 5)
    d = gg(d, a, b, c, x2, 9)
    c = gg(c, d, a, b, x7, 14)
    b = gg(b, c, d, a, x12, 20)

    a = hh(a, b, c, d, x5, 4)
    d = hh(d, a, b, c, x8, 11)
    c = hh(c, d, a, b, x11, $16)
    b = hh(b, c, d, a, x14, 23)
    a = hh(a, b, c, d, x1, 4)
    d = hh(d, a, b, c, x4, 11)
    c = hh(c, d, a, b, x7, $16)
    b = hh(b, c, d, a, x10, 23)
    a = hh(a, b, c, d, x13, 4)
    d = hh(d, a, b, c, x0, 11)
    c = hh(c, d, a, b, x3, $16)
    b = hh(b, c, d, a, x6, 23)
    a = hh(a, b, c, d, x9, 4)
    d = hh(d, a, b, c, x12, 11)
    c = hh(c, d, a, b, x15, $16)
    b = hh(b, c, d, a, x2, 23)

    a = ii(a, b, c, d, x0, 6)
    d = ii(d, a, b, c, x7, 10)
    c = ii(c, d, a, b, x14, 15)
    b = ii(b, c, d, a, x5, 21)
    a = ii(a, b, c, d, x12, 6)
    d = ii(d, a, b, c, x3, 10)
    c = ii(c, d, a, b, x10, 15)
    b = ii(b, c, d, a, x1, 21)
    a = ii(a, b, c, d, x8, 6)
    d = ii(d, a, b, c, x15, 10)
    c = ii(c, d, a, b, x6, 15)
    b = ii(b, c, d, a, x13, 21)
    a = ii(a, b, c, d, x4, 6)
    d = ii(d, a, b, c, x11, 10)
    c = ii(c, d, a, b, x2, 15)
    b = ii(b, c, d, a, x9, 21)

    a = safeAdd(a, olda)
    b = safeAdd(b, oldb)
    c = safeAdd(c, oldc)
  }
  return [a, b, c, d]
}

/**
 * Convert bytes to an array of little-endian words
 *
 * @param {Uint8Array} input Raw bytes
 * @returns {number[]} Array of little-endian words
 */
let bytesToBinl = (input) => {
  var i = input[$length]
  /** @type {number[]} */
  var output = []
  for (; i;) {
    output[floor(--i / 4)] |= input[i] << i % 4 * 8
  }
  return output
}

/**
 * @param {string | Uint8Array} input 
 * @returns {Uint8Array}
 */
let inputToBytes = (input) => (
  typeof input == 'string'
    ? new TextEncoder().encode(input)
    : input
)

/**
 * @overload
 * @param {string | Uint8Array} data
 * @param {string | Uint8Array | null} [key]
 * @param {false} [raw]
 * @returns {string}
 */
/**
 * @overload
 * @param {string | Uint8Array} data
 * @param {string | Uint8Array | null} [key]
 * @param {true} raw
 * @returns {Uint8Array<ArrayBuffer>}
 */
/**
 * Computes the MD5 hash of the input data.  
 * If a key is provided, computes HMAC-MD5.  
 * By default, returns the hash as a lowercase hexadecimal string.  
 * If `raw` is true, returns a Uint8Array.  
 *
 * @param {string | Uint8Array} data The input data to hash. Strings are UTF‑8 encoded.
 * @param {string | Uint8Array | null} [key] Optional HMAC key. When given, HMAC‑MD5 is calculated instead of plain MD5.
 * @param {boolean} [raw] If true, the hash is returned as raw bytes (Uint8Array); otherwise, as a hex string.
 * @returns {string | Uint8Array<ArrayBuffer>} The MD5 (or HMAC‑MD5) digest, either as a hex string or a Uint8Array.
 */
var md5 = (data, key, raw) => {
  var bdata = bytesToBinl(data = inputToBytes(data))
    , bitLen = data[$length] * 8
    , i = $16
    , out = new Uint8Array($16)
  /** @type {*} */
  var bkey
    , pad = (/**@type {number}*/ x) => {
      bdata.unshift(...Array($16))
      for (; i;) {
        bdata[--i] = x ^ bkey[i]
      }
      i = $16
    }

  if (key != null) {
    // HMAC
    bkey = bytesToBinl(key = inputToBytes(key))
    if (bkey[$length] > $16) {
      bkey = binlMD5(bkey, key[$length] * 8)
    }
    pad(0x36363636)
    bdata = binlMD5(bdata, 512 + bitLen)
    pad(0x5c5c5c5c)
    bitLen = 512 + 128
  }

  bdata = binlMD5(bdata, bitLen)

  // binl to bytes
  for (; i;) {
    out[--i] = bdata[i >> 2] >>> i % 4 * 8
  }

  return raw
    ? out
    : out.toHex
      ? out.toHex()
      : out.reduce((p, v) => p + (v >> 4 && '') + v.toString($16), '')
}

export default md5
