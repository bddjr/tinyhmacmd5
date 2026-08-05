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

  /**
   * @param {typeof ff} f
   * @param {number} s0
   * @param {number} s1
   * @param {number} s2
   * @param {number} s3
   * @param {number} x0
   * @param {number} x1
   * @param {number} x2
   * @param {number} x3
   * @param {number} x4
   * @param {number} x5
   * @param {number} x6
   * @param {number} x7
   * @param {number} x8
   * @param {number} x9
   * @param {number} x10
   * @param {number} x11
   * @param {number} x12
   * @param {number} x13
   * @param {number} x14
   * @param {number} x15
   */
  var F = (
    f, s0, s1, s2, s3,
    x0, x1, x2, x3, x4, x5, x6, x7,
    x8, x9, x10, x11, x12, x13, x14, x15
  ) => {
    /**
     * @param {number} x0 
     * @param {number} x1 
     * @param {number} x2 
     * @param {number} x3 
     */
    var F4 = (x0, x1, x2, x3) => {
      a = f(a, b, c, d, x0, s0)
      d = f(d, a, b, c, x1, s1)
      c = f(c, d, a, b, x2, s2)
      b = f(b, c, d, a, x3, s3)
    }
    F4(x0, x1, x2, x3)
    F4(x4, x5, x6, x7)
    F4(x8, x9, x10, x11)
    F4(x12, x13, x14, x15)
  }

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

    F(ff, 7, 12, 17, 22,
      x0 = X(), x1 = X(), x2 = X(), x3 = X(),
      x4 = X(), x5 = X(), x6 = X(), x7 = X(),
      x8 = X(), x9 = X(), x10 = X(), x11 = X(),
      x12 = X(), x13 = X(), x14 = X(), x15 = X()
    )

    F(gg, 5, 9, 14, 20,
      x1, x6, x11, x0,
      x5, x10, x15, x4,
      x9, x14, x3, x8,
      x13, x2, x7, x12
    )

    F(hh, 4, 11, $16, 23,
      x5, x8, x11, x14,
      x1, x4, x7, x10,
      x13, x0, x3, x6,
      x9, x12, x15, x2
    )

    F(ii, 6, 10, 15, 21,
      x0, x7, x14, x5,
      x12, x3, x10, x1,
      x8, x15, x6, x13,
      x4, x11, x2, x9
    )

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
