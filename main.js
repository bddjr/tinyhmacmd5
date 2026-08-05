/** @license https://github.com/bddjr/tinyhmacmd5/blob/HEAD/LICENSE */

// Adapted from https://github.com/blueimp/JavaScript-MD5

/** @type {"length"} */
let $length = "length"

/** @type {16} */
let $16 = 16

let floor = Math.floor

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

/**
 * Basic operation the algorithm uses.
 *
 * @param {number} q q
 * @param {number} a a
 * @param {number} b b
 * @param {number} x x
 * @param {number} s s
 * @param {number} t t
 * @returns {number} Result
 */
let md5cmn = (q, a, b, x, s, t) => safeAdd(bitRotateLeft(safeAdd(a, q) + safeAdd(x, t), s), b)

/**
 * Basic operation the algorithm uses.
 *
 * @param {number} a a
 * @param {number} b b
 * @param {number} c c
 * @param {number} d d
 * @param {number} x x
 * @param {number} s s
 * @param {number} t t
 * @returns {number} Result
 */
let md5ff = (a, b, c, d, x, s, t) => md5cmn((b & c) | (~b & d), a, b, x, s, t)

/**
 * Basic operation the algorithm uses.
 *
 * @param {number} a a
 * @param {number} b b
 * @param {number} c c
 * @param {number} d d
 * @param {number} x x
 * @param {number} s s
 * @param {number} t t
 * @returns {number} Result
 */
let md5gg = (a, b, c, d, x, s, t) => md5cmn((b & d) | (c & ~d), a, b, x, s, t)

/**
 * Basic operation the algorithm uses.
 *
 * @param {number} a a
 * @param {number} b b
 * @param {number} c c
 * @param {number} d d
 * @param {number} x x
 * @param {number} s s
 * @param {number} t t
 * @returns {number} Result
 */
let md5hh = (a, b, c, d, x, s, t) => md5cmn(b ^ c ^ d, a, b, x, s, t)

/**
 * Basic operation the algorithm uses.
 *
 * @param {number} a a
 * @param {number} b b
 * @param {number} c c
 * @param {number} d d
 * @param {number} x x
 * @param {number} s s
 * @param {number} t t
 * @returns {number} Result
 */
let md5ii = (a, b, c, d, x, s, t) => md5cmn(c ^ (b | ~d), a, b, x, s, t)

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
    , b = -271733879
    , c = -1732584194
    , d = 271733878
    , padLenIndex = floor((bitLen + 64) / 512) * $16 + 14

  // append padding
  x[floor(bitLen / 32)] |= 0x80 << bitLen % 32;
  x[padLenIndex] = 0 | bitLen;
  x[padLenIndex + 1] = 0 | bitLen / 0x100000000;

  for (; i < x[$length]; d = safeAdd(d, oldd)) {
    let [
      x0, x1, x2, x3, x4, x5, x6, x7,
      x8, x9, x10, x11, x12, x13, x14, x15
    ] = x.slice(i, i += $16)

    olda = a
    oldb = b
    oldc = c
    oldd = d

    a = md5ff(a, b, c, d, x0, 7, -680876936)
    d = md5ff(d, a, b, c, x1, 12, -389564586)
    c = md5ff(c, d, a, b, x2, 17, 606105819)
    b = md5ff(b, c, d, a, x3, 22, -1044525330)
    a = md5ff(a, b, c, d, x4, 7, -176418897)
    d = md5ff(d, a, b, c, x5, 12, 1200080426)
    c = md5ff(c, d, a, b, x6, 17, -1473231341)
    b = md5ff(b, c, d, a, x7, 22, -45705983)
    a = md5ff(a, b, c, d, x8, 7, 1770035416)
    d = md5ff(d, a, b, c, x9, 12, -1958414417)
    c = md5ff(c, d, a, b, x10, 17, -42063)
    b = md5ff(b, c, d, a, x11, 22, -1990404162)
    a = md5ff(a, b, c, d, x12, 7, 1804603682)
    d = md5ff(d, a, b, c, x13, 12, -40341101)
    c = md5ff(c, d, a, b, x14, 17, -1502002290)
    b = md5ff(b, c, d, a, x15, 22, 1236535329)

    a = md5gg(a, b, c, d, x1, 5, -165796510)
    d = md5gg(d, a, b, c, x6, 9, -1069501632)
    c = md5gg(c, d, a, b, x11, 14, 643717713)
    b = md5gg(b, c, d, a, x0, 20, -373897302)
    a = md5gg(a, b, c, d, x5, 5, -701558691)
    d = md5gg(d, a, b, c, x10, 9, 38016083)
    c = md5gg(c, d, a, b, x15, 14, -660478335)
    b = md5gg(b, c, d, a, x4, 20, -405537848)
    a = md5gg(a, b, c, d, x9, 5, 568446438)
    d = md5gg(d, a, b, c, x14, 9, -1019803690)
    c = md5gg(c, d, a, b, x3, 14, -187363961)
    b = md5gg(b, c, d, a, x8, 20, 1163531501)
    a = md5gg(a, b, c, d, x13, 5, -1444681467)
    d = md5gg(d, a, b, c, x2, 9, -51403784)
    c = md5gg(c, d, a, b, x7, 14, 1735328473)
    b = md5gg(b, c, d, a, x12, 20, -1926607734)

    a = md5hh(a, b, c, d, x5, 4, -378558)
    d = md5hh(d, a, b, c, x8, 11, -2022574463)
    c = md5hh(c, d, a, b, x11, $16, 1839030562)
    b = md5hh(b, c, d, a, x14, 23, -35309556)
    a = md5hh(a, b, c, d, x1, 4, -1530992060)
    d = md5hh(d, a, b, c, x4, 11, 1272893353)
    c = md5hh(c, d, a, b, x7, $16, -155497632)
    b = md5hh(b, c, d, a, x10, 23, -1094730640)
    a = md5hh(a, b, c, d, x13, 4, 681279174)
    d = md5hh(d, a, b, c, x0, 11, -358537222)
    c = md5hh(c, d, a, b, x3, $16, -722521979)
    b = md5hh(b, c, d, a, x6, 23, 76029189)
    a = md5hh(a, b, c, d, x9, 4, -640364487)
    d = md5hh(d, a, b, c, x12, 11, -421815835)
    c = md5hh(c, d, a, b, x15, $16, 530742520)
    b = md5hh(b, c, d, a, x2, 23, -995338651)

    a = md5ii(a, b, c, d, x0, 6, -198630844)
    d = md5ii(d, a, b, c, x7, 10, 1126891415)
    c = md5ii(c, d, a, b, x14, 15, -1416354905)
    b = md5ii(b, c, d, a, x5, 21, -57434055)
    a = md5ii(a, b, c, d, x12, 6, 1700485571)
    d = md5ii(d, a, b, c, x3, 10, -1894986606)
    c = md5ii(c, d, a, b, x10, 15, -1051523)
    b = md5ii(b, c, d, a, x1, 21, -2054922799)
    a = md5ii(a, b, c, d, x8, 6, 1873313359)
    d = md5ii(d, a, b, c, x15, 10, -30611744)
    c = md5ii(c, d, a, b, x6, 15, -1560198380)
    b = md5ii(b, c, d, a, x13, 21, 1309151649)
    a = md5ii(a, b, c, d, x4, 6, -145523070)
    d = md5ii(d, a, b, c, x11, 10, -1120210379)
    c = md5ii(c, d, a, b, x2, 15, 718787259)
    b = md5ii(b, c, d, a, x9, 21, -343485551)

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
    , out = new Uint8Array(i)

  if (key != null) {
    // HMAC
    let bkey = bytesToBinl(key = inputToBytes(key))
      , pad = (/**@type {number}*/ x) => {
        for (; i;) {
          bdata.unshift(x ^ bkey[--i])
        }
        i = $16
      }
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
    : out.reduce((p, v) => p + (v >> 4 && '') + v.toString($16), '')
}

export default md5
